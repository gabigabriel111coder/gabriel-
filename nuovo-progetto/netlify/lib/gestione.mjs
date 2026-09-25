/* ==========================================================================
   Regole del gestionale: come nasce una richiesta, quando partono
   promemoria e richiesta di recensione, cosa succede a ogni cambio di stato.
   ========================================================================== */
import { agenda } from "./archivio.mjs";
import { canaliPer, inviaAlCliente, registra } from "./notifiche.mjs";
import { clip, clipTesto, giornoRoma, lingua, newId, romeParts, romeToUtc, spostaGiorno, waNumber } from "./utili.mjs";

export const STATI = ["nuova", "confermata", "completata", "annullata"];

// Campi dei moduli che finiscono nei dettagli della richiesta (con il nome da mostrare nel pannello)
const DETTAGLI = {
  servizio: "Servizio", problema: "Problema", quando: "Quando richiamare", giorno: "Giorno", orario: "Orario",
  dispositivo: "Dispositivo", azienda: "Azienda", postazioni: "Postazioni"
};

// Dati di un modulo del sito → richiesta. Salva solo i campi utili: niente IP o browser.
export function daModulo(payload) {
  const d = payload?.data || {};
  const dettagli = {};
  for (const [campo, etichetta] of Object.entries(DETTAGLI)) {
    const v = clip(d[campo], 120);
    if (v) dettagli[etichetta] = v;
  }
  const richiesto = /^\d{4}-\d{2}-\d{2}$/.test(d.data || "") && /^\d{2}:\d{2}$/.test(d.orario || "") ? romeToUtc(`${d.data}T${d.orario}`) : null;
  return {
    id: newId(),
    creata: new Date().toISOString(),
    modulo: ["richiamata", "prenotazione", "preventivo-aziende"].includes(payload?.form_name) ? payload.form_name : "altro",
    lingua: lingua(d.lingua),
    nome: clip(d.nome, 60),
    telefono: clip(d.telefono, 20),
    email: clip(d.email, 100).toLowerCase(),
    consenso: d.aggiornamenti === "si",
    dettagli,
    messaggio: clipTesto(d.messaggio || d.esigenze, 1000),
    richiesto: richiesto ? richiesto.toISOString() : null,
    stato: "nuova",
    appuntamento: null,
    completata: null,
    note: "",
    messaggi: [],
    lavori: []
  };
}

// Voce inserita a mano dal pannello (clienti arrivati da telefono o WhatsApp)
export function daPannello(dati) {
  return {
    ...daModulo({ form_name: "manuale", data: {} }),
    modulo: "manuale",
    lingua: lingua(dati.lingua),
    nome: clip(dati.nome, 60),
    telefono: clip(dati.telefono, 20),
    email: clip(dati.email, 100).toLowerCase(),
    consenso: dati.consenso === true || dati.aggiornamenti === "si",
    messaggio: clipTesto(dati.messaggio, 1000)
  };
}

export function valida(r) {
  if (!r.nome) return "Manca il nome";
  if (waNumber(r.telefono).length < 8) return "Numero di telefono non valido";
  if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) return "Email non valida";
  return "";
}

/* ---------- Quando mandare i messaggi (ora italiana) ---------- */
// Promemoria: 3 ore prima, tra le 8 e le 21. Per gli appuntamenti presto al mattino arriva la sera prima alle 19.
export function quandoPromemoria(appuntamento, adesso = new Date()) {
  const t = appuntamento.getTime();
  if (t - adesso.getTime() < 4 * 3600e3) return null; // troppo vicino: basta la conferma
  let quando = new Date(t - 3 * 3600e3);
  const p = romeParts(quando);
  if (p.ora < 8) {
    const otto = romeToUtc(`${giornoRoma(quando)}T08:00`);
    quando = t - otto.getTime() >= 3600e3 ? otto : romeToUtc(`${spostaGiorno(giornoRoma(quando), -1)}T19:00`);
  } else if (p.ora >= 21) {
    quando = romeToUtc(`${giornoRoma(quando)}T19:00`);
  }
  return quando > adesso ? quando : null;
}
// Recensione: il giorno dopo l'intervento (circa 20 ore dopo), tra le 10 e le 19
export function quandoRecensione(completata) {
  let quando = new Date(completata.getTime() + 20 * 3600e3);
  const p = romeParts(quando);
  if (p.ora < 10) quando = romeToUtc(`${giornoRoma(quando)}T10:00`);
  else if (p.ora >= 19) quando = romeToUtc(`${spostaGiorno(giornoRoma(quando), 1)}T10:00`);
  return quando;
}

async function togliLavori(r) {
  await agenda.togli(r.lavori || []);
  r.lavori = [];
}

/* ---------- Cambi di stato ---------- */
export async function conferma(r, appuntamento, { invia = true } = {}) {
  await togliLavori(r);
  r.stato = "confermata";
  r.appuntamento = appuntamento.toISOString();
  r.completata = null;
  const promemoria = quandoPromemoria(appuntamento);
  if (promemoria && canaliPer(r, "promemoria").length) r.lavori.push(await agenda.programma("promemoria", r.id, promemoria));
  if (invia) registra(r, "conferma", await inviaAlCliente(r, "conferma"), { rif: r.appuntamento });
  return r;
}

export async function completa(r) {
  await togliLavori(r);
  r.stato = "completata";
  r.completata = new Date().toISOString();
  const giaChiesta = (r.messaggi || []).some((m) => m.tipo === "recensione" && m.ok);
  if (!giaChiesta && canaliPer(r, "recensione").length) r.lavori.push(await agenda.programma("recensione", r.id, quandoRecensione(new Date(r.completata))));
  return r;
}

export async function annulla(r) {
  await togliLavori(r);
  r.stato = "annullata";
  return r;
}

export async function riapri(r) {
  await togliLavori(r);
  r.stato = "nuova";
  r.appuntamento = null;
  r.completata = null;
  return r;
}

// Testo per Telegram quando arriva una nuova richiesta
const TITOLI = {
  richiamata: "📞 Nuova richiesta di richiamata",
  prenotazione: "📅 Nuova prenotazione",
  "preventivo-aziende": "🏢 Nuova richiesta da un'azienda",
  manuale: "📝 Nuova voce"
};
export function avvisoNuova(r, sito) {
  const righe = [TITOLI[r.modulo] || "Nuova richiesta", "", `Nome: ${r.nome}`, `Telefono: ${r.telefono}`];
  if (r.email) righe.push(`Email: ${r.email}`);
  for (const [k, v] of Object.entries(r.dettagli || {})) righe.push(`${k}: ${v}`);
  if (r.messaggio) righe.push(`Messaggio: ${r.messaggio.slice(0, 600)}`);
  righe.push(`Lingua: ${r.lingua === "en" ? "inglese" : "italiano"} · Messaggi WhatsApp: ${r.consenso ? "sì" : "no"}`);
  const wa = waNumber(r.telefono);
  if (wa.length >= 10) righe.push("", `Scrivi su WhatsApp: https://wa.me/${wa}`);
  if (sito) righe.push(`Gestisci: ${sito}/tecnico/richieste.html`);
  return righe.join("\n");
}
