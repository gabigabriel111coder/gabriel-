#!/usr/bin/env node
/* ==========================================================================
   Gabriel Tech · generatore del sito
   Uso (dalla cartella nuovo-progetto):  npm run genera
   Netlify lo lancia da solo a ogni pubblicazione.

   - legge dati, prezzi e lingue da sito/assets/config.js
   - crea tutte le pagine, home compresa (modello: strumenti/modelli/home.html)
   - crea la versione inglese in sito/en/ con il dizionario strumenti/traduzioni/en.mjs
   - scrive sitemap.xml, robots.txt e i dati per le funzioni di Netlify
   I testi di servizi e guide sono in strumenti/contenuti.mjs.
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SERVIZI, GUIDE } from "./contenuti.mjs";
import { paginePannello } from "./pannello.mjs";
import { caricaConfig } from "./lib/config.mjs";
import { creaTraduttore } from "./lib/traduci.mjs";
import EN from "./traduzioni/en.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..");
const SITO = join(RADICE, "sito");
const CONFIG = caricaConfig(join(SITO, "assets", "config.js"));
// Finché in config.js c'è il dominio d'esempio, su Netlify si usa l'indirizzo vero del sito (variabile URL)
const DOMINIO = String((CONFIG.sito && !/example\.com/.test(CONFIG.sito) ? CONFIG.sito : process.env.URL) || CONFIG.sito || "https://www.example.com").replace(/\/+$/, "");
const INGLESE = (CONFIG.lingue || ["it"]).includes("en");
const OGGI = new Date().toISOString().slice(0, 10);

/* ---------- La foto del tecnico ----------
   Basta caricare nella cartella sito/assets un file chiamato foto.jpg (oppure .png o .webp):
   il generatore lo trova da solo e ne prepara due versioni leggere, quadrate e centrate sul volto.
   In alternativa si può indicare un altro file in config.js (foto: "assets/nome-file.jpg"). */
