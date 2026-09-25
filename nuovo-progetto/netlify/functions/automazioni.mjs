/* ==========================================================================
   Lavori automatici, una volta all'ora:
   - promemoria degli appuntamenti e richieste di recensione programmate;
   - avviso su Telegram se un PC monitorato non si fa sentire da 3 giorni;
   - pulizia: richieste più vecchie di un anno e contatori anti-abuso scaduti.
   ========================================================================== */
import { agenda, dispositivi, pulisciLimiti, richieste } from "../lib/archivio.mjs";
import { inviaAlCliente, registra, telegram } from "../lib/notifiche.mjs";
import { romeParts } from "../lib/utili.mjs";

const TROPPO_TARDI = 12 * 3600e3; // un messaggio rimasto indietro di 12 ore non parte più
const SILENZIO = 72 * 3600e3;

export async function messaggiProgrammati(adesso = new Date()) {
  const fatti = [];
  for (const lavoro of await agenda.scaduti(adesso)) {
    const r = await richieste.get(lavoro.id);
    await agenda.togli([lavoro.chiave]);
    if (!r) continue;
    r.lavori = (r.lavori || []).filter((k) => k !== lavoro.chiave);
    let esiti = [];
    const inRitardo = adesso - lavoro.quando > TROPPO_TARDI;
    if (lavoro.tipo === "promemoria") {
      const giaInviato = (r.messaggi || []).some((m) => m.tipo === "promemoria" && m.ok && m.rif === r.appuntamento);
      if (!inRitardo && !giaInviato && r.stato === "confermata" && r.appuntamento && new Date(r.appuntamento) > adesso) {
        esiti = await inviaAlCliente(r, "promemoria");
        registra(r, "promemoria", esiti, { rif: r.appuntamento });
      }
    } else if (lavoro.tipo === "recensione") {
      const giaInviata = (r.messaggi || []).some((m) => m.tipo === "recensione" && m.ok);
      if (!inRitardo && !giaInviata && r.stato === "completata") {
        esiti = await inviaAlCliente(r, "recensione");
        registra(r, "recensione", esiti);
      }
    }
    await richieste.salva(r);
    for (const e of esiti) if (!e.ok) console.error(`${lavoro.tipo} per ${r.id}: ${e.errore}`);
    fatti.push({ tipo: lavoro.tipo, id: r.id, inviati: esiti.filter((e) => e.ok).length });
  }
  return fatti;
}

export async function pcSilenziosi(adesso = new Date()) {
  const avvisati = [];
  for (const d of await dispositivi.tutti()) {
    if (d.eliminato || d.revocato || d.avvisoSilenzio || !d.ultimoContatto) continue;
    if (adesso - new Date(d.ultimoContatto) < SILENZIO) continue;
    const esito = await telegram(`🖥️ ${d.nome}\n⚪ Nessun controllo da più di 3 giorni: il PC è spento da tempo, senza internet, oppure il programma di monitoraggio è stato tolto.`);
    if (esito.ok || esito.errore === "Telegram non configurato") {
      d.avvisoSilenzio = true;
      await dispositivi.salva(d);
      avvisati.push(d.id);
    }
  }
  return avvisati;
}

export default async () => {
  const adesso = new Date();
  const esito = {};
  for (const [nome, lavoro] of [
    ["messaggi", () => messaggiProgrammati(adesso)],
    ["silenziosi", () => pcSilenziosi(adesso)],
    ["limiti", () => pulisciLimiti()],
    // la pulizia dell'archivio basta una volta al giorno, di notte
    ["archivio", () => (romeParts(adesso).ora === 3 ? richieste.pulisci(365) : 0)]
  ]) {
    try {
      esito[nome] = await lavoro();
    } catch (err) {
      console.error(`Automazioni, ${nome}:`, err);
      esito[nome] = "errore";
    }
  }
  console.log("Automazioni:", JSON.stringify(esito));
};

export const config = { schedule: "@hourly" };
