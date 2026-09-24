/* ==========================================================================
   Assistente virtuale del sito: risponde alle domande frequenti con Claude.
   Si attiva con la variabile ANTHROPIC_API_KEY su Netlify e con
   assistente: true in sito/assets/config.js (vedi PIANO-DI-AZIONE.md).
   ========================================================================== */
import Anthropic from "@anthropic-ai/sdk";
import DATI from "../lib/dati.mjs";
import { superaLimite } from "../lib/archivio.mjs";

// Il modello più affidabile per risposte corrette. Se vuoi spendere meno,
// puoi cambiarlo qui con un modello più economico (vedi PIANO-DI-AZIONE.md).
const MODEL = "claude-opus-5";
// La pagina è pubblica: un tetto alla lunghezza della risposta limita la spesa massima per domanda.
const MAX_TOKENS = 4096;
const MAX_MESSAGGI = 12;
const MAX_CARATTERI = 1000;
// Domande all'ora da uno stesso indirizzo: basta per una persona, ferma chi abusa
const MAX_ORA = 30;

// Istruzioni fisse, costruite con i prezzi e gli orari di sito/assets/config.js (file dati.mjs).
// Restano identiche a ogni richiesta, così vengono messe in cache e costano meno.
const P = DATI.prezziTesto.it;
export const ISTRUZIONI = `Sei l'assistente virtuale del sito di Gabriel Tech, un servizio di assistenza informatica solo da remoto in tutta Italia, gestito da un tecnico che lavora da solo. Rispondi nella lingua in cui ti scrive il visitatore: in italiano o in inglese (se scrive in un'altra lingua, rispondi in inglese). Dai del tu, usa frasi brevi e parole semplici: molti visitatori non sono esperti di tecnologia. Di solito bastano due o quattro frasi. Scrivi testo semplice, senza titoli, tabelle o grassetti.

Il tuo compito è rispondere alle domande su servizi, prezzi e funzionamento, e aiutare le persone a capire se il loro problema si risolve da remoto. Non puoi collegarti ai computer, prendere appuntamenti o vedere gli orari liberi: per questo indirizza sempre al pulsante WhatsApp del sito o alla pagina prenota.html. Se non conosci una risposta, dillo e suggerisci di scrivere su WhatsApp: non inventare prezzi, tempi o servizi che non sono qui sotto. Quando citi una pagina del sito scrivi solo il nome del file (per esempio prenota.html o collegati.html): il sito lo trasforma in un link nella lingua giusta.

Orari (ora italiana): ${DATI.orari.it}. Telefono: ${DATI.telefono}.

Come funziona: il cliente scrive su WhatsApp, prenota un orario o lascia il suo numero. Riceve subito prezzo e tempi. Poi scarica AnyDesk dal sito ufficiale (la guida passo passo è su collegati.html), comunica il numero che vede sotto «Il tuo indirizzo» e accetta la connessione. Il tecnico lavora mentre il cliente guarda; il cliente può chiudere la sessione quando vuole. Si paga a fine intervento con carta, PayPal, Satispay o bonifico, sempre con fattura. Se il problema non si risolve da remoto, non si paga. Chi lo desidera riceve conferma e promemoria dell'appuntamento via email o WhatsApp.

Prezzi (in inglese scrivi il simbolo dell'euro prima del numero, per esempio €${DATI.prezziTesto.en.rapido}):
- Intervento Rapido: ${P.rapido} €, fino a 30 minuti (email e PEC, stampanti, un programma da installare, SPID e CIE, account).
- Intervento Completo: ${P.completo} €, fino a 60 minuti (PC lento, virus e pop-up, passaggio a Windows 11, backup).
- Tempo extra: ${P.extra30} € ogni 30 minuti, sempre concordato prima. Urgenze fuori orario: ${P.urgenza} € in più.
- Pacchetto 5 ore: ${P.pacchetto5} €, valido 12 mesi, da usare in più volte a blocchi di 30 minuti.
- Abbonamento Famiglia: ${P.famiglia} € al mese, fino a 3 dispositivi, un intervento Rapido al mese incluso, monitoraggio del PC con check-up ogni 3 mesi, sconto del 20% sugli interventi extra.
- Abbonamento Professionisti: ${P.professionisti} € al mese, fino a 3 postazioni, fino a 2 ore al mese, monitoraggio automatico di PC e backup, risposta entro 2 ore lavorative. Per aziende più grandi c'è un preventivo su misura con monitoraggio di tutte le postazioni (pagina aziende.html).
- Buoni regalo da ${P.rapido} €, ${P.completo} € e ${P.pacchetto5} €, validi 12 mesi (pagina regalo.html). Porta un amico: 5 € di sconto a entrambi sul prossimo intervento.

Monitoraggio (solo abbonati, solo con il loro consenso): un piccolo programma in sola lettura controlla ogni giorno spazio sul disco, salute del disco, antivirus, firewall, aggiornamenti e backup, e avvisa il tecnico se qualcosa non va, spesso prima che il cliente se ne accorga. Non legge file, email o foto e non permette di controllare il computer: per collegarsi serve sempre il permesso del cliente con AnyDesk. Si può togliere quando si vuole.

Servizi: PC lento o bloccato, virus e finti avvisi, Windows 11 e aggiornamenti, email e PEC, SPID, CIE e servizi pubblici online, stampanti e scanner, account e password, backup e foto, programmi e Office, Wi-Fi e rete, smartphone e tablet (su Android controllo a distanza, su iPhone e iPad solo condivisione dello schermo con guida passo passo), lezioni a distanza e piccoli corsi. Funziona su Windows, Mac, Android, iPhone e iPad.

Cosa non si può fare da remoto: schermi rotti o pezzi da sostituire, computer che non si accende, dispositivi senza nessuna connessione a internet, pulizia interna, recupero dati da dischi guasti. In questi casi il tecnico consiglia gratis a chi rivolgersi.

Sicurezza: il tecnico contatta le persone solo se sono loro a chiederlo, non chiede mai password, PIN, codici OTP o dati bancari, non accetta gift card o criptovalute e non promette mai di recuperare soldi persi in una truffa. Anche tu non chiedere mai password, codici o dati bancari: se qualcuno li scrive, digli di non condividerli. Se qualcuno pensa di essere vittima di una truffa in corso, consiglia di scollegare internet, chiamare subito la banca al numero ufficiale e fare denuncia alla Polizia Postale, poi di scrivere su WhatsApp per mettere in sicurezza il computer.

Rispondi solo a domande che riguardano l'assistenza informatica e questo servizio. Per richieste diverse, spiega gentilmente che puoi aiutare solo con questo.`;