const FOTO = await preparaFoto();
async function preparaFoto() {
  const cartella = join(SITO, "assets");
  const nome = CONFIG.foto
    ? String(CONFIG.foto).replace(/^\/+|^assets\//g, "")
    : readdirSync(cartella).find((f) => /^foto\.(jpe?g|png|webp)$/i.test(f));
  if (!nome || !existsSync(join(cartella, nome))) return null;
  try {
    const { default: sharp } = await import("sharp");
    for (const lato of [160, 480]) {
      await sharp(join(cartella, nome)).rotate().resize(lato, lato, { fit: "cover", position: "attention" })
        .webp({ quality: 82 }).toFile(join(cartella, `foto-${lato}.webp`));
    }
    return { piccola: "/assets/foto-160.webp", grande: "/assets/foto-480.webp" };
  } catch (err) {
    console.warn(`Attenzione: non riesco a preparare la foto (${err.message}): uso il file così com'è.`);
    return { piccola: `/assets/${nome}`, grande: `/assets/${nome}` };
  }
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const icon = (name) => `<svg class="i"><use href="#i-${name}"/></svg>`;
const HOME = readFileSync(join(QUI, "modelli", "home.html"), "utf8");
const SPRITE = HOME.match(/<svg width="0" height="0"[\s\S]*?\n<\/svg>/)[0];
const EARLY = 'document.documentElement.classList.add("js");try{var t=localStorage.getItem("gt-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}';
const BREVI = { "pc-lento": "PC lento", virus: "Virus e pop-up", "windows-11": "Windows 11", "spid-cie": "SPID e CIE", "email-pec": "Email e PEC", "backup-foto": "Backup e foto" };
// Prezzo mostrato nelle pagine dei servizi, in base al tipo di intervento
const PREZZO_DI = { Rapido: "rapido", Completo: "completo", Lezione: "rapido" };
// Testi uguali in italiano e in inglese: il controllo delle traduzioni non li segnala
const INVARIATI = ["Gabriel", "Tech", "Gabriel Tech", "WhatsApp", "AnyDesk", "Windows", "Windows 11", "Mac", "macOS", "Android", "iPhone", "Microsoft 365", "Home", "Email", "EN", "Wi-Fi", "PayPal", "Satispay", "SPID", "PEC", "OneDrive", "iCloud", "Outlook", "Office", "123 456 789", "PDF", "SVG", "PNG", "1–3", "4–10", "GDPR", "Assistenza"];

/* ---------- Barra in alto e footer (uguali in tutte le pagine) ---------- */
export function nav(r, home, alt) {
  return `<header class="nav glass" data-nav>
  <a class="brand" href="${home}#top" aria-label="Gabriel Tech, vai all'inizio">
    <svg class="brand__logo" aria-hidden="true"><use href="#logo-mark"/></svg>
    <span class="brand__name">Gabriel <b>Tech</b></span>
  </a>
  <nav class="nav__links" id="menu" aria-label="Principale">
    <a href="${home}#servizi">Servizi</a>
    <a href="${home}#prezzi">Prezzi</a>
    <a href="${r}aziende.html">Aziende</a>
    <a href="${r}guide/index.html">Guide</a>
    <a href="${r}regalo.html">Regala</a>
    <a href="${home}#contatti">Contatti</a>
    <a class="nav__only-mobile" href="${r}prenota.html">Prenota un orario</a>
  </nav>
  ${INGLESE && alt ? `<a class="lang-btn" href="${alt}" data-lang-switch hreflang="en" lang="en" aria-label="English version">EN</a>` : ""}
  <button class="theme-btn" type="button" data-theme-toggle aria-pressed="false" aria-label="Passa al tema scuro"><svg class="i i-moon"><use href="#i-moon"/></svg><svg class="i i-sun"><use href="#i-sun"/></svg></button>
  <a class="btn btn--ghost btn--sm nav__cta nav__book" href="${r}prenota.html">${icon("calendar")}Prenota</a>
  <a class="btn btn--wa btn--sm nav__cta" href="${home}#contatti" data-wa>${icon("chat")}WhatsApp</a>
  <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Apri il menu" data-menu><span></span><span></span></button>
</header>`;
}

export function footer(r, home) {
  const servizi = Object.entries(BREVI).map(([slug, nome]) => `<li><a href="${r}servizi/${slug}.html">${nome}</a></li>`).join("\n          ");
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__cols">
      <div class="footer__brand">
        <a class="brand" href="${home}#top"><svg class="brand__logo" aria-hidden="true"><use href="#logo-mark"/></svg><span class="brand__name">Gabriel <b>Tech</b></span></a>
        <p>Assistenza informatica solo da remoto · In tutta Italia</p>
        <p><a href="tel:{{cfg.phoneLink}}" data-phone>{{cfg.phoneDisplay}}</a><br><a href="mailto:{{cfg.email}}" data-email>{{cfg.email}}</a></p>
        <p><a data-channel hidden>Segui il canale WhatsApp</a></p>
      </div>
      <nav aria-label="Servizi">
        <h2>Servizi</h2>
        <ul>
          ${servizi}
          <li><a href="${home}#servizi">Tutti i servizi</a></li>
        </ul>
      </nav>
      <nav aria-label="Risorse">
        <h2>Risorse</h2>
        <ul>
          <li><a href="${r}guide/index.html">Guide e consigli</a></li>
          <li><a href="${r}collegati.html">Collegati con AnyDesk</a></li>
          <li><a href="${r}prenota.html">Prenota un orario</a></li>
          <li><a href="${home}#diagnosi">Diagnosi in 3 domande</a></li>
          <li><a href="${r}regalo.html">Regala assistenza</a></li>
          <li><a href="${r}aziende.html">Per le aziende</a></li>
        </ul>
      </nav>
      <nav aria-label="Informazioni">
        <h2>Informazioni</h2>
        <ul>
          <li><a href="${r}condizioni.html">Condizioni di servizio</a></li>
          <li><a href="${r}privacy.html">Privacy</a></li>
          <li><a href="${home}#sicurezza">Sicurezza</a></li>
          <li><a href="${home}#faq">Domande frequenti</a></li>
          <li><a data-pay="areaAbbonati" hidden>Area abbonati</a></li>
        </ul>
      </nav>
    </div>
    <p class="footer__legal">© <span data-year>{{anno}}</span> {{cfg.intestazione}} · AnyDesk è un marchio di AnyDesk Software GmbH, che non è affiliata a questo sito.</p>
  </div>
</footer>
<a class="fab${FOTO ? " fab--foto" : ""}" href="${home}#contatti" data-wa aria-label="Scrivimi su WhatsApp">{{foto.fab}}</a>
<a class="persona-float" href="${home}#contatti" data-wa data-status data-persona-float aria-label="Scrivimi su WhatsApp: ti rispondo io">
  <span class="persona-float__foto">{{foto.mini}}<span class="dot"></span></span>
  <span class="persona-float__testo"><b>Ti rispondo io</b><small data-status-text>Scrivimi su WhatsApp</small></span>
</a>`;
}

/* ---------- Struttura comune di ogni pagina ---------- */
export function page({ path, title, description, body, noindex = false, jsonld = null, absolute = false, bodyAttrs = "", chrome = true, scripts = [], traduci = true }) {
  const depth = path.split("/").length - 1;
  const r = absolute ? "/" : "../".repeat(depth);
  const home = absolute ? "/" : `${r}index.html`;
  const url = `{{sito}}/${path.replace(/index\.html$/, "")}`;
  const alt = absolute ? "/en/" : `${r}en/${path}`;
  const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
  <meta name="theme-color" content="#f5f5f7" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#050507" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="it_IT">
  <meta property="og:site_name" content="Gabriel Tech">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="{{sito}}/assets/brand/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Foto del tecnico di Gabriel Tech e il titolo «Il tuo computer, sistemato a distanza»">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="apple-mobile-web-app-title" content="Gabriel Tech">
  <link rel="icon" href="${r}favicon.ico" sizes="32x32">
  <link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${r}assets/brand/apple-touch-icon.png">
  <link rel="manifest" href="${r}site.webmanifest">
  <link rel="stylesheet" href="${r}assets/style.css">
  <script>${EARLY}</script>
  <script type="importmap">{ "imports": { "three": "${r || "./"}assets/vendor/three.module.min.js" } }</script>
  <script src="${r}assets/config.js" defer></script>
  <script src="${r}assets/main.js" defer></script>
  <script type="speculationrules">{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/tecnico/*"}},{"not":{"selector_matches":"[target=_blank], [download]"}}]},"eagerness":"moderate"}]}</script>${scripts.map((src) => `\n  <script src="${r}${src}" defer></script>`).join("")}${jsonld ? `\n  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
  <!--HREFLANG-->
</head>
<body${bodyAttrs}>
<a class="skip" href="#main">Vai al contenuto</a>
<div class="backdrop" aria-hidden="true"><span></span><span></span><span></span></div>
${SPRITE}
${chrome && traduci ? nav(r, home, alt) : chrome ? nav(r, home) : ""}
<main id="main">
${body({ r, home })}
</main>
${chrome ? footer(r, home) : ""}
</body>
</html>
`;
  PAGINE.push({ path, html, noindex, traduci, assoluta: absolute });
  return path;
}
const PAGINE = [];

/* ---------- Pezzi riutilizzati ---------- */
const crumbs = (items) => `<nav aria-label="Percorso"><ol class="crumbs">${items.map(([t, h]) => `<li>${h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join("")}</ol></nav>`;
const faq = (items) => `<div class="faq">\n${items.map(([q, a]) => `      <details class="glass reveal"><summary>${q}</summary><p>${a}</p></details>`).join("\n")}\n    </div>`;
const waBtn = (text, label = "Scrivimi su WhatsApp", cls = "btn--wa") => `<a class="btn ${cls}" href="#contatti" data-wa="${esc(text)}">${icon("chat")}${label}</a>`;
const ctaBand = (r, title = "Hai un problema adesso?", text = "Scrivimi: ti dico subito se si risolve da remoto e quanto costa. Il preventivo è gratis.") => `
<section class="wrap">
  <div class="cta-band reveal">
    <div><h2>${title}</h2><p>${text}</p></div>
    <div class="cta-row cta-row--tight">
      <a class="btn btn--light" href="#contatti" data-wa>${icon("chat")}Scrivimi su WhatsApp</a>
      <a class="btn btn--ghost" href="${r}prenota.html">${icon("calendar")}Prenota</a>
    </div>
  </div>
</section>`;
const miniSteps = (r) => `<ol class="steps">
      <li class="step glass reveal"><span class="step__n">1</span><h3>Scrivimi</h3><p>Su WhatsApp o prenotando un orario. Ti dico subito prezzo e tempi.</p></li>
      <li class="step glass reveal"><span class="step__n">2</span><h3>Collegati</h3><p>Apri AnyDesk con la <a href="${r}collegati.html">mia guida</a> e mi detti il tuo numero. Accetti tu la connessione.</p></li>
      <li class="step glass reveal"><span class="step__n">3</span><h3>Risolto</h3><p>Risolvo mentre guardi. Alla fine controlliamo insieme, e solo allora paghi.</p></li>
    </ol>`;

function linkInfo(key) {
  const [kind, slug] = key.split("/");
  if (kind === "servizi") {
    const s = SERVIZI.find((x) => x.slug === slug);
    return { href: `servizi/${s.slug}.html`, tag: "Servizio", title: s.titolo, text: s.descrizione.split(". ")[0] + ".", icon: s.icona, color: s.colore, more: "Scopri" };
  }
  if (kind === "guide") {
    const g = GUIDE.find((x) => x.slug === slug);
    return { href: `guide/${g.slug}.html`, tag: `Guida · ${g.minuti} minuti`, title: g.titolo, text: g.descrizione, icon: "book", color: "blue", more: "Leggi" };
  }
  return { href: "regalo.html", tag: "Idea regalo", title: "Regala assistenza", text: "Un buono per chi ha sempre bisogno di una mano con computer e telefono.", icon: "gift", color: "pink", more: "Scopri" };
}
const cardLink = (r, key) => {
  const x = linkInfo(key);
  return `<article class="guide-card glass reveal" data-tilt><span class="ico ico--${x.color}">${icon(x.icon)}</span><span class="tag">${x.tag}</span><h3><a class="stretched" href="${r}${x.href}">${x.title}</a></h3><p>${x.text}</p><span class="more">${x.more}${icon("arrow")}</span></article>`;
};
const related = (r, keys, title = "Potrebbe interessarti") => `
<section class="section section--tight wrap">
  <div class="head reveal"><h2>${title}</h2></div>
  <div class="guides">
    ${keys.map((k) => cardLink(r, k)).join("\n    ")}
  </div>
</section>`;

/* ==========================================================================
   PAGINE DEI SERVIZI
   ========================================================================== */
for (const s of SERVIZI) {
  page({
    path: `servizi/${s.slug}.html`,
    title: `${s.titolo} da remoto · Gabriel Tech`,
    description: s.descrizione,
    jsonld: {
      "@context": "https://schema.org", "@type": "Service", name: s.titolo, serviceType: s.titolo, description: s.descrizione,
      areaServed: { "@type": "Country", name: "Italia" },
      provider: { "@type": "ProfessionalService", name: "Gabriel Tech", url: "{{sito}}/" },
      offers: { "@type": "Offer", price: `{{pn.${PREZZO_DI[s.pacchetto]}}}`, priceCurrency: "EUR" }
    },
    body: ({ r, home }) => `
<section class="page-hero wrap">
  <div class="page-hero__grid">
    <div>
      ${crumbs([["Home", home], ["Servizi", `${home}#servizi`], [s.titolo]])}
      <span class="ico ico--${s.colore}">${icon(s.icona)}</span>
      <h1>${s.h1}</h1>
      <p class="lead">${s.lead}</p>
      <div class="cta-row">
        ${waBtn(`Ciao! Ho bisogno di aiuto per: ${s.titolo}.`, "Scrivimi su WhatsApp", "btn--wa btn--lg")}
        <a class="btn btn--ghost btn--lg" href="${r}prenota.html?servizio=${s.pacchetto.toLowerCase()}&amp;problema=${encodeURIComponent(s.titolo)}">${icon("calendar")}Prenota</a>
      </div>
      <div class="persona">
        {{foto.mini}}
        <p><b>Ti rispondo io, di persona.</b><span>{{cfg.firmaRiga}}</span></p>
      </div>
    </div>
    <aside class="aside-card glass" aria-label="Prezzo">
      <p class="eyebrow">${s.pacchetto === "Lezione" ? "Lezione a distanza" : `Intervento ${s.pacchetto}`}</p>
      <p class="price"><b>{{p.${PREZZO_DI[s.pacchetto]}}}</b><span>€</span></p>
      <dl>
        <dt>Durata</dt><dd>${s.durata}</dd>
        <dt>Dove</dt><dd>Da remoto, in tutta Italia</dd>
        <dt>Se non risolvo</dt><dd>Non paghi</dd>
        <dt>Paghi</dt><dd>Alla fine, con fattura</dd>
      </dl>
      <p class="meta">${s.nota || "Il prezzo esatto te lo dico prima di iniziare."}</p>
    </aside>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="cols2">
    <div class="card glass reveal">
      <h2>${s.sintomiTitolo || "Quando ti serve"}</h2>
      <ul class="list list--q">
        ${s.sintomi.map((t) => `<li>${icon("arrow")}${t}</li>`).join("\n        ")}
      </ul>
    </div>
    <div class="card glass reveal">
      <h2>${s.cosaTitolo || "Cosa faccio"}</h2>
      <ul class="list">
        ${s.cosa.map((t) => `<li>${icon("check")}${t}</li>`).join("\n        ")}
      </ul>
    </div>
  </div>
  ${s.limiti ? `<p class="callout reveal narrow limit">${s.limiti}</p>` : ""}
</section>
${s.extra ? `
<section class="section section--tight wrap">
  <div class="card glass reveal narrow">
    <h2>${s.extra.titolo}</h2>
    <p class="muted">${s.extra.testo}</p>
    <div class="cta-row">${waBtn(s.extra.wa, "Entra nella lista")}</div>
  </div>
</section>` : ""}
<section class="section section--tight wrap">
  <div class="head reveal"><h2>Come funziona</h2></div>
  ${miniSteps(r)}
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Domande frequenti</h2></div>
  ${faq(s.faq)}
</section>
${related(r, s.correlati)}
${ctaBand(r)}`
  });
}

/* ==========================================================================
   GUIDE
   ========================================================================== */
page({
  path: "guide/index.html",
  title: "Guide e consigli · Gabriel Tech",
  description: "Guide brevi e pratiche per risolvere da solo i problemi più comuni di computer e smartphone e riconoscere le truffe online.",
  body: ({ r, home }) => `
<section class="page-hero wrap">
  ${crumbs([["Home", home], ["Guide"]])}
  <h1>Guide e consigli</h1>
  <p class="lead">Guide brevi e pratiche per risolvere da solo i problemi più comuni e per riconoscere le truffe. Se non basta, ci sono io.</p>
  <div class="cta-row"><a class="btn btn--wa" data-channel hidden>${icon("chat")}Segui il canale WhatsApp: consigli e allerta truffe</a></div>
</section>
<section class="section section--tight wrap">
  <div class="guides">
    ${GUIDE.map((g) => cardLink(r, `guide/${g.slug}`)).join("\n    ")}
  </div>
</section>
${ctaBand(r)}`
});

for (const g of GUIDE) {
  page({
    path: `guide/${g.slug}.html`,
    title: `${g.titolo} · Gabriel Tech`,
    description: g.descrizione,
    jsonld: {
      "@context": "https://schema.org", "@type": "Article", headline: g.titolo, description: g.descrizione,
      datePublished: OGGI, dateModified: OGGI, inLanguage: "it-IT",
      image: "{{sito}}/assets/brand/og-image.png", mainEntityOfPage: `{{sito}}/guide/${g.slug}.html`,
      author: { "@type": "Organization", name: "Gabriel Tech" },
      publisher: { "@type": "Organization", name: "Gabriel Tech", logo: { "@type": "ImageObject", url: "{{sito}}/assets/brand/icon-512.png" } }
    },
    body: ({ r, home }) => `
<section class="page-hero wrap narrow">
  ${crumbs([["Home", home], ["Guide", "index.html"], [g.breve]])}
  <span class="tag">Guida · ${g.minuti} minuti di lettura</span>
  <h1>${g.titolo}</h1>
  <p class="lead">${g.lead}</p>
  <p class="meta">Aggiornata a {{mese}}</p>
</section>
<section class="section section--tight wrap">
  <article class="prose glass reveal">${g.html}
  </article>
  <div class="section-cta"><a class="btn btn--wa" data-channel hidden>${icon("chat")}Segui il canale WhatsApp per altri consigli</a></div>
</section>
${related(r, g.correlati)}
${ctaBand(r)}`
  });
}

/* ==========================================================================
   COLLEGATI CON ANYDESK
   ========================================================================== */
const mockDesktop = `<div class="mock" aria-hidden="true">
      <p class="mock__label">Il tuo indirizzo</p>
      <p class="mock__id">123 456 789</p>
      <div class="mock__req"><b>Richiesta di connessione</b><span>Gabriel Tech vuole collegarsi</span><div class="mock__btns"><i>Rifiuta</i><i class="ok">Accetta</i></div></div>
      <p class="mock__label">È solo un esempio: il numero vero lo vedi sul tuo schermo.</p>
    </div>`;
const mockIos = `<div class="mock" aria-hidden="true">
      <p class="mock__label">Il tuo indirizzo</p>
      <p class="mock__id">123 456 789</p>
      <div class="mock__req"><b>Condivisione dello schermo</b><span>Gabriel Tech potrà vedere lo schermo, non toccarlo</span><div class="mock__btns"><i class="ok">Avvia trasmissione</i></div></div>
      <p class="mock__label">È solo un esempio: il numero vero lo vedi sul tuo schermo.</p>
    </div>`;
const DOWNLOAD = "https://anydesk.com/it/downloads";
const osPanel = (id, name, steps, button, mock, first = false) => `
  <div class="os-panel glass" id="os-${id}" role="tabpanel" aria-labelledby="tab-${id}"${first ? "" : " hidden"}>
    <div>
      <h2>${name}</h2>
      <ol class="howto">
        ${steps.map(([b, p]) => `<li><div><b>${b}</b><p>${p}</p></div></li>`).join("\n        ")}
      </ol>
      <div class="cta-row">${button}</div>
    </div>
    ${mock}
  </div>`;
page({
  path: "collegati.html",
  title: "Collegati con AnyDesk in 2 minuti · Gabriel Tech",
  description: "Guida passo passo per installare AnyDesk su Windows, Mac, Android e iPhone e permettermi di aiutarti da remoto in sicurezza.",
  body: ({ r, home }) => `
<section class="page-hero wrap">
  ${crumbs([["Home", home], ["Collegati con AnyDesk"]])}
  <h1>Collegati in 2 minuti.</h1>
  <p class="lead">Segui i passi per il tuo dispositivo: ho già scelto quello che stai usando, <b data-os-detected>Windows</b>. Se non è giusto, cambialo qui sotto.</p>
</section>
<section class="section section--tight wrap">
  <div class="seg glass" role="tablist" aria-label="Il tuo dispositivo" data-tabs data-os-tabs>
    <button type="button" role="tab" id="tab-win" aria-controls="os-win" aria-selected="true">Windows</button>
    <button type="button" role="tab" id="tab-mac" aria-controls="os-mac" aria-selected="false" tabindex="-1">Mac</button>
    <button type="button" role="tab" id="tab-and" aria-controls="os-and" aria-selected="false" tabindex="-1">Android</button>
    <button type="button" role="tab" id="tab-ios" aria-controls="os-ios" aria-selected="false" tabindex="-1">iPhone</button>
    <span class="seg__thumb" aria-hidden="true"></span>
  </div>
  ${osPanel("win", "Su Windows", [
    ["Scarica AnyDesk", "Solo dal sito ufficiale anydesk.com, con il pulsante qui sotto."],
    ["Aprilo", "Apri il file scaricato. Non serve installarlo: si usa subito. Se Windows chiede il permesso, premi «Sì»."],
    ["Dimmi il tuo indirizzo", "È il numero che vedi sotto «Il tuo indirizzo». Scrivimelo qui sotto o dettamelo al telefono."],
    ["Premi «Accetta»", "Quando compare la mia richiesta di connessione, controlla che sia Gabriel Tech e premi «Accetta»."]
  ], `<a class="btn btn--primary" href="${DOWNLOAD}" target="_blank" rel="noopener">${icon("download")}Scarica per Windows</a>`, mockDesktop, true)}
  ${osPanel("mac", "Su Mac", [
    ["Scarica AnyDesk", "Solo dal sito ufficiale anydesk.com, con il pulsante qui sotto."],
    ["Aprilo", "Apri il file scaricato e avvia AnyDesk. Se vuoi, trascinalo nella cartella Applicazioni."],
    ["Dai i permessi", "Il Mac chiede di consentire «Registrazione dello schermo» e «Accessibilità» in Impostazioni di Sistema › Privacy e sicurezza. Senza, vedo lo schermo ma non posso muovere il mouse."],
    ["Dimmi il tuo indirizzo e premi «Accetta»", "Scrivimi il numero che vedi, poi accetta la mia richiesta di connessione."]
  ], `<a class="btn btn--primary" href="${DOWNLOAD}" target="_blank" rel="noopener">${icon("download")}Scarica per Mac</a>`, mockDesktop)}
  ${osPanel("and", "Su Android", [
    ["Installa AnyDesk", "Da Google Play. Controlla che lo sviluppatore sia «AnyDesk Software GmbH»."],
    ["Consenti i permessi", "Apri l'app e accetta i permessi richiesti. Se te lo chiede, attiva il servizio di accessibilità o installa il plugin di AnyDesk: serve per permettermi di toccare lo schermo."],
    ["Dimmi il tuo indirizzo", "È il numero che vedi nell'app. Scrivimelo qui sotto."],
    ["Accetta e condividi lo schermo", "Premi «Accetta» e conferma la condivisione dello schermo."]
  ], `<a class="btn btn--primary" href="https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid" target="_blank" rel="noopener">${icon("download")}Apri Google Play</a>`, mockDesktop)}
  ${osPanel("ios", "Su iPhone e iPad", [
    ["Installa AnyDesk", "Dall'App Store: cerca «AnyDesk» e controlla che lo sviluppatore sia «AnyDesk Software GmbH»."],
    ["Dimmi il tuo indirizzo", "Apri l'app e scrivimi il numero che vedi."],
    ["Avvia la trasmissione", "Quando accetti, premi «Avvia trasmissione» per condividere lo schermo. Su iPhone posso vedere ma non toccare: ti guido io, passo passo."]
  ], `<a class="btn btn--primary" href="${DOWNLOAD}" target="_blank" rel="noopener">${icon("download")}Tutti i download ufficiali</a>`, mockIos)}
</section>

<section class="section section--tight wrap">
  <div class="card glass reveal narrow">
    <h2>Pronto? Mandami il tuo indirizzo</h2>
    <p class="muted">Scrivi il numero che vedi in AnyDesk: si apre WhatsApp con il messaggio già pronto.</p>
    <form class="idform" data-anydesk-id>
      <label class="sr-only" for="ad-id">Il tuo indirizzo AnyDesk</label>
      <input id="ad-id" name="id" inputmode="numeric" autocomplete="off" placeholder="Es. 123 456 789">
      <button class="btn btn--wa" type="submit">${icon("chat")}Invia su WhatsApp</button>
    </form>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="cols2">
    <div class="card glass reveal">
      <h2>Per la tua sicurezza</h2>
      <ul class="list">
        <li>${icon("check")}Usa AnyDesk solo con chi hai contattato tu.</li>
        <li>${icon("check")}Se qualcuno ti chiama a sorpresa e ti chiede di installarlo, riattacca.</li>
        <li>${icon("check")}Non dare mai a nessuno i codici che ricevi dalla banca.</li>
        <li>${icon("check")}Puoi chiudere la sessione in qualsiasi momento.</li>
      </ul>
    </div>
    <div class="card glass reveal">
      <h2>A fine intervento</h2>
      <p class="muted">Chiudo io la sessione. Se vuoi, puoi anche disinstallare AnyDesk:</p>
      <ul class="list list--q">
        <li>${icon("arrow")}Windows: se l'hai solo aperto, cancella il file scaricato; se l'hai installato, vai in Impostazioni › App.</li>
        <li>${icon("arrow")}Mac: trascina AnyDesk dalla cartella Applicazioni nel Cestino.</li>
        <li>${icon("arrow")}Telefono: tieni premuta l'icona e scegli «Disinstalla» o «Rimuovi app».</li>
      </ul>
    </div>
  </div>
</section>
${ctaBand(r, "Serve una mano a collegarti?", "Chiamami o scrivimi: ti guido io al telefono, passo passo.")}`
});

/* ==========================================================================
   PRENOTA
   ========================================================================== */
page({
  path: "prenota.html",
  title: "Prenota un orario · Gabriel Tech",
  description: "Prenota un intervento di assistenza informatica da remoto: scegli giorno e orario, ti confermo su WhatsApp.",
  body: ({ r, home }) => `
<section class="page-hero wrap">
  ${crumbs([["Home", home], ["Prenota"]])}
  <h1>Prenota un orario.</h1>
  <p class="lead">Scegli giorno e ora: ti confermo su WhatsApp. Per gli interventi singoli non paghi niente in anticipo.</p>
  <div class="persona">
    {{foto.mini}}
    <p><b>Ti rispondo io, di persona.</b><span>{{cfg.firmaRiga}}</span></p>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="card glass reveal" data-booking-external hidden>
    <h2>Scegli un orario dal calendario</h2>
    <p class="muted">Il calendario è di un servizio esterno che può usare cookie: si carica solo se premi il pulsante.</p>
    <div class="cta-row"><button class="btn btn--primary" type="button" data-load-booking>${icon("calendar")}Apri il calendario</button><a class="btn btn--ghost" data-booking-link target="_blank" rel="noopener">Apri in una nuova scheda</a></div>
    <div class="booking-frame" data-booking-frame></div>
  </div>

  <div class="contact" data-booking-internal>
    <form class="form card glass reveal" name="prenotazione" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-form data-booking data-wa-intro="Ciao! Vorrei prenotare un intervento." data-success="Richiesta inviata! Ti confermo l'orario su WhatsApp appena possibile." data-success-link="collegati.html" data-success-link-text="Intanto prepara AnyDesk.">
      <input type="hidden" name="form-name" value="prenotazione">
      <input type="hidden" name="lingua" value="it" data-lang-field>
      <input type="hidden" name="data">
      <p class="hp"><label>Non compilare questo campo: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="field">
        <label for="b-servizio">Cosa ti serve</label>
        <select id="b-servizio" name="servizio">
          <option data-servizio="rapido">Intervento Rapido · {{p.rapido}} € · fino a 30 minuti</option>
          <option data-servizio="completo">Intervento Completo · {{p.completo}} € · fino a 60 minuti</option>
          <option data-servizio="lezione">Lezione a distanza</option>
          <option data-servizio="pacchetto5">Pacchetto 5 ore</option>
          <option data-servizio="abbonamento">Abbonamento Famiglia o Professionisti</option>
          <option data-servizio="aziende">Aziende: prima chiamata gratuita</option>
          <option data-servizio="nonso">Non so, aiutami a scegliere</option>
        </select>
      </div>
      <div class="field">
        <span class="field__label" id="lbl-giorno">Giorno</span>
        <div class="days" data-days role="radiogroup" aria-labelledby="lbl-giorno"></div>
      </div>
      <div class="field">
        <span class="field__label" id="lbl-orario">Orario (ora italiana)</span>
        <div class="slots" data-slots role="radiogroup" aria-labelledby="lbl-orario"><p class="muted">Scegli prima un giorno.</p></div>
      </div>
      <input type="hidden" name="giorno" data-label="Giorno">
      <input type="hidden" name="orario" data-label="Orario">
      <div class="row">
        <div class="field">
          <label for="b-nome">Nome</label>
          <input id="b-nome" name="nome" autocomplete="given-name" required maxlength="60">
        </div>
        <div class="field">
          <label for="b-tel">Telefono</label>
          <input id="b-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ ]{6,20}" title="Solo numeri, spazi e il segno +">
        </div>
      </div>
      <div class="field">
        <label for="b-disp">Dispositivo</label>
        <select id="b-disp" name="dispositivo">
          <option>PC Windows</option><option>Mac</option><option>Smartphone Android</option><option>iPhone o iPad</option><option>Altro</option>
        </select>
      </div>
      <div class="field">
        <label for="b-msg">Descrivi il problema <span>(facoltativo)</span></label>
        <textarea id="b-msg" name="messaggio" rows="3" maxlength="800"></textarea>
      </div>
      <div class="field">
        <label for="b-email">Email <span>(facoltativa: ti mando conferma e promemoria)</span></label>
        <input id="b-email" name="email" type="email" autocomplete="email" maxlength="100">
      </div>
      <label class="check"><input type="checkbox" name="aggiornamenti" value="si"><span>Mandami su WhatsApp la conferma e un promemoria dell'appuntamento e, dopo l'intervento, una richiesta di recensione (anche via email, se la lasci). Al massimo 3 messaggi.</span></label>
      <label class="check"><input type="checkbox" name="condizioni" value="accettate" required><span>Ho letto le <a href="condizioni.html">condizioni di servizio</a> e l'<a href="privacy.html">informativa privacy</a>.</span></label>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--primary" type="submit">${icon("calendar")}Invia la prenotazione</button>
        <button class="btn btn--ghost" type="button" data-form-wa>${icon("chat")}Invia su WhatsApp</button>
      </div>
      <p class="form__status" role="status" aria-live="polite" data-form-status></p>
    </form>

    <div class="card glass reveal">
      <p class="status status--inline" data-status><span class="dot"></span><span data-status-text>Orari qui sotto</span></p>
      <h2>Come funziona</h2>
      <ol class="howto">
        <li><div><b>Scegli giorno e ora</b><p>Vedi solo gli orari in cui sono disponibile.</p></div></li>
        <li><div><b>Ti confermo su WhatsApp</b><p>L'orario diventa definitivo quando te lo confermo.</p></div></li>
        <li><div><b>All'ora stabilita ci colleghiamo</b><p>Tieni pronto AnyDesk: <a href="collegati.html">ecco la guida</a>.</p></div></li>
      </ol>
      <table class="hours" data-hours>
        <caption>Orari (ora italiana)</caption>
        <tbody>
{{orari.righe}}
        </tbody>
      </table>
    </div>
  </div>
</section>`
});

/* ==========================================================================
   REGALA ASSISTENZA
   ========================================================================== */
const buono = (nome, prezzo, sotto, voci, key, hot = false) => `
    <article class="plan glass reveal${hot ? " plan--hot" : ""}" data-tilt>
      ${hot ? '<span class="badge">Consigliato</span>' : ""}
      <span class="ico ico--pink">${icon("gift")}</span>
      <h3 class="plan__name">${nome}</h3>
      <p class="price"><b>${prezzo}</b><span>€</span></p>
      <p class="plan__sub">${sotto}</p>
      <ul>
        ${voci.map((v) => `<li>${icon("check")}${v}</li>`).join("\n        ")}
      </ul>
      <div class="plan__actions">
        <a class="btn btn--primary btn--block" data-pay="${key}" hidden>Acquista online</a>
        <a class="btn btn--ghost btn--block" href="#contatti" data-pay-fallback="${key}" data-wa="${esc(`Ciao! Vorrei acquistare un ${nome.toLowerCase()} da ${prezzo} €.`)}">Acquista su WhatsApp</a>
      </div>
    </article>`;
page({
  path: "regalo.html",
  title: "Regala assistenza: buono regalo · Gabriel Tech",
  description: "Buono regalo di assistenza informatica da remoto: il regalo perfetto per genitori, nonni e amici. Valido 12 mesi, in tutta Italia.",
  body: ({ r, home }) => `
<section class="page-hero wrap">
  <div class="page-hero__grid">
    <div>
      ${crumbs([["Home", home], ["Regala assistenza"]])}
      <span class="ico ico--pink">${icon("gift")}</span>
      <h1>Regala assistenza.</h1>
      <p class="lead">Il regalo perfetto per chi ha sempre bisogno di una mano con computer e telefono: genitori, nonni, amici. Lo usano quando vogliono, entro 12 mesi, ovunque siano in Italia.</p>
      <div class="cta-row">
        <a class="btn btn--primary btn--lg" href="#buoni">${icon("gift")}Scegli il buono</a>
        <a class="btn btn--ghost btn--lg" href="#amico">Porta un amico</a>
      </div>
    </div>
    <div class="voucher" aria-hidden="true">
      <svg class="voucher__logo"><use href="#logo-mark"/></svg>
      <small>Buono regalo · Gabriel Tech</small>
      <b>{{p.completo}} €</b>
      <small>Assistenza informatica da remoto</small>
      <code>GT-4K7P-2QX9</code>
    </div>
  </div>
</section>

<section class="section section--tight wrap" id="buoni">
  <div class="head reveal">
    <h2>Scegli il buono</h2>
    <p>Ricevi un buono in PDF con un codice personale, da stampare o da inviare su WhatsApp.</p>
  </div>
  <div class="plans">${buono("Buono Rapido", "{{p.rapido}}", "Un intervento fino a 30 minuti", ["Email, PEC e stampanti", "SPID, CIE e app", "Un programma da installare"], "buono25")}${buono("Buono Completo", "{{p.completo}}", "Un intervento fino a 60 minuti", ["PC lento o virus", "Passaggio a Windows 11", "Backup di foto e documenti"], "buono45", true)}${buono("Buono 5 ore", "{{p.pacchetto5}}", "5 ore da usare in più volte", ["Ideale per lezioni a distanza", "Per tutta la famiglia", "Valido 12 mesi"], "buono179")}
  </div>
  <p class="note reveal">Vuoi un importo diverso? <a href="#contatti" data-wa="Ciao! Vorrei un buono regalo con un importo personalizzato.">Scrivimi</a> e lo preparo su misura.</p>
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Come funziona</h2></div>
  <ol class="steps">
    <li class="step glass reveal"><span class="step__n">1</span><h3>Scegli e paghi</h3><p>Online o su WhatsApp. Ricevi la ricevuta o la fattura.</p></li>
    <li class="step glass reveal"><span class="step__n">2</span><h3>Ricevi il buono</h3><p>Un PDF con codice personale e scadenza, da stampare o inoltrare.</p></li>
    <li class="step glass reveal"><span class="step__n">3</span><h3>Chi lo riceve mi scrive</h3><p>Quando vuole, entro 12 mesi, indicando il codice del buono.</p></li>
  </ol>
</section>

<section class="section section--tight wrap" id="amico">
  <div class="card glass reveal narrow">
    <span class="ico ico--yellow">${icon("star")}</span>
    <h2>Porta un amico: 5 € a te, 5 € a lui</h2>
    <p class="muted">Se un amico mi contatta da parte tua e fa un intervento, avete tutti e due 5 € di sconto sul prossimo intervento. Basta che mi dica il tuo nome nel primo messaggio.</p>
    <div class="cta-row"><a class="btn btn--wa" data-share="Ti consiglio Gabriel Tech per l'assistenza al computer da remoto: {sito} Digli che ti mando io!" href="#">${icon("chat")}Invita un amico su WhatsApp</a></div>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Domande frequenti</h2></div>
  ${faq([
    ["Quanto dura il buono?", "12 mesi dall'acquisto. La scadenza è scritta sul buono."],
    ["Chi lo riceve può abitare in un'altra città?", "Sì: lavoro da remoto in tutta Italia."],
    ["Si può convertire in denaro?", "No, ma si può regalare a un'altra persona. Se non basta per l'intervento, si paga solo la differenza."]
  ])}
</section>
${ctaBand(r, "Hai domande sul buono?", "Scrivimi: ti aiuto a scegliere quello giusto per chi lo riceve.")}`
});

/* ==========================================================================
   AZIENDE
   ========================================================================== */
page({
  path: "aziende.html",
  title: "Assistenza informatica da remoto per aziende e professionisti · Gabriel Tech",
  description: "Assistenza IT da remoto per studi, negozi e piccoli uffici: postazioni, Microsoft 365, backup, sicurezza e GDPR. Da {{p.professionisti}} € al mese.",
  body: ({ r, home }) => `
<section class="page-hero wrap">
  <div class="page-hero__grid">
    <div>
      ${crumbs([["Home", home], ["Aziende"]])}
      <span class="ico ico--indigo">${icon("building")}</span>
      <h1>Il tuo reparto informatico, da remoto.</h1>
      <p class="lead">Per studi, negozi e piccoli uffici: postazioni, email, backup e sicurezza, con un solo riferimento e tempi di risposta chiari.</p>
      <div class="cta-row">
        <a class="btn btn--primary btn--lg" href="#preventivo">${icon("phone")}Chiamata conoscitiva gratuita</a>
        ${waBtn("Ciao! Vorrei informazioni sull'assistenza per la mia azienda.", "WhatsApp", "btn--wa btn--lg")}
      </div>
    </div>
    <aside class="aside-card glass" aria-label="Prezzi">
      <p class="eyebrow">Professionisti</p>
      <p class="price"><b>{{p.professionisti}}</b><span>€</span><small>/mese</small></p>
      <dl>
        <dt>Postazioni</dt><dd>fino a 3</dd>
        <dt>Assistenza</dt><dd>fino a 2 ore al mese</dd>
        <dt>Risposta</dt><dd>entro 2 ore lavorative</dd>
      </dl>
      <p class="meta">Oltre 3 postazioni: preventivo su misura.</p>
    </aside>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Cosa gestisco per te</h2></div>
  <div class="cards">
    <div class="card-sm glass reveal" data-tilt><span class="ico ico--blue">${icon("monitor")}</span><h3>Postazioni e utenti</h3><p>PC pronti, aggiornati e sicuri. Nuovi dipendenti operativi dal primo giorno.</p></div>
    <div class="card-sm glass reveal" data-tilt><span class="ico ico--sky">${icon("mail")}</span><h3>Email e Microsoft 365</h3><p>Caselle aziendali, PEC, calendari condivisi, Teams e OneDrive.</p></div>
    <div class="card-sm glass reveal" data-tilt><span class="ico ico--teal">${icon("cloud")}</span><h3>Backup e monitoraggio</h3><p>Backup automatici e un controllo quotidiano di ogni PC: ti avviso prima che un problema fermi il lavoro.</p></div>
    <div class="card-sm glass reveal" data-tilt><span class="ico ico--red">${icon("shield")}</span><h3>Sicurezza</h3><p>Antivirus, aggiornamenti, verifica in due passaggi, password e formazione contro il phishing.</p></div>
    <div class="card-sm glass reveal" data-tilt><span class="ico ico--gray">${icon("printer")}</span><h3>Stampanti e rete</h3><p>Stampanti condivise, Wi-Fi dell'ufficio, cartelle in rete.</p></div>
    <div class="card-sm glass reveal" data-tilt><span class="ico ico--green">${icon("lock")}</span><h3>GDPR</h3><p>Nomina a responsabile del trattamento, accessi remoti solo autorizzati, riservatezza.</p></div>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Come lavoriamo</h2></div>
  <ol class="steps">
    <li class="step glass reveal"><span class="step__n">1</span><h3>Chiamata gratuita</h3><p>20 minuti per capire come lavorate e cosa vi serve.</p></li>
    <li class="step glass reveal"><span class="step__n">2</span><h3>Proposta chiara</h3><p>Un preventivo mensile senza sorprese, con cosa è incluso e cosa no.</p></li>
    <li class="step glass reveal"><span class="step__n">3</span><h3>Assistenza continua</h3><p>WhatsApp, telefono ed email, con un riepilogo mensile degli interventi.</p></li>
  </ol>
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Piani</h2></div>
  <div class="plans plans--2">
    <article class="plan plan--hot glass reveal" data-tilt>
      <span class="badge">Per partite IVA</span>
      <h3 class="plan__name">Professionisti</h3>
      <p class="price"><b>{{p.professionisti}}</b><span>€</span><small>/mese</small></p>
      <p class="plan__sub">Fino a 3 postazioni · fattura mensile</p>
      <ul>
        <li>${icon("check")}Fino a 2 ore di assistenza al mese</li>
        <li>${icon("check")}Email, PEC e Microsoft 365</li>
        <li>${icon("check")}Monitoraggio automatico di PC e backup</li>
        <li>${icon("check")}Risposta entro 2 ore lavorative</li>
      </ul>
      <div class="plan__actions">
        <a class="btn btn--primary btn--block" data-pay="professionisti" hidden>Attiva online</a>
        <a class="btn btn--ghost btn--block" href="#preventivo">Parliamone</a>
      </div>
    </article>
    <article class="plan glass reveal" data-tilt>
      <h3 class="plan__name">Aziende</h3>
      <p class="price price--text"><b>Su misura</b></p>
      <p class="plan__sub">Oltre 3 postazioni</p>
      <ul>
        <li>${icon("check")}Assistenza per tutto l'ufficio</li>
        <li>${icon("check")}Accesso non presidiato, solo se autorizzato</li>
        <li>${icon("check")}Monitoraggio di tutte le postazioni</li>
        <li>${icon("check")}Nomina a responsabile del trattamento (GDPR)</li>
      </ul>
      <div class="plan__actions"><a class="btn btn--ghost btn--block" href="#preventivo">Chiedi un preventivo</a></div>
    </article>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head reveal"><h2>Domande frequenti</h2></div>
  ${faq([
    ["Come accedi ai PC quando in ufficio non c'è nessuno?", "Solo se lo autorizzi: si configura un accesso non presidiato protetto da password, sulle postazioni che scegli tu, revocabile in ogni momento."],
    ["Emetti fattura?", "Sì, fattura elettronica mensile per gli abbonamenti e per ogni intervento extra."],
    ["E se serve un intervento sul posto?", "Lavoro solo da remoto: per l'hardware ti aiuto a trovare un tecnico nella tua zona o a parlare con il tuo fornitore."],
    ["Come gestisci i dati dei nostri clienti?", "Accedo solo a quello che serve per l'intervento e firmiamo la nomina a responsabile del trattamento prevista dall'articolo 28 del GDPR."]
  ])}
</section>

<section class="section section--tight wrap" id="preventivo">
  <form class="form card glass reveal narrow" name="preventivo-aziende" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-form data-wa-intro="Ciao! Vorrei un preventivo per l'assistenza alla mia azienda." data-success="Grazie! Ti contatto per fissare la chiamata conoscitiva.">
    <input type="hidden" name="form-name" value="preventivo-aziende">
    <input type="hidden" name="lingua" value="it" data-lang-field>
    <p class="hp"><label>Non compilare questo campo: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <h2>Chiamata conoscitiva gratuita</h2>
    <p class="muted">Lasciami i tuoi dati: ti richiamo per fissare 20 minuti insieme.</p>
    <div class="row">
      <div class="field"><label for="a-azienda">Azienda o studio</label><input id="a-azienda" name="azienda" autocomplete="organization" required maxlength="80"></div>
      <div class="field"><label for="a-nome">Referente</label><input id="a-nome" name="nome" autocomplete="name" required maxlength="60"></div>
    </div>
    <div class="row">
      <div class="field"><label for="a-tel">Telefono</label><input id="a-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ ]{6,20}" title="Solo numeri, spazi e il segno +"></div>
      <div class="field"><label for="a-email">Email</label><input id="a-email" name="email" type="email" autocomplete="email" maxlength="100"></div>
    </div>
    <div class="field">
      <label for="a-post">Quante postazioni?</label>
      <select id="a-post" name="postazioni"><option>1–3</option><option>4–10</option><option>Più di 10</option></select>
    </div>
    <div class="field"><label for="a-msg">Di cosa avete bisogno? <span>(facoltativo)</span></label><textarea id="a-msg" name="esigenze" rows="3" maxlength="1000"></textarea></div>
    <label class="check"><input type="checkbox" name="privacy" value="letta" required><span>Ho letto l'<a href="privacy.html">informativa privacy</a> e chiedo di essere ricontattato.</span></label>
    <div class="cta-row cta-row--tight">
      <button class="btn btn--primary" type="submit">Richiedi la chiamata</button>
      <button class="btn btn--ghost" type="button" data-form-wa>${icon("chat")}Invia su WhatsApp</button>
    </div>
    <p class="form__status" role="status" aria-live="polite" data-form-status></p>
  </form>
</section>`
});

/* ==========================================================================
   CONDIZIONI DI SERVIZIO e PRIVACY
   ========================================================================== */
const legalPage = (path, title, description, h1, html) => page({
  path, title, description,
  body: ({ home }) => `
<section class="page-hero wrap narrow">
  ${crumbs([["Home", home], [h1]])}
  <h1>${h1}</h1>
  <p class="meta">Ultimo aggiornamento: [gg/mm/aaaa]</p>
</section>
<section class="section section--tight wrap">
  <article class="prose glass reveal">
    <p class="callout callout--warn">Modello da completare con i tuoi dati e da far verificare da un commercialista o da un legale prima di pubblicare il sito.</p>${html}
  </article>
</section>`
});

legalPage("condizioni.html", "Condizioni di servizio · Gabriel Tech", "Condizioni del servizio di assistenza informatica da remoto di Gabriel Tech: prezzi, pagamenti, garanzia, recesso e responsabilità.", "Condizioni di servizio", `
    <h2>1. Chi fornisce il servizio</h2>
    <p>Il servizio Gabriel Tech è fornito da {{cfg.titolare}}, {{cfg.indirizzo}}, P.IVA {{cfg.piva}}, email {{cfg.email}}, di seguito «il tecnico».</p>
    <h2>2. Il servizio</h2>
    <p>Assistenza informatica <strong>esclusivamente da remoto</strong>, tramite un programma di controllo remoto (AnyDesk o equivalente), telefono e WhatsApp. Il collegamento avviene solo con il consenso del cliente, che accetta ogni sessione e può interromperla in qualsiasi momento. Non sono compresi interventi sul posto né riparazioni hardware.</p>
    <h2>3. Preventivo e prezzi</h2>
    <p>Prima di ogni intervento il tecnico comunica prezzo e durata stimata. I prezzi sono quelli indicati sul sito: intervento Rapido {{p.rapido}} € (fino a 30 minuti), intervento Completo {{p.completo}} € (fino a 60 minuti). Il tempo extra costa {{p.extra30}} € ogni 30 minuti e si applica solo se concordato prima. Per le urgenze fuori orario si aggiungono {{p.urgenza}} €. [Indicare il regime fiscale: per esempio «prezzi finali, operazione senza IVA ai sensi del regime forfettario» oppure «IVA inclusa».]</p>
    <h2>4. «Se non risolvo, non paghi»</h2>
    <p>Se il problema non si può risolvere da remoto, l'intervento non viene addebitato. Se il cliente interrompe l'intervento prima della fine, o se la soluzione richiede un acquisto (licenza, programma, pezzo di ricambio) che il cliente decide di non fare, si paga solo il tempo già usato, a blocchi di 30 minuti.</p>
    <h2>5. Pagamento</h2>
    <p>Gli interventi singoli si pagano a fine intervento, entro [7] giorni, con carta, PayPal, Satispay o bonifico. Pacchetti, abbonamenti e buoni regalo si pagano in anticipo. Per ogni pagamento viene emessa fattura elettronica.</p>
    <h2>6. Diritto di recesso per i consumatori</h2>
    <p>Chi acquista come consumatore a distanza ha 14 giorni per recedere dal contratto (art. 52 del Codice del Consumo). Chiedendo di iniziare subito l'intervento, il cliente richiede espressamente l'esecuzione durante questo periodo e riconosce che, a servizio completamente eseguito, perde il diritto di recesso (art. 59). Se recede prima che il servizio sia completato, paga solo la parte già fornita (art. 57). Per pacchetti e abbonamenti il recesso nei 14 giorni dà diritto al rimborso della parte non ancora usata.</p>
    <h2>7. Abbonamenti</h2>
    <p>Gli abbonamenti sono mensili e si rinnovano automaticamente. Si possono disdire in qualsiasi momento, senza penali, con effetto dal mese successivo. Gli interventi inclusi in un mese non si sommano ai mesi successivi.</p>
    <h2>8. Monitoraggio dei computer</h2>
    <p>Per gli abbonati che lo chiedono, il tecnico installa un piccolo programma che una volta al giorno invia lo stato di salute del computer: spazio sui dischi, antivirus, firewall, aggiornamenti, salute dei dischi e data dell'ultimo backup. Il programma non legge i file personali, non registra cosa fa l'utente e non permette di controllare il computer a distanza. Si può chiedere di toglierlo in qualsiasi momento; alla fine dell'abbonamento viene disattivato e si disinstalla da solo.</p>
    <h2>9. Messaggi automatici</h2>
    <p>Chi lascia un'email riceve la ricevuta della richiesta e, per gli appuntamenti, conferma e promemoria. Su WhatsApp i messaggi automatici partono solo se il cliente lo ha chiesto spuntando l'apposita casella, e sono al massimo tre per richiesta: conferma, promemoria e richiesta di recensione. Anche la richiesta di recensione via email parte solo con quel consenso.</p>
    <h2>10. Pacchetti e buoni regalo</h2>
    <p>Il Pacchetto 5 ore e i buoni regalo valgono 12 mesi dall'acquisto. Il pacchetto si usa a blocchi di 30 minuti. I buoni non si possono convertire in denaro ma si possono cedere ad altre persone.</p>
    <h2>11. Cosa chiedo al cliente</h2>
    <ul>
      <li>Avere un backup dei dati importanti, oppure chiedermi di farlo prima dell'intervento.</li>
      <li>Usare solo programmi con licenza regolare.</li>
      <li>Essere autorizzato a far intervenire sul dispositivo, se è dell'azienda o di un'altra persona.</li>
      <li>Restare disponibile durante l'intervento.</li>
      <li>Custodire le proprie password: non le chiedo e non le salvo.</li>
    </ul>
    <h2>12. Responsabilità</h2>
    <p>Il tecnico lavora con la diligenza professionale richiesta. Nei limiti consentiti dalla legge, non risponde di perdite di dati dovute alla mancanza di un backup o a guasti dell'hardware, salvo dolo o colpa grave. Restano sempre validi i diritti che la legge riconosce ai consumatori.</p>
    <h2>13. Riservatezza e dati personali</h2>
    <p>Durante le sessioni il tecnico accede solo a quello che serve per l'intervento e non copia i file del cliente. Le sessioni vengono registrate solo se il cliente ne è informato prima. I dati personali sono trattati come descritto nell'<a href="privacy.html">informativa privacy</a>.</p>
    <h2>14. Reclami e legge applicabile</h2>
    <p>Per qualsiasi reclamo scrivi a {{cfg.email}}: ti rispondo il prima possibile. Si applica la legge italiana. Per i consumatori è competente il giudice del luogo in cui il consumatore risiede.</p>`);

legalPage("privacy.html", "Informativa privacy · Gabriel Tech", "Come Gabriel Tech tratta i dati personali di chi chiede assistenza.", "Informativa privacy", `
    <h2>1. Chi tratta i tuoi dati</h2>
    <p>Il titolare del trattamento è {{cfg.titolare}}, {{cfg.indirizzo}}, P.IVA {{cfg.piva}}, email {{cfg.email}}.</p>
    <h2>2. Quali dati raccolgo</h2>
    <ul>
      <li>I dati dei moduli del sito (richiamata, prenotazione, preventivo aziende): nome, telefono, eventuale email e azienda, dispositivo, giorno e orario scelti, descrizione del problema, lingua della pagina e la tua scelta sui messaggi WhatsApp.</li>
      <li>Lo storico della tua richiesta nel mio gestionale: stato, data dell'appuntamento e quali messaggi automatici ti sono stati inviati.</li>
      <li>I dati che mi invii su WhatsApp, per email o al telefono.</li>
      <li>Durante una sessione remota posso vedere ciò che compare sul tuo schermo: lo tratto solo per quanto serve all'intervento.</li>
      <li>I dati per la fattura, se acquisti un servizio.</li>
      <li>Se usi l'assistente virtuale del sito, i messaggi che gli scrivi e, per un'ora, un'impronta cifrata del tuo indirizzo IP che serve solo a limitare gli abusi.</li>
      <li>Se hai un abbonamento con monitoraggio del computer: nome del computer, versione del sistema operativo, spazio sui dischi, stato di antivirus, firewall e aggiornamenti, salute dei dischi, da quanti giorni è acceso e data dell'ultimo backup. Non raccolgo file, cronologia o altri contenuti personali.</li>
    </ul>
    <h2>3. Perché li uso</h2>
    <ul>
      <li>Rispondere alle tue richieste e prepararti un preventivo (misure precontrattuali, art. 6.1.b del GDPR).</li>
      <li>Eseguire l'intervento, il pacchetto o l'abbonamento che hai scelto, compresi conferme, promemoria degli appuntamenti e monitoraggio dei computer degli abbonati (esecuzione del contratto, art. 6.1.b).</li>
      <li>Mandarti messaggi su WhatsApp e una richiesta di recensione dopo l'intervento, solo se lo hai chiesto (consenso, art. 6.1.a). Puoi revocarlo quando vuoi scrivendomi.</li>
      <li>Rispettare gli obblighi fiscali e contabili (obbligo di legge, art. 6.1.c).</li>
    </ul>
    <h2>4. Per quanto tempo</h2>
    <p>Le richieste e lo storico dei messaggi restano nel gestionale al massimo 12 mesi, poi vengono cancellati in automatico. Del monitoraggio conservo solo l'ultimo controllo di ogni computer, finché dura l'abbonamento: quando lo togli, i dati vengono cancellati. I dati di fatturazione sono conservati per 10 anni, come prevede la legge. Non conservo copie dei file visti durante le sessioni remote.</p>
    <h2>5. A chi possono arrivare</h2>
    <p>Solo ai fornitori che mi servono per lavorare, quando li uso:</p>
    <ul>
      <li>hosting del sito, dei moduli e dell'archivio del gestionale: Netlify, Inc.;</li>
      <li>controllo remoto: AnyDesk Software GmbH;</li>
      <li>messaggistica: WhatsApp e WhatsApp Business Platform (gruppo Meta), per i messaggi automatici se li hai chiesti, e Telegram, che uso per ricevere sul telefono le richieste del sito e gli avvisi del monitoraggio;</li>
      <li>email automatiche, se lasci un indirizzo: Brevo (Sendinblue SAS, Francia) oppure Resend, Inc., a seconda del servizio che uso;</li>
      <li>pagamenti: il servizio che scegli (per esempio Stripe, PayPal, SumUp o Satispay);</li>
      <li>assistente virtuale, se attivo: Anthropic, che elabora i messaggi per generare le risposte;</li>
      <li>statistiche di visita, se attive: Cloudflare, in forma anonima e senza cookie;</li>
      <li>il mio commercialista.</li>
    </ul>
    <p>Alcuni fornitori possono trattare dati fuori dall'Unione europea con le garanzie previste dal GDPR, come il Data Privacy Framework UE-USA o le clausole contrattuali standard. Non vendo e non cedo i tuoi dati a nessuno.</p>
    <h2>6. I tuoi diritti</h2>
    <p>Puoi chiedere di accedere ai tuoi dati, correggerli, cancellarli, limitarne l'uso, riceverne una copia o opporti al trattamento (artt. 15–22 del GDPR) scrivendo a {{cfg.email}}. Puoi anche presentare reclamo al <a href="https://www.garanteprivacy.it/" target="_blank" rel="noopener">Garante per la protezione dei dati personali</a>.</p>
    <h2>7. Cookie</h2>
    <p>Il sito non usa cookie di profilazione. Il tema chiaro o scuro che scegli viene ricordato solo nel tuo browser. Se attivo il calendario di prenotazione di un servizio esterno, che può usare cookie, si carica solo quando premi il pulsante per aprirlo.</p>
    <h2>8. Aziende e professionisti</h2>
    <p>Se sei un'attività e durante l'assistenza tratto dati dei tuoi clienti o dipendenti, firmiamo un accordo di nomina a responsabile del trattamento (art. 28 del GDPR).</p>`);

/* ==========================================================================
   RECENSIONE, 404
   ========================================================================== */
page({
  path: "recensione.html",
  title: "Lascia una recensione · Gabriel Tech",
  description: "Lascia una recensione a Gabriel Tech su Google.",
  noindex: true,
  body: () => `
<section class="page-hero wrap narrow">
  <span class="ico ico--yellow">${icon("star")}</span>
  <h1>Grazie per la fiducia!</h1>
  <p class="lead">Se ti sono stato utile, una recensione su Google mi aiuta tantissimo: bastano due righe.</p>
  <div class="cta-row">
    <a class="btn btn--primary btn--lg" data-google-reviews hidden>${icon("star")}Lascia una recensione su Google</a>
  </div>
  <p class="muted" data-google-reviews-missing>Il link alle recensioni arriverà presto. Intanto puoi scrivermi su WhatsApp cosa ne pensi.</p>
  <div class="cta-row">${waBtn("Ciao! Volevo dirti com'è andata l'assistenza: ", "Scrivimi su WhatsApp", "btn--ghost")}</div>
</section>`
});

page({
  path: "404.html",
  title: "Pagina non trovata · Gabriel Tech",
  description: "La pagina che cerchi non esiste o è stata spostata.",
  noindex: true,
  absolute: true,
  body: ({ home }) => `
<section class="nf wrap">
  <div>
    <p class="eyebrow">Errore 404</p>
    <h1>Questa pagina non c'è.</h1>
    <p class="lead">Forse il link è sbagliato o la pagina è stata spostata. Nessun problema: da qui ti rimetto in strada.</p>
    <div class="cta-row">
      <a class="btn btn--primary btn--lg" href="${home}">Torna alla home</a>
      <a class="btn btn--ghost btn--lg" href="${home}#servizi">Vedi i servizi</a>
    </div>
  </div>
  <div class="stage" data-3d-anchor data-tilt-zone>
    <div class="stage__fallback" aria-hidden="true"><svg class="stage__logo"><use href="#logo-mark"/></svg></div>
    <p class="stage__hint" aria-hidden="true">${icon("cursor")}Trascina la G per farla girare</p>
  </div>
</section>`
});

/* ==========================================================================
   PANNELLO DEL TECNICO (privato, non indicizzato)
   ========================================================================== */
paginePannello({ page, icon, esc });

/* ==========================================================================
   HOME (dal modello strumenti/modelli/home.html)
   ========================================================================== */
const GIORNI_LD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDINE_GIORNI = [1, 2, 3, 4, 5, 6, 0];
const fasceOrarie = new Map();
for (const d of ORDINE_GIORNI) {
  for (const [da, a] of CONFIG.hours?.[d] || []) {
    const chiave = `${da}|${a}`;
    if (!fasceOrarie.has(chiave)) fasceOrarie.set(chiave, []);
    fasceOrarie.get(chiave).push(GIORNI_LD[d]);
  }
}
const jsonldHome = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Gabriel Tech",
  description: "Assistenza informatica da remoto per privati e piccole attività.",
  url: "{{sito}}/",
  logo: "{{sito}}/assets/brand/icon-512.png",
  image: "{{sito}}/assets/brand/og-image.png",
  telephone: CONFIG.phoneLink,
  email: CONFIG.email,
  areaServed: { "@type": "Country", name: "Italia" },
  priceRange: "€€",
  openingHoursSpecification: [...fasceOrarie].map(([chiave, giorni]) => {
    const [opens, closes] = chiave.split("|");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: giorni, opens, closes };
  })
};
// Città e titolare, se sono già scritti in config.js: per Google un'attività con sede e persona reali
const sede = /^\s*([^[\]()]+?)\s*\((\w{2})\)\s*$/.exec(String(CONFIG.indirizzo || ""));
if (sede) jsonldHome.address = { "@type": "PostalAddress", addressLocality: sede[1], addressRegion: sede[2], addressCountry: "IT" };
if (CONFIG.titolare && !/^\[.*\]$/.test(String(CONFIG.titolare).trim())) {
  jsonldHome.founder = { "@type": "Person", name: String(CONFIG.titolare).trim() };
  if (FOTO) jsonldHome.founder.image = `{{sito}}${FOTO.grande}`;
}
PAGINE.unshift({
  path: "index.html",
  html: HOME
    .replace("<!-- NAV -->", nav("", "", "en/index.html"))
    .replace("<!-- FOOTER -->", footer("", ""))
    .replace("<!-- JSONLD -->", `<script type="application/ld+json">\n${JSON.stringify(jsonldHome, null, 2)}\n  </script>`),
  noindex: false,
  traduci: true,
  assoluta: false
});

/* ==========================================================================
   SEGNAPOSTO: prezzi e dati da config.js, formattati per ogni lingua
   ========================================================================== */
const localeDi = (lingua) => (lingua === "en" ? "en-GB" : "it-IT");
const formattaPrezzo = (valore, lingua) => {
  const n = Number(valore);
  return Number.isInteger(n) ? String(n) : new Intl.NumberFormat(localeDi(lingua), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
};
const NOMI_GIORNI = {
  it: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
const senzaZero = (t) => t.replace(/^0/, "");
function righeOrari(lingua) {
  return ORDINE_GIORNI.map((d) => {
    const fasce = CONFIG.hours?.[d] || [];
    const testo = fasce.length ? fasce.map(([a, b]) => `${senzaZero(a)}–${senzaZero(b)}`).join(" · ") : lingua === "en" ? "Closed" : "Chiuso";
    return `          <tr><th scope="row">${NOMI_GIORNI[lingua][d]}</th><td>${testo}</td></tr>`;
  }).join("\n");
}
// Orari in una riga, per l'assistente virtuale: "lunedì–venerdì 9:00–13:00 e 14:30–19:30; …"
function orariInBreve(lingua) {
  const gruppi = [];
  for (const d of ORDINE_GIORNI) {
    const fasce = JSON.stringify(CONFIG.hours?.[d] || []);
    const ultimo = gruppi.at(-1);
    if (ultimo && ultimo.fasce === fasce) ultimo.giorni.push(d);
    else gruppi.push({ fasce, giorni: [d] });
  }
  const nome = (d) => (lingua === "en" ? NOMI_GIORNI.en[d] : NOMI_GIORNI.it[d].toLowerCase());
  return gruppi.map(({ fasce, giorni }) => {
    const quando = giorni.length > 1 ? `${nome(giorni[0])}–${nome(giorni.at(-1))}` : nome(giorni[0]);
    const elenco = JSON.parse(fasce);
    const ore = elenco.length ? elenco.map(([a, b]) => `${senzaZero(a)}–${senzaZero(b)}`).join(lingua === "en" ? " and " : " e ") : lingua === "en" ? "closed" : "chiuso";
    return `${quando} ${ore}`;
  }).join("; ");
}
function valori(lingua) {
  const v = {
    sito: DOMINIO,
    anno: String(new Date().getFullYear()),
    mese: new Intl.DateTimeFormat(localeDi(lingua), { month: "long", year: "numeric" }).format(new Date()),
    "orari.righe": righeOrari(lingua)
  };
  const prezzi = CONFIG.prezzi || {};
  for (const [chiave, valore] of Object.entries(prezzi)) {
    v[`p.${chiave}`] = formattaPrezzo(valore, lingua);
    v[`pn.${chiave}`] = String(Number(valore));
  }
  v["p.pacchetto5ora"] = String(Math.round(Number(prezzi.pacchetto5) / 5));
  const campi = { titolare: CONFIG.titolare, piva: CONFIG.piva, indirizzo: CONFIG.indirizzo, anni: CONFIG.anniEsperienza, email: CONFIG.email, phoneDisplay: CONFIG.phoneDisplay, phoneLink: CONFIG.phoneLink, whatsapp: CONFIG.whatsapp };
  for (const [chiave, valore] of Object.entries(campi)) v[`cfg.${chiave}`] = esc(valore ?? "");

  // Nome, P.IVA e foto: finché mancano, il sito non mostra segnaposto tra parentesi
  const en = lingua === "en";
  const vero = (x) => x != null && String(x).trim() !== "" && !/^\[.*\]$/.test(String(x).trim());
  const nome = vero(CONFIG.titolare) ? String(CONFIG.titolare).trim() : "";
  const piva = vero(CONFIG.piva) ? String(CONFIG.piva).trim() : "";
  const anni = vero(CONFIG.anniEsperienza) ? String(CONFIG.anniEsperienza).trim() : "";
  v["cfg.nome"] = esc(nome);
  const riga = [nome, anni && (en ? `IT technician for ${anni} years` : `tecnico informatico da ${anni} anni`)].filter(Boolean).join(" · ")
    || (en ? "Your IT technician" : "Il tuo tecnico informatico");
  v["cfg.firmaRiga"] = esc(riga.charAt(0).toUpperCase() + riga.slice(1));
  v["cfg.intestazione"] = esc([nome || "Gabriel Tech", piva && `${en ? "VAT no." : "P.IVA"} ${piva}`].filter(Boolean).join(" · "));
  v["voce.piva"] = piva ? `<li>${icon("check")}${en ? "VAT no." : "P.IVA"} ${esc(piva)}</li>` : "";
  const alt = esc(nome ? (en ? `${nome}, your technician` : `${nome}, il tuo tecnico`) : (en ? "Your Gabriel Tech technician" : "Il tuo tecnico di Gabriel Tech"));
  const logo = (classe) => `<span class="foto foto--logo${classe}" aria-hidden="true"><svg><use href="#logo-mark"/></svg></span>`;
  v["foto.mini"] = FOTO ? `<img class="foto" src="${FOTO.piccola}" alt="${alt}" width="80" height="80" decoding="async">` : logo("");
  v["foto.grande"] = FOTO ? `<img class="foto" src="${FOTO.grande}" alt="${alt}" width="240" height="240" loading="lazy" decoding="async">` : logo(" foto--grande");
  v["foto.fab"] = FOTO ? `<img class="foto" src="${FOTO.piccola}" alt="" width="58" height="58" decoding="async"><span class="fab__wa">${icon("chat")}</span>` : icon("chat");
  return v;
}
const VALORI = { it: valori("it"), en: valori("en") };
const avvisi = new Set();
const riempi = (html, lingua, dove) => html.replace(/\{\{([\w.]+)\}\}/g, (segnaposto, chiave) => {
  if (VALORI[lingua][chiave] != null) return VALORI[lingua][chiave];
  avvisi.add(`${dove}: segnaposto sconosciuto ${segnaposto}`);
  return segnaposto;
});
const indirizzo = (path, lingua) => `${DOMINIO}/${lingua === "it" ? "" : `${lingua}/`}${path.replace(/index\.html$/, "")}`;
function finalizza(html, lingua, pagina) {
  const alternative = INGLESE && pagina.traduci && !pagina.noindex
    ? [`<link rel="alternate" hreflang="it" href="${indirizzo(pagina.path, "it")}">`,
       `<link rel="alternate" hreflang="en" href="${indirizzo(pagina.path, "en")}">`,
       `<link rel="alternate" hreflang="x-default" href="${indirizzo(pagina.path, "it")}">`].join("\n  ")
    : "";
  return riempi(html.replace("<!--HREFLANG-->", alternative), lingua, `${lingua}/${pagina.path}`).replace(/\n  \n<\/head>/, "\n</head>");
}
function scrivi(percorso, contenuto) {
  const file = join(SITO, percorso);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contenuto);
}

/* ==========================================================================
   SCRITTURA: italiano, inglese, sitemap, robots e dati per le funzioni
   ========================================================================== */
const traduttore = creaTraduttore(EN, { lingua: "en", invariati: INVARIATI });
rmSync(join(SITO, "en"), { recursive: true, force: true });
const sitemap = [];
for (const pagina of PAGINE) {
  scrivi(pagina.path, finalizza(pagina.html, "it", pagina));
  if (!pagina.noindex) sitemap.push(indirizzo(pagina.path, "it"));
  if (INGLESE && pagina.traduci) {
    const tradotta = traduttore.traduciPagina(pagina.html, pagina.path, { assoluta: pagina.assoluta });
    scrivi(`en/${pagina.path}`, finalizza(tradotta, "en", pagina));
    if (!pagina.noindex) sitemap.push(indirizzo(pagina.path, "en"));
  }
}

writeFileSync(join(SITO, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u}</loc><lastmod>${OGGI}</lastmod></url>`).join("\n")}
</urlset>
`);
writeFileSync(join(SITO, "robots.txt"), `User-agent: *
Disallow: /tecnico/
Disallow: /agent/

Sitemap: ${DOMINIO}/sitemap.xml
`);

// Dati per le funzioni di Netlify (assistente, messaggi automatici): sempre allineati a config.js
mkdirSync(join(RADICE, "netlify", "lib"), { recursive: true });
writeFileSync(join(RADICE, "netlify", "lib", "dati.mjs"), "// File creato da strumenti/genera-pagine.mjs con i dati di sito/assets/config.js: non modificarlo a mano.\nexport default " + JSON.stringify({
  sito: DOMINIO,
  telefono: CONFIG.phoneDisplay,
  whatsapp: CONFIG.whatsapp,
  email: CONFIG.email,
  titolare: CONFIG.titolare,
  prezzi: CONFIG.prezzi,
  prezziTesto: {
    it: Object.fromEntries(Object.keys(CONFIG.prezzi || {}).map((k) => [k, formattaPrezzo(CONFIG.prezzi[k], "it")])),
    en: Object.fromEntries(Object.keys(CONFIG.prezzi || {}).map((k) => [k, formattaPrezzo(CONFIG.prezzi[k], "en")]))
  },
  orari: { it: orariInBreve("it"), en: orariInBreve("en") },
  linkRecensioneGoogle: CONFIG.linkRecensioneGoogle || "",
  lingue: CONFIG.lingue || ["it"]
}, null, 2) + ";\n");

/* ---------- Resoconto ---------- */
const fileMancanti = join(QUI, "traduzioni", "mancanti-en.json");
if (INGLESE && traduttore.mancanti.size) {
  writeFileSync(fileMancanti, JSON.stringify(Object.fromEntries(traduttore.mancanti), null, 2) + "\n");
  console.warn(`Attenzione: ${traduttore.mancanti.size} testi non ancora tradotti in inglese (restano in italiano). Elenco in strumenti/traduzioni/mancanti-en.json`);
} else if (existsSync(fileMancanti)) {
  rmSync(fileMancanti);
}
for (const avviso of avvisi) console.warn(`Attenzione: ${avviso}`);
const inutilizzate = INGLESE ? traduttore.vociInutilizzate() : [];
if (inutilizzate.length) {
  console.log(`Nota: ${inutilizzate.length} voci del dizionario inglese non sono più usate (elenco con ELENCO_VOCI=1 npm run genera).`);
  if (process.env.ELENCO_VOCI) for (const voce of inutilizzate) console.log(`  - ${voce}`);
}
console.log(`Fatto: ${PAGINE.length} pagine${INGLESE ? ` in italiano e ${PAGINE.filter((p) => p.traduci).length} in inglese` : ""}, ${sitemap.length} indirizzi nella sitemap.`);
