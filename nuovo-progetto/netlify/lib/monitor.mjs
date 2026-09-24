/* ==========================================================================
   Monitoraggio dei PC: pulizia dei dati inviati dal programma installato
   sul computer del cliente e regole che decidono quando avvisare il tecnico.
   Le soglie stanno qui, sul server: si possono cambiare senza reinstallare nulla.
   ========================================================================== */
import { clip } from "./utili.mjs";

const num = (v, min = 0, max = 1e7) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : null;
};
const bool = (v) => (typeof v === "boolean" ? v : null);
const lista = (v, max) => (Array.isArray(v) ? v.slice(0, max) : []);

// Tiene solo i campi previsti, con lunghezze e valori limitati
export function pulisciReport(r = {}) {
  const s = r.sistema || {};
  const c = r.computer || {};
  const out = {
    versione: num(r.versione, 0, 1000),
    sistema: { nome: clip(s.nome, 80), versione: clip(s.versione, 40), build: clip(s.build, 40), architettura: clip(s.architettura, 20) },
    computer: { nome: clip(c.nome, 60), produttore: clip(c.produttore, 60), modello: clip(c.modello, 80) },
    avvioGiorni: num(r.avvioGiorni, 0, 10000),
    dischi: lista(r.dischi, 12).map((d) => ({ unita: clip(d?.unita, 40), totaleGB: num(d?.totaleGB), liberoGB: num(d?.liberoGB) }))
      .filter((d) => d.unita && d.totaleGB > 0 && d.liberoGB !== null),
    saluteDischi: lista(r.saluteDischi, 12).map((d) => ({ nome: clip(d?.nome, 80), stato: clip(d?.stato, 30) })).filter((d) => d.stato),
    antivirus: r.antivirus == null ? null : lista(r.antivirus, 8).map((a) => ({ nome: clip(a?.nome, 80), attivo: bool(a?.attivo), aggiornato: bool(a?.aggiornato) })),
    defender: r.defender ? { attivo: bool(r.defender.attivo), tempoReale: bool(r.defender.tempoReale), firmeGiorni: num(r.defender.firmeGiorni, 0, 10000) } : null,
    firewall: r.firewall ? { attivo: bool(r.firewall.attivo) } : null,
    aggiornamenti: r.aggiornamenti ? { ultimoGiorni: num(r.aggiornamenti.ultimoGiorni, 0, 10000), riavvioInSospeso: bool(r.aggiornamenti.riavvioInSospeso) } : null,
    backup: r.backup ? { tipo: clip(r.backup.tipo, 40), percorso: clip(r.backup.percorso, 200), trovato: bool(r.backup.trovato), ultimoGiorni: num(r.backup.ultimoGiorni, 0, 100000) } : null,
    mac: r.mac ? { filevault: bool(r.mac.filevault), gatekeeper: bool(r.mac.gatekeeper), sip: bool(r.mac.sip) } : null
  };
  return out;
}

const gb = (n) => `${Math.round(n)} GB`;
const giorni = (n) => `${Math.round(n)} ${Math.round(n) === 1 ? "giorno" : "giorni"}`;

// Problemi trovati: critico (da sistemare subito), attenzione, info (solo nel pannello)
export function valuta(r) {
  const p = [];
  const add = (livello, codice, testo) => p.push({ livello, codice, testo });
  const mac = /mac/i.test(r.sistema?.nome || "");

  for (const d of r.dischi || []) {
    const perc = (d.liberoGB / d.totaleGB) * 100;
    if (d.liberoGB < 5 || perc < 3) add("critico", `disco:${d.unita}`, `Disco ${d.unita} quasi pieno: ${gb(d.liberoGB)} liberi su ${gb(d.totaleGB)}`);
    else if (d.liberoGB < 15 || (perc < 8 && d.liberoGB < 50)) add("attenzione", `disco:${d.unita}`, `Poco spazio sul disco ${d.unita}: ${gb(d.liberoGB)} liberi su ${gb(d.totaleGB)}`);
  }
  for (const d of r.saluteDischi || []) {
    if (!/^(healthy|ok|verified|sano|integro)$/i.test(d.stato)) add("critico", `salute:${d.nome}`, `Il disco ${d.nome || ""} segnala problemi (${d.stato}): fai subito un backup`);
  }
  if (Array.isArray(r.antivirus) && r.antivirus.length) {
    const attivi = r.antivirus.filter((a) => a.attivo);
    if (!attivi.length) add("critico", "antivirus:spento", "Nessun antivirus attivo");
    else if (attivi.every((a) => a.aggiornato === false)) add("attenzione", "antivirus:vecchio", `Antivirus non aggiornato (${attivi.map((a) => a.nome).join(", ")})`);
  }
  if (r.defender?.attivo) {
    if (r.defender.tempoReale === false) add("critico", "defender:temporeale", "Protezione in tempo reale di Microsoft Defender disattivata");
    if (r.defender.firmeGiorni > 7) add("attenzione", "defender:firme", `Firme di Microsoft Defender vecchie di ${giorni(r.defender.firmeGiorni)}`);
  }
  if (r.firewall?.attivo === false) {
    if (mac) add("info", "firewall", "Firewall del Mac spento (su un Mac di casa è normale)");
    else add("attenzione", "firewall", "Firewall di Windows spento");
  }
  if (r.aggiornamenti?.ultimoGiorni > 45) add("attenzione", "aggiornamenti", `Nessun aggiornamento installato da ${giorni(r.aggiornamenti.ultimoGiorni)}`);
  if (r.aggiornamenti?.riavvioInSospeso) add("info", "riavvio", "Aggiornamenti in attesa di riavvio");
  const b = r.backup;
  if (b && (b.percorso || b.tipo)) {
    // Un disco di backup scollegato va bene, purché l'ultimo backup sia recente
    if (b.ultimoGiorni > 7) add("attenzione", "backup:vecchio", `Ultimo backup ${giorni(b.ultimoGiorni)} fa${b.trovato === false ? " (disco del backup non collegato)" : ""}`);
    else if (b.ultimoGiorni == null && b.trovato === false) add("attenzione", "backup:assente", `Cartella del backup non trovata${b.percorso ? ` (${b.percorso})` : ""}`);
    else if (b.ultimoGiorni == null && b.trovato === true) add("attenzione", "backup:vuoto", "La cartella del backup è vuota");
  }
  if (r.avvioGiorni > 30) add("info", "acceso", `Mai riavviato da ${giorni(r.avvioGiorni)}`);
  if (/windows 10/i.test(r.sistema?.nome || "")) add("info", "windows10", "Windows 10: aggiornamenti di sicurezza finiti, proponi il passaggio a Windows 11");
  if (r.mac) {
    if (r.mac.sip === false) add("attenzione", "mac:sip", "Protezione dell'integrità di sistema (SIP) disattivata");
    if (r.mac.gatekeeper === false) add("attenzione", "mac:gatekeeper", "Gatekeeper disattivato: il Mac apre app da qualsiasi fonte");
    if (r.mac.filevault === false) add("info", "mac:filevault", "FileVault spento: i dati non sono cifrati se il Mac viene rubato");
  }
  return p;
}

// Problemi nuovi (critici o di attenzione) rispetto al controllo precedente
export function nuoviProblemi(prima = [], adesso = []) {
  const vecchi = new Set(prima.map((x) => x.codice));
  return adesso.filter((x) => x.livello !== "info" && !vecchi.has(x.codice));
}
