/* ==========================================================================
   Messaggi automatici: Telegram al tecnico, email e WhatsApp ai clienti.
   Ogni canale si attiva da solo quando su Netlify ci sono le sue variabili
   (vedi PIANO-DI-AZIONE.md); senza variabili il canale viene saltato.
   ========================================================================== */
import DATI from "./dati.mjs";
import { escHtml, formatRome, lingua, waNumber } from "./utili.mjs";

const SITO = (process.env.SITE_URL || DATI.sito).replace(/\/$/, "");
const pagina = (lang, nome) => `${SITO}${lang === "en" ? "/en" : ""}/${nome}`;

export const canali = () => ({
  telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  email: Boolean((process.env.BREVO_API_KEY || process.env.RESEND_API_KEY) && process.env.EMAIL_MITTENTE),
  emailServizio: process.env.BREVO_API_KEY ? "Brevo" : process.env.RESEND_API_KEY ? "Resend" : "",
  whatsapp: Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID)
});

/* ---------- Telegram (avvisi per il tecnico) ---------- */
export async function telegram(testo) {
  if (!canali().telegram) return { ok: false, errore: "Telegram non configurato" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: String(testo).slice(0, 4000), disable_web_page_preview: true })
    });
    if (!res.ok) return { ok: false, errore: `Telegram ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, errore: `Telegram: ${err.message}` };
  }
}

/* ---------- Email (Brevo oppure Resend) ---------- */
// "Gabriel Tech <assistenza@tuodominio.it>" → { nome, email }
export function mittente(testo = process.env.EMAIL_MITTENTE || "") {
  const m = /^\s*(.*?)\s*<([^<>\s]+@[^<>\s]+)>\s*$/.exec(testo);
  if (m) return { nome: m[1].replace(/^"|"$/g, "") || "Gabriel Tech", email: m[2] };
  return { nome: "Gabriel Tech", email: testo.trim() };
}

const collega = (testo) => escHtml(testo).replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}" style="color:#0071e3">${url}</a>`);
export function emailHtml(testo, piede) {
  const paragrafi = testo.split(/\n{2,}/).map((p) => `<p style="margin:0 0 16px">${collega(p).replace(/\n/g, "<br>")}</p>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#f5f5f7"><div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#1d1d1f;max-width:560px;margin:0 auto;padding:32px 24px"><p style="margin:0 0 24px;font-size:19px;font-weight:700;letter-spacing:-.01em">Gabriel Tech</p>${paragrafi}<p style="margin:32px 0 0;font-size:13px;color:#6e6e73">${collega(piede)}</p></div></body></html>`;
}

export async function email({ a, nome, oggetto, testo, piede = "" }) {
  const c = canali();
  if (!c.email) return { ok: false, errore: "Email non configurata" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a || "")) return { ok: false, errore: "Indirizzo email non valido" };
  const da = mittente();
  const risposta = DATI.email && DATI.email.includes("@") && !DATI.email.endsWith("example.com") ? DATI.email : da.email;
  const html = emailHtml(testo, piede);
  const text = piede ? `${testo}\n\n--\n${piede}` : testo;
  try {
    const res = process.env.BREVO_API_KEY
      ? await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          sender: { name: da.nome, email: da.email },
          to: [{ email: a, ...(nome ? { name: nome } : {}) }],
          replyTo: { email: risposta },
          subject: oggetto,
          htmlContent: html,
          textContent: text
        })
      })
      : await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: `${da.nome} <${da.email}>`, to: [a], reply_to: risposta, subject: oggetto, html, text })
      });
    if (!res.ok) return { ok: false, errore: `${c.emailServizio} ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, errore: `${c.emailServizio}: ${err.message}` };
  }
}

/* ---------- WhatsApp (Cloud API di Meta, con modelli approvati) ---------- */
// Nei modelli di WhatsApp i valori non possono contenere a capo o tanti spazi di fila
const valore = (testo) => String(testo ?? "").replace(/\s+/g, " ").trim().slice(0, 200) || "-";
export async function whatsapp({ a, modello, lingua: lang = "it", valori = [] }) {
  if (!canali().whatsapp) return { ok: false, errore: "WhatsApp non configurato" };
  const numero = waNumber(a);
  if (numero.length < 10 || numero.length > 15) return { ok: false, errore: "Numero di telefono non valido" };
  const versione = process.env.WHATSAPP_API_VERSION || "v23.0";
  const template = { name: modello, language: { code: lang } };
  if (valori.length) template.components = [{ type: "body", parameters: valori.map((v) => ({ type: "text", text: valore(v) })) }];
  try {
    const res = await fetch(`https://graph.facebook.com/${versione}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: numero, type: "template", template })
    });
    if (!res.ok) return { ok: false, errore: `WhatsApp ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, errore: `WhatsApp: ${err.message}` };
  }
}

/* ---------- Testi per i clienti ---------- */
const TESTI = {
  it: {
    saluto: (n) => (n ? `Ciao ${n},` : "Ciao,"),
    firma: "A presto!\nGabriel Tech · assistenza informatica da remoto",
    piede: (sito) => `Ricevi questa email perché hai fatto una richiesta sul sito ${sito}. Per qualsiasi cosa rispondi pure a questo messaggio.`,
    piedeRecensione: (sito) => `Ricevi questa email perché hai accettato di ricevere la richiesta di recensione sul sito ${sito}. Non la riceverai più: è l'ultimo messaggio automatico.`,
    ricevuta: {
      oggetto: "Ho ricevuto la tua richiesta",
      richiamata: (r) => `grazie per avermi scritto. Ho ricevuto la tua richiesta e ti richiamo appena possibile, negli orari di disponibilità: ${DATI.orari.it}.`,
      prenotazione: (r) => `grazie per aver prenotato. Ho ricevuto la tua richiesta${r.dettagli?.Giorno ? ` per ${r.dettagli.Giorno}${r.dettagli?.Orario ? ` alle ${r.dettagli.Orario}` : ""}` : ""}: ti scrivo a breve per confermare l'appuntamento.`,
      "preventivo-aziende": (r) => `grazie per l'interesse${r.dettagli?.Azienda ? ` di ${r.dettagli.Azienda}` : ""}. Ti contatto entro un giorno lavorativo per fissare la chiamata conoscitiva gratuita.`,
      manuale: () => "ho registrato la tua richiesta: ti ricontatto appena possibile.",
      dopo: (r) => `Intanto puoi preparare AnyDesk in 2 minuti con questa guida: ${pagina("it", "collegati.html")}\n\nSe preferisci, scrivimi su WhatsApp: https://wa.me/${DATI.whatsapp}`
    },
    conferma: {
      oggetto: "Appuntamento confermato",
      testo: (q) => `confermo il nostro appuntamento di ${q} (ora italiana).\n\nQualche minuto prima tieni pronto AnyDesk: ${pagina("it", "collegati.html")}\n\nSe hai un imprevisto, rispondi a questa email o scrivimi su WhatsApp: https://wa.me/${DATI.whatsapp}`
    },
    promemoria: {
      oggetto: "Promemoria del tuo appuntamento",
      testo: (q) => `ti ricordo il nostro appuntamento di ${q} (ora italiana). Tieni il computer acceso e AnyDesk aperto: ${pagina("it", "collegati.html")}\n\nSe hai un imprevisto, scrivimi su WhatsApp: https://wa.me/${DATI.whatsapp}`
    },
    recensione: {
      oggetto: "Com'è andata?",
      testo: (link) => `com'è andata con il tuo dispositivo dopo l'intervento? Se sei soddisfatto, una recensione mi aiuta tantissimo, ci vuole un minuto: ${link}\n\nSe invece qualcosa non va, rispondi a questa email: lo sistemiamo.`
    }
  },
  en: {
    saluto: (n) => (n ? `Hi ${n},` : "Hi there,"),
    firma: "Speak soon!\nGabriel Tech · remote IT support",
    piede: (sito) => `You are receiving this email because you made a request on ${sito}. If you need anything, just reply to this message.`,
    piedeRecensione: (sito) => `You are receiving this email because you agreed to receive a review request on ${sito}. This is the last automatic message.`,
    ricevuta: {
      oggetto: "I've received your request",
      richiamata: () => `thanks for getting in touch. I've received your request and I'll call you back as soon as possible, during opening hours: ${DATI.orari.en} (Italian time).`,
      prenotazione: (r) => `thanks for booking. I've received your request${r.dettagli?.Giorno ? ` for ${r.dettagli.Giorno}${r.dettagli?.Orario ? ` at ${r.dettagli.Orario}` : ""}` : ""}: I'll write to you shortly to confirm the appointment.`,
      "preventivo-aziende": (r) => `thanks for your interest${r.dettagli?.Azienda ? ` on behalf of ${r.dettagli.Azienda}` : ""}. I'll contact you within one working day to arrange the free introductory call.`,
      manuale: () => "I've logged your request: I'll get back to you as soon as possible.",
      dopo: () => `In the meantime you can set up AnyDesk in 2 minutes with this guide: ${pagina("en", "collegati.html")}\n\nIf you prefer, message me on WhatsApp: https://wa.me/${DATI.whatsapp}`
    },
    conferma: {
      oggetto: "Appointment confirmed",
      testo: (q) => `your remote support appointment is confirmed for ${q} (Italian time).\n\nA few minutes before, please have AnyDesk ready: ${pagina("en", "collegati.html")}\n\nIf something comes up, reply to this email or message me on WhatsApp: https://wa.me/${DATI.whatsapp}`
    },
    promemoria: {
      oggetto: "Reminder of your appointment",
      testo: (q) => `a quick reminder of our appointment on ${q} (Italian time). Please keep your computer on and AnyDesk open: ${pagina("en", "collegati.html")}\n\nIf something comes up, message me on WhatsApp: https://wa.me/${DATI.whatsapp}`
    },
    recensione: {
      oggetto: "How did it go?",
      testo: (link) => `how is your device doing after our session? If you're happy, a review helps me a lot and takes a minute: ${link}\n\nIf something isn't right, just reply to this email and we'll sort it out.`
    }
  }
};

