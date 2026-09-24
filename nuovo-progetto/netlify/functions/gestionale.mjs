/* ==========================================================================
   Gestionale del tecnico: richieste, appuntamenti, messaggi e PC monitorati.
   Risponde solo al pannello (sito/tecnico) con la chiave ADMIN_TOKEN.
   ========================================================================== */
import DATI from "../lib/dati.mjs";
import { dispositivi, richieste } from "../lib/archivio.mjs";
import { annulla, completa, conferma, daPannello, riapri, valida } from "../lib/gestione.mjs";
import { canali, email, inviaAlCliente, registra, telegram, TIPI, whatsapp } from "../lib/notifiche.mjs";
import { adminAttivo, adminOk, clip, clipTesto, idValido, json, lingua, newId, nuovaChiave, romeToUtc, sha256 } from "../lib/utili.mjs";

const MAX_CORPO = 20_000;
const nonTrovata = () => json({ errore: "Richiesta non trovata: forse è stata eliminata. Aggiorna la pagina." }, 404);
const trova = (id) => (idValido(id) ? richieste.get(id) : null);
const salvaERispondi = async (r, extra = {}) => {
  await richieste.salva(r);
  return json({ richiesta: r, ...extra });
};
// Il pannello manda l'ora italiana così come scritta ("2026-10-07T15:30"): vale anche se il PC ha un altro fuso orario
const dataAppuntamento = (valore) => {
  const d = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(valore || "")) ? romeToUtc(valore) : new Date(valore);
  if (!valore || !d || Number.isNaN(d.getTime())) return { errore: "Data e ora non valide" };
  if (d.getTime() < Date.now() - 3600e3) return { errore: "L'appuntamento è nel passato" };
  if (d.getTime() > Date.now() + 366 * 864e5) return { errore: "L'appuntamento è troppo lontano" };
  return { data: d };
};

