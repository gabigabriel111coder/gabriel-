/* ==========================================================================
   Nuova richiesta da un modulo del sito. Netlify esegue questa funzione da sola
   a ogni invio valido (evento "submission-created"):
   1. salva la richiesta nel gestionale (pannello → Richieste);
   2. avvisa il tecnico su Telegram (TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID);
   3. manda al cliente l'email di ricevuta, se l'ha lasciata e l'email è attiva.
   Ogni passo che non è configurato viene saltato: il modulo arriva comunque
   anche nella sezione Forms di Netlify.
   ========================================================================== */
import { connectLambda } from "@netlify/blobs";
import DATI from "../lib/dati.mjs";
import { richieste, superaLimite } from "../lib/archivio.mjs";
import { avvisoNuova, daModulo } from "../lib/gestione.mjs";
import { inviaAlCliente, registra, telegram } from "../lib/notifiche.mjs";

const SITO = (process.env.SITE_URL || process.env.URL || DATI.sito).replace(/\/$/, "");

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body || "{}").payload;
  } catch {
    return { statusCode: 400, body: "Richiesta non valida" };
  }
  const richiesta = daModulo(payload);

  // 1. Gestionale
  let salvata = false;
  try {
    connectLambda(event);
    await richieste.salva(richiesta);
    salvata = true;
  } catch (err) {
    console.error("Salvataggio nel gestionale non riuscito:", err.message);
  }

  // 2. Avviso al tecnico
  const avviso = await telegram(avvisoNuova(richiesta, salvata ? SITO : ""));
  if (!avviso.ok && avviso.errore !== "Telegram non configurato") console.error(avviso.errore);

  // 3. Ricevuta al cliente (al massimo 3 all'ora per indirizzo, contro gli abusi)
  if (richiesta.email) {
    const troppe = salvata ? await superaLimite("ricevuta", richiesta.email, 3).catch(() => false) : false;
    if (!troppe) {
      const esiti = await inviaAlCliente(richiesta, "ricevuta");
      for (const e of esiti) if (!e.ok) console.error(e.errore);
      if (salvata && esiti.length) {
        registra(richiesta, "ricevuta", esiti);
        await richieste.salva(richiesta).catch((err) => console.error("Aggiornamento non riuscito:", err.message));
      }
    }
  }
  // La richiesta resta comunque salvata su Netlify: non blocchiamo mai l'invio del modulo.
  return { statusCode: 200, body: "ok" };
};