export const linkRecensione = (lang) => DATI.linkRecensioneGoogle || pagina(lang, "recensione.html");
const MODELLI = { conferma: "gt_conferma", promemoria: "gt_promemoria", recensione: "gt_recensione" };
export const TIPI = ["ricevuta", "conferma", "promemoria", "recensione"];

// Chi riceve cosa:
// - email: ricevuta, conferma e promemoria sempre (sono messaggi di servizio); la recensione solo con il consenso;
// - WhatsApp: solo con il consenso e al massimo 3 messaggi (conferma, promemoria, recensione).
export function canaliPer(richiesta, tipo) {
  const c = canali();
  const out = [];
  if (c.email && richiesta.email && (tipo !== "recensione" || richiesta.consenso)) out.push("email");
  if (c.whatsapp && richiesta.consenso && tipo !== "ricevuta" && waNumber(richiesta.telefono).length >= 10) out.push("whatsapp");
  return out;
}

export async function inviaAlCliente(richiesta, tipo) {
  const lang = lingua(richiesta.lingua);
  const T = TESTI[lang];
  const nome = (richiesta.nome || "").trim().split(/\s+/)[0] || "";
  const quando = richiesta.appuntamento ? formatRome(new Date(richiesta.appuntamento), lang) : "";
  if ((tipo === "conferma" || tipo === "promemoria") && !quando) return [{ canale: "-", ok: false, errore: "Manca l'appuntamento" }];
  const esiti = [];
  for (const canale of canaliPer(richiesta, tipo)) {
    let esito;
    if (canale === "email") {
      let corpo;
      if (tipo === "ricevuta") {
        const testo = T.ricevuta[richiesta.modulo] || T.ricevuta.manuale;
        corpo = `${testo(richiesta)}\n\n${T.ricevuta.dopo(richiesta)}`;
      } else if (tipo === "recensione") {
        corpo = T.recensione.testo(linkRecensione(lang));
      } else {
        corpo = T[tipo].testo(quando);
      }
      esito = await email({
        a: richiesta.email,
        nome: richiesta.nome,
        oggetto: `${T[tipo].oggetto} · Gabriel Tech`,
        testo: `${T.saluto(nome)}\n\n${corpo}\n\n${T.firma}`,
        piede: tipo === "recensione" ? T.piedeRecensione(SITO.replace(/^https?:\/\//, "")) : T.piede(SITO.replace(/^https?:\/\//, ""))
      });
    } else {
      esito = await whatsapp({
        a: richiesta.telefono,
        modello: MODELLI[tipo],
        lingua: lang,
        valori: [nome, tipo === "recensione" ? linkRecensione(lang) : quando]
      });
    }
    esiti.push({ canale, ...esito });
  }
  return esiti;
}

// Aggiunge gli esiti allo storico della richiesta (il pannello li mostra)
export function registra(richiesta, tipo, esiti, extra = {}) {
  richiesta.messaggi = [...(richiesta.messaggi || []), ...esiti.map((e) => ({
    tipo,
    canale: e.canale,
    ok: e.ok,
    ...(e.errore ? { errore: String(e.errore).slice(0, 200) } : {}),
    quando: new Date().toISOString(),
    ...extra
  }))].slice(-40);
  return richiesta;
}