// Dati del PC senza l'impronta della chiave
const pubblico = ({ chiave, ...resto }) => resto;
// Nel percorso del backup niente caratteri che rompono il comando di installazione
const percorsoSicuro = (testo) => clip(testo, 200).replace(/[\u0000-\u001f"`$]/g, "");
const installazione = (d, chiaveChiara, req) => ({
  endpoint: `${(process.env.SITE_URL || process.env.URL || new URL(req.url).origin).replace(/\/$/, "")}/.netlify/functions/monitor`,
  id: d.id,
  chiave: chiaveChiara,
  backup: d.backup || ""
});

const AZIONI = {
  async stato() {
    const [tutte, pc] = await Promise.all([richieste.tutte(), dispositivi.tutti()]);
    return json({
      canali: canali(),
      assistente: Boolean(process.env.ANTHROPIC_API_KEY),
      richieste: tutte.filter((r) => r.stato === "nuova").length,
      pc: pc.filter((d) => !d.eliminato && !d.revocato).length
    });
  },

  /* ---------- Richieste ---------- */
  async richieste() {
    return json({ richieste: await richieste.tutte() });
  },
  async nuova(b) {
    const r = daPannello(b);
    const errore = valida(r);
    if (errore) return json({ errore }, 400);
    if (b.appuntamento) {
      const app = dataAppuntamento(b.appuntamento);
      if (app.errore) return json({ errore: app.errore }, 400);
      await richieste.salva(r);
      await conferma(r, app.data);
    }
    return salvaERispondi(r);
  },
  async conferma(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    const app = dataAppuntamento(b.appuntamento);
    if (app.errore) return json({ errore: app.errore }, 400);
    await conferma(r, app.data, { invia: b.invia !== false });
    return salvaERispondi(r);
  },
  async completa(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    return salvaERispondi(await completa(r));
  },
  async annulla(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    return salvaERispondi(await annulla(r));
  },
  async riapri(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    return salvaERispondi(await riapri(r));
  },
  async invia(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    if (!TIPI.includes(b.tipo)) return json({ errore: "Tipo di messaggio sconosciuto" }, 400);
    const esiti = await inviaAlCliente(r, b.tipo);
    if (!esiti.length) return json({ errore: "Nessun canale disponibile: il cliente non ha lasciato l'email o non ha dato il consenso a WhatsApp, oppure email e WhatsApp non sono ancora attivi." }, 400);
    registra(r, b.tipo, esiti, { manuale: true, ...(r.appuntamento ? { rif: r.appuntamento } : {}) });
    return salvaERispondi(r, { esiti });
  },
  async modifica(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    const nuovo = { ...r };
    if ("nome" in b) nuovo.nome = clip(b.nome, 60);
    if ("telefono" in b) nuovo.telefono = clip(b.telefono, 20);
    if ("email" in b) nuovo.email = clip(b.email, 100).toLowerCase();
    if ("lingua" in b) nuovo.lingua = lingua(b.lingua);
    if ("consenso" in b) nuovo.consenso = b.consenso === true;
    if ("note" in b) nuovo.note = clipTesto(b.note, 2000);
    const errore = valida(nuovo);
    if (errore) return json({ errore }, 400);
    return salvaERispondi(nuovo);
  },
  async elimina(b) {
    const r = await trova(b.id);
    if (!r) return nonTrovata();
    await annulla(r); // toglie i messaggi programmati
    await richieste.elimina(r.id);
    return json({ ok: true });
  },

  /* ---------- PC monitorati ---------- */
  async dispositivi() {
    const elenco = (await dispositivi.tutti()).filter((d) => !d.eliminato).map(pubblico);
    return json({ dispositivi: elenco.sort((a, b) => a.nome.localeCompare(b.nome, "it")) });
  },
  async "nuovo-dispositivo"(b, req) {
    const nome = clip(b.nome, 60);
    if (!nome) return json({ errore: "Scrivi il nome del cliente e del computer" }, 400);
    const chiave = nuovaChiave();
    const d = {
      id: newId(), nome, backup: percorsoSicuro(b.backup), creato: new Date().toISOString(), chiave: sha256(chiave),
      revocato: false, ultimoContatto: null, report: null, problemi: [], avvisoSilenzio: false
    };
    await dispositivi.salva(d);
    return json({ dispositivo: pubblico(d), installa: installazione(d, chiave, req) });
  },
  async "chiave-dispositivo"(b, req) {
    const d = idValido(b.id) ? await dispositivi.get(b.id) : null;
    if (!d || d.eliminato) return json({ errore: "PC non trovato" }, 404);
    const chiave = nuovaChiave(); // la vecchia smette di funzionare
    Object.assign(d, { chiave: sha256(chiave), revocato: false });
    if ("backup" in b) d.backup = percorsoSicuro(b.backup);
    await dispositivi.salva(d);
    return json({ dispositivo: pubblico(d), installa: installazione(d, chiave, req) });
  },
  async "revoca-dispositivo"(b) {
    const d = idValido(b.id) ? await dispositivi.get(b.id) : null;
    if (!d || d.eliminato) return json({ errore: "PC non trovato" }, 404);
    // Da qui in poi il programma si disinstalla; i dati dei controlli vengono cancellati subito
    Object.assign(d, { revocato: true, report: null, problemi: [] });
    await dispositivi.salva(d);
    return json({ dispositivo: pubblico(d) });
  },
  async "elimina-dispositivo"(b) {
    const d = idValido(b.id) ? await dispositivi.get(b.id) : null;
    if (!d) return json({ errore: "PC non trovato" }, 404);
    // Restano solo il codice e l'impronta della chiave: servono a dire al programma di disinstallarsi
    await dispositivi.salva({ id: d.id, chiave: d.chiave, eliminato: true, revocato: true });
    return json({ ok: true });
  },

  /* ---------- Prove dei servizi collegati ---------- */
  async prova(b) {
    let esito;
    if (b.canale === "telegram") {
      esito = await telegram("✅ Prova da Gabriel Tech: le notifiche su Telegram funzionano.");
    } else if (b.canale === "email") {
      esito = await email({
        a: clip(b.a, 100),
        oggetto: "Prova · Gabriel Tech",
        testo: "Ciao!\n\nQuesta è un'email di prova del sito Gabriel Tech: l'invio automatico funziona.",
        piede: DATI.sito
      });
    } else if (b.canale === "whatsapp") {
      // hello_world è il modello di prova che Meta approva per ogni account
      esito = await whatsapp({ a: clip(b.a, 20), modello: "hello_world", lingua: "en_US" });
    } else {
      return json({ errore: "Canale sconosciuto" }, 400);
    }
    return esito.ok ? json({ ok: true }) : json({ errore: esito.errore }, 502);
  }
};

export default async (req) => {
  if (req.method !== "POST") return json({ errore: "Metodo non consentito" }, 405);
  if (!adminAttivo()) return json({ errore: "Gestionale non attivo: imposta ADMIN_TOKEN su Netlify (almeno 24 caratteri) e ripubblica il sito." }, 503);
  if (!(await adminOk(req))) return json({ errore: "Chiave di accesso sbagliata" }, 401);

  let body;
  try {
    const testo = await req.text();
    if (testo.length > MAX_CORPO) return json({ errore: "Richiesta troppo grande" }, 413);
    body = JSON.parse(testo);
  } catch {
    return json({ errore: "Richiesta non valida" }, 400);
  }
  const azione = Object.hasOwn(AZIONI, body?.azione) ? AZIONI[body.azione] : null;
  if (!azione) return json({ errore: "Azione sconosciuta" }, 400);
  try {
    return await azione(body, req);
  } catch (err) {
    console.error(`Gestionale, azione «${body.azione}»:`, err);
    return json({ errore: "Errore del server: riprova tra poco." }, 500);
  }
};
