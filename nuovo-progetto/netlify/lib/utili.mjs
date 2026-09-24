/* ==========================================================================
   Funzioni di servizio condivise dalle funzioni di Netlify.
   ========================================================================== */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

// Testo su una riga, senza spazi doppi e con una lunghezza massima
export const clip = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
// Testo su più righe (messaggi e note)
export const clipTesto = (value, max) => String(value ?? "").replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);

export const lingua = (value) => (value === "en" ? "en" : "it");
export const sha256 = (text) => createHash("sha256").update(String(text)).digest("hex");
export const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Confronto a tempo costante: non rivela quanti caratteri sono giusti
export function uguali(a, b) {
  const x = createHash("sha256").update(String(a)).digest();
  const y = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(x, y);
}

// Chiave del pannello del tecnico: variabile ADMIN_TOKEN su Netlify, almeno 24 caratteri
export const adminAttivo = () => (process.env.ADMIN_TOKEN || "").length >= 24;
export async function adminOk(req) {
  const data = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (adminAttivo() && data && uguali(data, process.env.ADMIN_TOKEN)) return true;
  await pausa(300 + Math.floor(Math.random() * 300)); // rallenta chi prova a indovinare
  return false;
}

// Codici in ordine di tempo: i primi 9 caratteri sono il momento della creazione
export const newId = () => Date.now().toString(36).padStart(9, "0") + randomBytes(4).toString("hex");
export const dataDaId = (id) => new Date(parseInt(String(id).slice(0, 9), 36));
export const idValido = (id) => typeof id === "string" && /^[0-9a-z]{9}[0-9a-f]{8}$/.test(id);
export const nuovaChiave = () => randomBytes(24).toString("base64url");

// "333 123 4567" o "+39 333…" → "39333…", il formato di WhatsApp
export function waNumber(phone = "") {
  let digits = String(phone).replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (/^3\d{8,9}$/.test(digits)) digits = `39${digits}`;
  return digits.replace(/\D/g, "");
}

export const escHtml = (text) => String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------- Ora italiana ---------- */
const PARTI = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
});
export function romeParts(date = new Date()) {
  const p = Object.fromEntries(PARTI.formatToParts(date).map((x) => [x.type, x.value]));
  return { anno: +p.year, mese: +p.month, giorno: +p.day, ora: +p.hour, minuto: +p.minute };
}
const due = (n) => String(n).padStart(2, "0");
// Il giorno in Italia, come "2026-10-07"
export function giornoRoma(date) {
  const p = romeParts(date);
  return `${p.anno}-${due(p.mese)}-${due(p.giorno)}`;
}
export const spostaGiorno = (giorno, n) => new Date(Date.parse(`${giorno}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
// "2026-10-07T15:30" letto come ora italiana → data vera
export function romeToUtc(testo) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/.exec(String(testo ?? "").trim());
  if (!m) return null;
  const voluto = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  if (Number.isNaN(voluto)) return null;
  let t = voluto;
  for (let i = 0; i < 3; i++) {
    const p = romeParts(new Date(t));
    const scarto = Date.UTC(p.anno, p.mese - 1, p.giorno, p.ora, p.minuto) - voluto;
    if (!scarto) break;
    t -= scarto;
  }
  return new Date(t);
}
// "martedì 7 ottobre alle 15:30" / "Tuesday 7 October at 15:30"
export function formatRome(date, lang = "it") {
  const locale = lang === "en" ? "en-GB" : "it-IT";
  const giorno = new Intl.DateTimeFormat(locale, { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long" }).format(date);
  const ora = new Intl.DateTimeFormat(locale, { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date);
  return lang === "en" ? `${giorno} at ${ora}` : `${giorno} alle ${ora}`;
}
