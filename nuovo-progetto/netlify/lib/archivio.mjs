/* ==========================================================================
   Archivio su Netlify Blobs: richieste dei clienti, messaggi programmati,
   PC monitorati e limiti anti-abuso. Nessun database da configurare.
   ========================================================================== */
import { getStore } from "@netlify/blobs";
import { dataDaId, sha256 } from "./utili.mjs";

// Lettura sempre aggiornata quando Netlify la permette (funzioni moderne), altrimenti quella normale
function contesto() {
  const raw = globalThis.netlifyBlobsContext || process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) return {};
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return {};
  }
}
export function apri(nome) {
  return contesto().uncachedEdgeURL ? getStore({ name: nome, consistency: "strong" }) : getStore(nome);
}

// Legge molti elementi a gruppi, per non aprire troppe connessioni insieme
export async function leggiTutti(store, chiavi, gruppo = 20) {
  const risultati = [];
  for (let i = 0; i < chiavi.length; i += gruppo) {
    const parte = await Promise.all(chiavi.slice(i, i + gruppo).map((k) => store.get(k, { type: "json" }).catch(() => null)));
    risultati.push(...parte.filter(Boolean));
  }
  return risultati;
}
export async function chiavi(store, prefix) {
  const { blobs } = await store.list(prefix ? { prefix } : {});
  return blobs.map((b) => b.key);
}

/* ---------- Richieste dei clienti ---------- */
export const richieste = {
  store: () => apri("richieste"),
  get: (id) => apri("richieste").get(id, { type: "json" }),
  salva: (r) => apri("richieste").setJSON(r.id, r),
  elimina: (id) => apri("richieste").delete(id),
  async tutte(max = 500) {
    const store = apri("richieste");
    const elenco = (await chiavi(store)).sort().reverse().slice(0, max);
    return leggiTutti(store, elenco);
  },
  // Cancella le richieste più vecchie di un anno (lo dice l'informativa privacy)
  async pulisci(giorni = 365) {
    const store = apri("richieste");
    const limite = Date.now() - giorni * 864e5;
    const vecchie = (await chiavi(store)).filter((k) => dataDaId(k).getTime() < limite);
    await Promise.all(vecchie.map((k) => store.delete(k)));
    return vecchie.length;
  }
};

/* ---------- Messaggi programmati (promemoria e recensioni) ----------
   La chiave contiene già momento, tipo e richiesta: ogni ora basta un elenco
   per sapere cosa inviare, senza leggere tutto l'archivio. */
const chiaveLavoro = (quando, tipo, id) => `${String(quando.getTime()).padStart(14, "0")}_${tipo}_${id}`;
export const agenda = {
  async programma(tipo, id, quando) {
    const chiave = chiaveLavoro(quando, tipo, id);
    await apri("agenda").setJSON(chiave, { tipo, id });
    return chiave;
  },
  togli: (elenco = []) => Promise.all(elenco.map((k) => apri("agenda").delete(k))),
  async scaduti(adesso = new Date()) {
    return (await chiavi(apri("agenda")))
      .map((chiave) => {
        const [ms, tipo, id] = chiave.split("_");
        return { chiave, quando: new Date(Number(ms)), tipo, id };
      })
      .filter((l) => l.id && l.quando <= adesso);
  }
};

/* ---------- PC monitorati ---------- */
export const dispositivi = {
  get: (id) => apri("dispositivi").get(id, { type: "json" }),
  salva: (d) => apri("dispositivi").setJSON(d.id, d),
  elimina: (id) => apri("dispositivi").delete(id),
  async tutti() {
    const store = apri("dispositivi");
    return leggiTutti(store, await chiavi(store));
  }
};

/* ---------- Limiti anti-abuso ----------
   Conta le richieste per ora di un certo tipo (per esempio domande all'assistente
   da uno stesso indirizzo). L'indirizzo non viene salvato in chiaro. */
const oraCorrente = () => Math.floor(Date.now() / 3600e3);
export async function superaLimite(tipo, chi, massimo) {
  const store = apri("limiti");
  const chiave = `${oraCorrente()}/${tipo}/${sha256(`gt:${chi}`).slice(0, 32)}`;
  const conteggio = ((await store.get(chiave, { type: "json" }).catch(() => null))?.n || 0) + 1;
  if (conteggio > massimo) return true;
  await store.setJSON(chiave, { n: conteggio });
  return false;
}
// Toglie i conteggi delle ore precedenti
export async function pulisciLimiti() {
  const store = apri("limiti");
  const adesso = oraCorrente();
  const vecchie = (await chiavi(store)).filter((k) => Number(k.split("/")[0]) < adesso);
  await Promise.all(vecchie.map((k) => store.delete(k)));
  return vecchie.length;
}
