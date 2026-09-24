/* ==========================================================================
   Notifica su Telegram per ogni richiesta arrivata dai moduli del sito.
   Netlify la esegue da sola a ogni invio valido (evento "submission-created").
   Si attiva impostando su Netlify le variabili TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID
   (vedi PIANO-DI-AZIONE.md). Senza variabili non fa nulla.
   ========================================================================== */
const TITOLI = {
  richiamata: "📞 Nuova richiesta di richiamata",
  prenotazione: "📅 Nuova prenotazione",
  "preventivo-aziende": "🏢 Nuova richiesta da un'azienda"
};
const NASCOSTI = new Set(["form-name", "bot-field", "privacy", "condizioni", "ip", "user_agent", "referrer"]);

// "333 123 4567" o "+39 333…" → "39333…" per aprire la chat WhatsApp con un tocco
export function waNumber(phone = "") {
  let digits = String(phone).replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (/^3\d{8,9}$/.test(digits)) digits = `39${digits}`;
  return digits.replace(/\D/g, "");
}

export function formatMessage(payload) {
  const data = payload?.data || {};
  const lines = [TITOLI[payload?.form_name] || `Nuovo modulo: ${payload?.form_name}`, ""];
  for (const [key, value] of Object.entries(data)) {
    if (!value || NASCOSTI.has(key)) continue;
    lines.push(`${key}: ${String(value).slice(0, 600)}`);
  }
  const wa = waNumber(data.telefono);
  if (wa.length >= 10) lines.push("", `Scrivi su WhatsApp: https://wa.me/${wa}`);
  return lines.join("\n");
}

export const handler = async (event) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { statusCode: 200, body: "Notifica Telegram non configurata" };

  let payload;
  try {
    payload = JSON.parse(event.body || "{}").payload;
  } catch {
    return { statusCode: 400, body: "Richiesta non valida" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: formatMessage(payload), disable_web_page_preview: true })
    });
    if (!res.ok) console.error("Telegram ha risposto", res.status, await res.text());
  } catch (err) {
    console.error("Invio a Telegram non riuscito:", err);
  }
  // La richiesta resta comunque salvata su Netlify: non blocchiamo mai l'invio del modulo.
  return { statusCode: 200, body: "ok" };
};
