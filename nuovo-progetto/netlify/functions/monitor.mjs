/* ==========================================================================
   Riceve lo stato dei PC monitorati (una volta al giorno e all'accensione).
   Il programma sul PC si presenta con il suo codice e la sua chiave: senza
   chiave giusta non si scrive nulla. Se il PC è stato rimosso dal pannello,
   risponde 410 e il programma si disinstalla da solo.
   ========================================================================== */
import { dispositivi } from "../lib/archivio.mjs";
import { nuoviProblemi, pulisciReport, valuta } from "../lib/monitor.mjs";
import { telegram } from "../lib/notifiche.mjs";
import { idValido, json, pausa, sha256, uguali } from "../lib/utili.mjs";

const MAX_CORPO = 64 * 1024;
const ICONE = { critico: "🔴", attenzione: "🟠", info: "🔵" };

export default async (req) => {
  if (req.method !== "POST") return json({ errore: "Metodo non consentito" }, 405);
  if (Number(req.headers.get("content-length") || 0) > MAX_CORPO) return json({ errore: "Dati troppo grandi" }, 413);

  let body;
  try {
    const testo = await req.text();
    if (testo.length > MAX_CORPO) return json({ errore: "Dati troppo grandi" }, 413);
    body = JSON.parse(testo);
  } catch {
    return json({ errore: "Dati non validi" }, 400);
  }
  const id = body?.dispositivo;
  const chiave = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!idValido(id) || !chiave) return json({ errore: "Accesso negato" }, 401);

  const d = await dispositivi.get(id);
  if (!d) return json({ errore: "PC sconosciuto" }, 404);
  if (!uguali(sha256(chiave), d.chiave || "")) {
    await pausa(400);
    return json({ errore: "Accesso negato" }, 401);
  }
  if (d.revocato || d.eliminato) return json({ errore: "Monitoraggio rimosso", disinstalla: true }, 410);

  const report = pulisciReport(body);
  const problemi = valuta(report);
  const nuovi = nuoviProblemi(d.problemi, problemi);
  const eraSilenzioso = d.avvisoSilenzio;
  Object.assign(d, { report, problemi, ultimoContatto: new Date().toISOString(), avvisoSilenzio: false });
  await dispositivi.salva(d);

  if (nuovi.length || eraSilenzioso) {
    const righe = [`🖥️ ${d.nome}`];
    if (eraSilenzioso) righe.push("✅ Il PC ha ripreso a inviare i controlli.");
    for (const x of nuovi) righe.push(`${ICONE[x.livello]} ${x.testo}`);
    const esito = await telegram(righe.join("\n"));
    if (!esito.ok && esito.errore !== "Telegram non configurato") console.error(esito.errore);
  }
  return json({ ok: true, problemi: problemi.length });
};