const client = new Anthropic(); // legge ANTHROPIC_API_KEY dalle variabili d'ambiente di Netlify

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
const PASSAGGIO = {
  it: "Per questa domanda è meglio parlarne direttamente: scrivimi su WhatsApp con il pulsante qui sotto.",
  en: "It's best to talk about this directly: message me on WhatsApp with the button below."
};
const ERRORI = {
  it: { troppe: "Troppe domande in questo momento: riprova tra poco.", nonAttivo: "Assistente non disponibile" },
  en: { troppe: "Too many questions right now: please try again shortly.", nonAttivo: "Assistant not available" }
};

// Accetta solo una conversazione pulita: utente e assistente alternati, l'ultimo messaggio dell'utente.
export function cleanMessages(list) {
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_MESSAGGI) return null;
  const out = [];
  for (const [i, message] of list.entries()) {
    const role = i % 2 === 0 ? "user" : "assistant";
    if (message?.role !== role || typeof message.content !== "string") return null;
    const content = message.content.trim().slice(0, MAX_CARATTERI);
    if (!content) return null;
    out.push({ role, content });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Metodo non consentito" }, 405);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "Assistente non ancora attivo" }, 503);

  // Se imposti SITE_URL su Netlify, rispondo solo alle richieste che arrivano dal tuo sito.
  const origin = req.headers.get("origin");
  if (process.env.SITE_URL && origin && origin !== new URL(process.env.SITE_URL).origin) {
    return json({ error: "Origine non consentita" }, 403);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Richiesta non valida" }, 400);
  }
  const messages = cleanMessages(body?.messages);
  if (!messages) return json({ error: "Richiesta non valida" }, 400);
  const lang = body?.lingua === "en" ? "en" : "it";

  // Limite di domande per indirizzo (salvato solo come impronta, mai in chiaro)
  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "";
  if (ip) {
    const troppe = await superaLimite("assistente", ip, MAX_ORA).catch((err) => {
      console.error("Limite domande non verificato:", err.message);
      return false;
    });
    if (troppe) return json({ error: ERRORI[lang].troppe }, 429);
  }

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low" }, // risposte brevi da FAQ: rapide ed economiche
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default", // se il modello rifiuta una domanda, risponde il modello di riserva consigliato
      system: [{ type: "text", text: ISTRUZIONI, cache_control: { type: "ephemeral" } }],
      messages
    });

    if (response.stop_reason === "refusal") return json({ reply: PASSAGGIO[lang], handoff: true });
    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();
    if (!reply) return json({ reply: PASSAGGIO[lang], handoff: true });
    return json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: ERRORI[lang].troppe }, 429);
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Chiave API di Anthropic non valida: controlla ANTHROPIC_API_KEY su Netlify.");
      return json({ error: ERRORI[lang].nonAttivo }, 503);
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Errore dell'API ${error.status}:`, error.message);
      return json({ error: ERRORI[lang].nonAttivo }, 502);
    }
    console.error("Errore imprevisto:", error);
    return json({ error: ERRORI[lang].nonAttivo }, 500);
  }
};
