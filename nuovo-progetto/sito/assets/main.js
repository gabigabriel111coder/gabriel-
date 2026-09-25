/* ==========================================================================
   Gabriel Tech · script del sito (italiano e inglese)
   I tuoi dati (numero, orari, prezzi, link…) si cambiano in assets/config.js
   ========================================================================== */
(() => {
  const C = window.CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const root = document.documentElement;
  const LANG = root.lang === "en" ? "en" : "it";
  const LOCALE = LANG === "en" ? "en-GB" : "it-IT";
  const BASE = document.currentScript ? new URL(".", document.currentScript.src).href : "assets/";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- Testi che il sito scrive da solo, nelle due lingue ---------- */
  const TESTI = {
    it: {
      temaChiaro: "Passa al tema chiaro", temaScuro: "Passa al tema scuro",
      menuApri: "Apri il menu", menuChiudi: "Chiudi il menu",
      waBase: "Ciao! Ho bisogno di assistenza informatica da remoto.",
      video: "Guarda il video · 30 secondi", videoTitolo: "Video di presentazione",
      disponibile: (fino) => `Disponibile ora · fino alle ${fino}`,
      torno: (quando, ora) => `Ora non disponibile · torno ${quando} alle ${ora}`,
      oggi: "oggi", domani: "domani",
      fuoriOrario: "Scrivimi su WhatsApp: ti rispondo appena possibile",
      chiuso: "Chiuso",
      sistemi: ["Windows", "Mac", "Android", "iPhone o iPad"],
      anydesk: (id) => `Ciao, sono pronto per l'assistenza! Il mio indirizzo AnyDesk è: ${id}`,
      dispositivi: { win: "PC Windows", mac: "Mac", android: "smartphone Android", ios: "iPhone o iPad" },
      problemi: {
        lento: "PC lento o bloccato", virus: "virus, pop-up o finti avvisi", windows: "Windows 11 e aggiornamenti",
        backup: "backup e foto", email: "email, PEC o Outlook", spid: "SPID, CIE e servizi online",
        stampante: "stampante o scanner", account: "account e password", altro: "un altro problema"
      },
      pacchetti: { rapido: ["Rapido", "fino a 30 minuti"], completo: ["Completo", "fino a 60 minuti"] },
      quiz: {
        risultato: "Risultato", consiglio: "Il mio consiglio",
        spentoTitolo: "Qui serve un tecnico sul posto",
        spentoTesto: "Se il dispositivo non si accende, di solito è un guasto hardware: da remoto non posso intervenire. Scrivimi lo stesso: ti dico gratis a chi rivolgerti.",
        spentoBottone: "Chiedimi un consiglio",
        spentoWa: (d) => `Ciao! Il mio ${d} non si accende. Mi consigli a chi rivolgermi?`,
        offlineTitolo: "Proviamo prima a voce",
        offlineTesto: (p) => `Senza internet non posso collegarmi, ma spesso il problema è proprio la connessione. Chiamami o scrivimi dal telefono e proviamo a sistemarla insieme: intervento Rapido, ${p}. Se non si risolve, non paghi.`,
        offlineWa: (d, n) => `Ciao! Il mio ${d} non va su internet (${n}). Possiamo provare a sistemarlo a voce?`,
        altroTitolo: "Raccontami il problema",
        altroTesto: "Descrivimelo su WhatsApp: ti rispondo con prezzo e tempi. Il preventivo è gratis e, se non si risolve da remoto, non paghi.",
        altroWa: (d) => `Ciao! Ho fatto la diagnosi sul sito (${d}). Il mio problema è: `,
        okTitolo: "Si risolve da remoto",
        okTesto: (n, pac, p, t) => `Per ${n} ti consiglio l'intervento ${pac}: ${p}, ${t}. Se non si risolve, non paghi.`,
        okIphone: " Su iPhone e iPad ti guido passo passo con la condivisione dello schermo.",
        okWa: (d, n, pac, p) => `Ciao! Ho fatto la diagnosi sul sito: ${d}, problema: ${n}. Il sito mi consiglia l'intervento ${pac} (${p}).`,
        whatsapp: "Scrivimi su WhatsApp", chiama: "Chiama", prenota: "Prenota", servizio: "Scopri il servizio"
      },
      oggiBreve: "Oggi", domaniBreve: "Domani", orari: (n) => `${n} orari`, primaGiorno: "Scegli prima un giorno.",
      problemaPrefisso: "Problema",
      ciao: "Ciao!", invio: "Invio in corso…", inviato: "Grazie! Ho ricevuto la richiesta: ti rispondo appena possibile.",
      continua: "Continua", nonInviato: "Non sono riuscito a inviare la richiesta.", waRiserva: "Mandamela su WhatsApp.",
      scegliOrario: "Scegli un giorno e un orario.",
      suggerimento: "Questa pagina è disponibile anche in italiano.", suggerimentoLink: "Leggi in italiano", chiudi: "Chiudi"
    },
    en: {
      temaChiaro: "Switch to light theme", temaScuro: "Switch to dark theme",
      menuApri: "Open the menu", menuChiudi: "Close the menu",
      waBase: "Hi! I need remote IT support.",
      video: "Watch the video · 30 seconds", videoTitolo: "Introduction video",
      disponibile: (fino) => `Available now · until ${fino}`,
      torno: (quando, ora) => `Not available now · back ${quando} at ${ora}`,
      oggi: "today", domani: "tomorrow",
      fuoriOrario: "Message me on WhatsApp: I'll reply as soon as possible",
      chiuso: "Closed",
      sistemi: ["Windows", "Mac", "Android", "iPhone or iPad"],
      anydesk: (id) => `Hi, I'm ready for the support session! My AnyDesk address is: ${id}`,
      dispositivi: { win: "Windows PC", mac: "Mac", android: "Android smartphone", ios: "iPhone or iPad" },
      problemi: {
        lento: "a slow or frozen PC", virus: "viruses, pop-ups or fake alerts", windows: "Windows 11 and updates",
        backup: "backups and photos", email: "email, PEC or Outlook", spid: "SPID, CIE and online services",
        stampante: "a printer or scanner", account: "accounts and passwords", altro: "another problem"
      },
      pacchetti: { rapido: ["Quick", "up to 30 minutes"], completo: ["Complete", "up to 60 minutes"] },
      quiz: {
        risultato: "Result", consiglio: "My advice",
        spentoTitolo: "This needs an on-site technician",
        spentoTesto: "If the device won't turn on, it's usually a hardware fault: I can't help remotely. Message me anyway: I'll tell you for free who to turn to.",
        spentoBottone: "Ask me for advice",
        spentoWa: (d) => `Hi! My ${d} won't turn on. Can you recommend who to contact?`,
        offlineTitolo: "Let's try by phone first",
        offlineTesto: (p) => `Without internet I can't connect, but often the connection itself is the problem. Call or message me from your phone and we'll try to fix it together: Quick session, ${p}. If it can't be fixed, you don't pay.`,
        offlineWa: (d, n) => `Hi! My ${d} won't connect to the internet (${n}). Can we try to fix it by phone?`,
        altroTitolo: "Tell me about the problem",
        altroTesto: "Describe it on WhatsApp: I'll reply with price and timing. The quote is free, and if it can't be fixed remotely, you don't pay.",
        altroWa: (d) => `Hi! I took the diagnosis on the website (${d}). My problem is: `,
        okTitolo: "It can be fixed remotely",
        okTesto: (n, pac, p, t) => `For ${n} I recommend the ${pac} session: ${p}, ${t}. If it can't be fixed, you don't pay.`,
        okIphone: " On iPhone and iPad I'll guide you step by step with screen sharing.",
        okWa: (d, n, pac, p) => `Hi! I took the diagnosis on the website: ${d}, problem: ${n}. It recommends the ${pac} session (${p}).`,
        whatsapp: "Message me on WhatsApp", chiama: "Call", prenota: "Book", servizio: "Learn about the service"
      },
      oggiBreve: "Today", domaniBreve: "Tomorrow", orari: (n) => `${n} times`, primaGiorno: "Choose a day first.",
      problemaPrefisso: "Problem",
      ciao: "Hi!", invio: "Sending…", inviato: "Thank you! I've received your request: I'll reply as soon as possible.",
      continua: "Continue", nonInviato: "I couldn't send your request.", waRiserva: "Send it to me on WhatsApp.",
      scegliOrario: "Choose a day and a time.",
      suggerimento: "This page is also available in English.", suggerimentoLink: "Read in English", chiudi: "Close"
    }
  };
  const T = TESTI[LANG];

  const waLink = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text || (LANG === "en" ? C.whatsappTextEn : C.whatsappText) || T.waBase)}`;
  const openWa = (text) => window.open(waLink(text), "_blank", "noopener");
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* navigazione privata */ } }
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  // Prezzi da config.js: "45 €" in italiano, "€45" in inglese
  const euro = (valore) => {
    const n = Number(valore);
    const numero = Number.isInteger(n) ? String(n) : new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
    return LANG === "en" ? `€${numero}` : `${numero} €`;
  };
  const PREZZI = C.prezzi || {};

  /* ---------- Ora italiana ---------- */
  const ROME = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
    weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });
  function romeNow() {
    const p = Object.fromEntries(ROME.formatToParts(new Date()).map((x) => [x.type, x.value]));
    return {
      y: +p.year, m: +p.month, d: +p.day,
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday),
      min: +p.hour * 60 + +p.minute,
      iso: `${p.year}-${p.month}-${p.day}`
    };
  }
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fromMin = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  const pretty = (t) => t.replace(/^0/, "");
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const hours = C.hours || {};
  // Nomi dei giorni nella lingua della pagina (1 gennaio 2023 era domenica)
  const nomeGiorno = (d) => new Intl.DateTimeFormat(LOCALE, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2023, 0, 1 + d)));

  /* ---------- Tema chiaro / scuro ---------- */
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  function syncTheme() {
    const dark = isDark();
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? T.temaChiaro : T.temaScuro);
    });
    let meta = $("meta[name='theme-color'][data-manual]");
    if (root.dataset.theme) {
      if (!meta) {
        meta = el("meta");
        meta.name = "theme-color";
        meta.dataset.manual = "";
        document.head.prepend(meta);
      }
      meta.content = dark ? "#050507" : "#f5f5f7";
    }
  }
  $$("[data-theme-toggle]").forEach((btn) => btn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    store.set("gt-theme", root.dataset.theme);
    syncTheme();
  }));
  syncTheme();

  /* ---------- Contatti ---------- */
  $$("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-phone]").forEach((a) => { a.textContent = C.phoneDisplay; if (a.tagName === "A") a.href = `tel:${C.phoneLink}`; });
  $$("[data-call]").forEach((a) => { a.href = `tel:${C.phoneLink}`; });
  $$("[data-email]").forEach((a) => { a.textContent = C.email; if (a.tagName === "A") a.href = `mailto:${C.email}`; });
  $$("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
  $$("[data-lang-field]").forEach((input) => { input.value = LANG; });

  /* ---------- Parti che compaiono solo se configurate in config.js ---------- */
  const pay = C.pagamenti || {};
  $$("[data-pay]").forEach((a) => {
    const url = pay[a.dataset.pay];
    if (!url) return;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.hidden = false;
  });
  $$("[data-pay-fallback]").forEach((node) => { if (pay[node.dataset.payFallback]) node.hidden = true; });
  $$("[data-channel]").forEach((a) => {
    if (!C.canaleWhatsApp) return;
    a.href = C.canaleWhatsApp;
    a.target = "_blank";
    a.rel = "noopener";
    a.hidden = false;
  });
  // "Porta un amico": apre WhatsApp per scegliere a chi mandare il consiglio
  $$("[data-share]").forEach((a) => {
    const sito = (C.sito && !/example\.com/.test(C.sito)) ? `${C.sito}${LANG === "en" ? "/en/" : "/"}` : location.origin + (LANG === "en" ? "/en/" : "/");
    a.href = `https://wa.me/?text=${encodeURIComponent(a.dataset.share.replace("{sito}", sito))}`;
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-google-reviews]").forEach((a) => {
    if (!C.linkRecensioneGoogle) return;
    a.href = C.linkRecensioneGoogle;
    a.hidden = false;
  });
  $$("[data-google-reviews-missing]").forEach((node) => { node.hidden = !!C.linkRecensioneGoogle; });

  // offerta del periodo
  const offer = $("[data-offer]");
  if (offer && Array.isArray(C.offerte)) {
    const today = romeNow().iso;
    const current = C.offerte.find((o) => o && o.dal <= today && today <= o.al && (LANG === "it" || o.testoEn));
    if (current) {
      $("[data-offer-text]", offer).textContent = LANG === "en" ? current.testoEn : current.testo;
      offer.href = current.link || "#contatti";
      offer.hidden = false;
    }
  }

  // recensioni
  const reviews = $("[data-reviews]");
  if (reviews && Array.isArray(C.recensioni) && C.recensioni.length) {
    const list = $("[data-reviews-list]", reviews);
    C.recensioni.forEach((r) => {
      const card = el("figure", "review glass");
      card.append(el("p", "review__stars", "★★★★★".slice(0, Math.max(1, Math.min(5, r.stelle || 5)))));
      card.append(el("blockquote", "", r.testo));
      const who = el("figcaption", "", [r.nome, r.luogo].filter(Boolean).join(", "));
      if (r.problema) who.append(el("span", "review__tag", r.problema));
      card.append(who);
      list.append(card);
    });
    reviews.hidden = false;
  }

  // video di presentazione
  const videoBox = $("[data-video]");
  if (videoBox && C.video) {
    const yt = C.video.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    if (yt) {
      const play = el("button", "video-facade");
      play.type = "button";
      play.innerHTML = '<svg class="i"><use href="#i-play"/></svg>';
      play.append(el("span", "", T.video));
      play.addEventListener("click", () => {
        const frame = el("iframe");
        frame.src = `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
        frame.title = T.videoTitolo;
        frame.allow = "autoplay; encrypted-media; picture-in-picture";
        frame.allowFullscreen = true;
        videoBox.replaceChildren(frame);
      });
      videoBox.append(play);
    } else {
      const video = el("video");
      video.src = /^(https?:)?\//.test(C.video) ? C.video : BASE.replace(/assets\/$/, "") + C.video;
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;
      videoBox.append(video);
    }
    videoBox.hidden = false;
  }

  /* ---------- Disponibilità in tempo reale ---------- */
  function availability() {
    const { day, min } = romeNow();
    const slot = (hours[day] || []).find(([from, to]) => min >= toMin(from) && min < toMin(to));
    if (slot) return { open: true, text: T.disponibile(pretty(slot[1])) };
    for (let i = 0; i <= 7; i++) {
      const d = (day + i) % 7;
      const next = (hours[d] || []).find(([from]) => i > 0 || toMin(from) > min);
      if (next) {
        const when = i === 0 ? T.oggi : i === 1 ? T.domani : (LANG === "en" ? cap(nomeGiorno(d)) : nomeGiorno(d));
        return { open: false, text: T.torno(when, pretty(next[0])) };
      }
    }
    return { open: false, text: T.fuoriOrario };
  }
  function renderStatus() {
    const s = availability();
    $$("[data-status]").forEach((node) => {
      node.classList.toggle("is-open", s.open);
      node.classList.toggle("is-closed", !s.open);
      $("[data-status-text]", node).textContent = s.text;
    });
  }
  renderStatus();
  setInterval(renderStatus, 60 * 1000);

  const hoursBody = $("[data-hours] tbody");
  if (hoursBody) {
    const { day } = romeNow();
    hoursBody.replaceChildren(...[1, 2, 3, 4, 5, 6, 0].map((d) => {
      const tr = el("tr", d === day ? "today" : "");
      const th = el("th", "", cap(nomeGiorno(d)));
      th.scope = "row";
      const slots = hours[d] || [];
      tr.append(th, el("td", "", slots.length ? slots.map(([a, b]) => `${pretty(a)}–${pretty(b)}`).join(" · ") : T.chiuso));
      return tr;
    }));
  }

  /* ---------- Menu su telefono ---------- */
  const nav = $("[data-nav]");
  const menuBtn = $("[data-menu]");
  if (nav && menuBtn) {
    const setMenu = (open) => {
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? T.menuChiudi : T.menuApri);
    };
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Suggerimento della lingua ---------- */
  const switchLink = $("[data-lang-switch]");
  const preferita = (navigator.languages?.[0] || navigator.language || "").slice(0, 2).toLowerCase();
  if (switchLink && preferita && !store.get("gt-lang-hint") && (LANG === "it" ? preferita !== "it" : preferita === "it")) {
    const altra = TESTI[LANG === "it" ? "en" : "it"];
    const hint = el("div", "lang-hint glass");
    hint.setAttribute("role", "region");
    hint.setAttribute("aria-label", altra.suggerimentoLink);
    hint.lang = LANG === "it" ? "en" : "it";
    const link = el("a", "btn btn--primary btn--xs", altra.suggerimentoLink);
    link.href = switchLink.getAttribute("href");
    const close = el("button", "lang-hint__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", altra.chiudi);
    const chiudi = () => { store.set("gt-lang-hint", "1"); hint.remove(); };
    close.addEventListener("click", chiudi);
    link.addEventListener("click", () => store.set("gt-lang-hint", "1"));
    hint.append(el("p", "", altra.suggerimento), link, close);
    document.body.append(hint);
  }

  /* ---------- Schede (prezzi, sistemi operativi…) ---------- */
  const tabGroups = new Map();
  $$("[data-tabs]").forEach((group) => {
    const tabs = $$("[role=tab]", group);
    group.style.setProperty("--n", tabs.length);
    const select = (i, focus = false) => {
      tabs.forEach((tab, j) => {
        tab.setAttribute("aria-selected", String(i === j));
        tab.tabIndex = i === j ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = i !== j;
      });
      group.style.setProperty("--i", i);
      if (focus) tabs[i].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (step) select((i + step + tabs.length) % tabs.length, true);
      });
    });
    tabGroups.set(group, select);
  });

  /* ---------- Pagina "Collegati": sceglie da solo il sistema giusto ---------- */
  const osGroup = $("[data-os-tabs]");
  if (osGroup && tabGroups.has(osGroup)) {
    const ua = navigator.userAgent;
    const platform = navigator.userAgentData?.platform || navigator.platform || "";
    let os = 0;
    if (/iPhone|iPad|iPod/.test(ua) || (/Mac/.test(platform) && navigator.maxTouchPoints > 1)) os = 3;
    else if (/Android/.test(ua)) os = 2;
    else if (/Mac/.test(platform) || /Mac OS X/.test(ua)) os = 1;
    tabGroups.get(osGroup)(os);
    const label = $("[data-os-detected]");
    if (label) label.textContent = T.sistemi[os];
  }
  const anydeskForm = $("[data-anydesk-id]");
  anydeskForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = anydeskForm.elements.id.value.trim();
    if (!id) { anydeskForm.elements.id.focus(); return; }
    openWa(T.anydesk(id));
  });

  /* ---------- Diagnosi in 3 domande ---------- */
  const quiz = $("[data-quiz]");
  if (quiz) {
    const PAGINE = {
      lento: ["completo", "servizi/pc-lento.html"], virus: ["completo", "servizi/virus.html"], windows: ["completo", "servizi/windows-11.html"],
      backup: ["completo", "servizi/backup-foto.html"], email: ["rapido", "servizi/email-pec.html"], spid: ["rapido", "servizi/spid-cie.html"],
      stampante: ["rapido", "servizi/stampanti.html"], account: ["rapido", "servizi/account-password.html"], altro: ["", ""]
    };
    const Q = T.quiz;
    const steps = $$(".quiz__q", quiz);
    const result = $("[data-quiz-result]", quiz);
    const back = $("[data-quiz-back]", quiz);
    const restart = $("[data-quiz-restart]", quiz);
    const bar = $(".quiz__bar span", quiz);
    let current = 0;
    const answer = (name) => quiz.querySelector(`input[name="${name}"]:checked`);
    const show = (i) => {
      current = i;
      steps.forEach((q, j) => { q.hidden = j !== i; });
      result.hidden = i < steps.length;
      back.hidden = i === 0 || i >= steps.length;
      restart.hidden = i < steps.length;
      bar.style.width = `${(Math.min(i, steps.length) / steps.length) * 100}%`;
    };
    const button = (text, cls, href, wa) => {
      const a = el("a", `btn ${cls}`, text);
      if (wa != null) { a.href = waLink(wa); a.target = "_blank"; a.rel = "noopener"; } else a.href = href;
      return a;
    };
    function finish() {
      const deviceKey = answer("dispositivo").value;
      const device = T.dispositivi[deviceKey] || deviceKey;
      const key = answer("problema").value;
      const state = answer("stato").value;
      const nome = T.problemi[key];
      const [pacchettoKey, pagina] = PAGINE[key];
      const box = el("div", "quiz__card");
      const actions = el("div", "cta-row cta-row--tight");
      let title, text;
      if (state === "spento") {
        title = Q.spentoTitolo;
        text = Q.spentoTesto;
        actions.append(button(Q.spentoBottone, "btn--wa", null, Q.spentoWa(device)));
      } else if (state === "offline") {
        title = Q.offlineTitolo;
        text = Q.offlineTesto(euro(PREZZI.rapido));
        actions.append(button(Q.whatsapp, "btn--wa", null, Q.offlineWa(device, nome)));
        const call = el("a", "btn btn--ghost", Q.chiama);
        call.href = `tel:${C.phoneLink}`;
        actions.append(call);
      } else if (!pacchettoKey) {
        title = Q.altroTitolo;
        text = Q.altroTesto;
        actions.append(button(Q.whatsapp, "btn--wa", null, Q.altroWa(device)));
      } else {
        const [pacchetto, tempo] = T.pacchetti[pacchettoKey];
        const prezzo = euro(PREZZI[pacchettoKey]);
        title = Q.okTitolo;
        text = Q.okTesto(nome, pacchetto, prezzo, tempo);
        if (deviceKey === "ios") text += Q.okIphone;
        actions.append(button(Q.whatsapp, "btn--wa", null, Q.okWa(device, nome, pacchetto, prezzo)));
        actions.append(button(Q.prenota, "btn--primary", `prenota.html?servizio=${pacchettoKey}&problema=${encodeURIComponent(nome)}`));
        actions.append(button(Q.servizio, "btn--ghost", pagina));
      }
      box.append(el("p", "quiz__kicker", state === "ok" && pacchettoKey ? Q.risultato : Q.consiglio), el("h3", "", title), el("p", "", text), actions);
      result.replaceChildren(box);
      show(steps.length);
      result.focus({ preventScroll: true });
    }
    quiz.addEventListener("change", (e) => {
      if (e.target.type !== "radio") return;
      setTimeout(() => (current < steps.length - 1 ? show(current + 1) : finish()), 220);
    });
    back.addEventListener("click", () => show(Math.max(0, current - 1)));
    restart.addEventListener("click", () => {
      $$("input", quiz).forEach((input) => { input.checked = false; });
      show(0);
    });
    show(0);
  }

  /* ---------- Prenotazione ---------- */
  const bookingForm = $("form[data-booking]");
  if (bookingForm) {
    const external = $("[data-booking-external]");
    if (C.prenotazioneEsterna && external) {
      external.hidden = false;
      $("[data-booking-internal]").hidden = true;
      $$("[data-booking-link]").forEach((a) => { a.href = C.prenotazioneEsterna; });
      $("[data-load-booking]")?.addEventListener("click", (e) => {
        const frame = el("iframe");
        frame.src = C.prenotazioneEsterna;
        frame.title = e.currentTarget.textContent.trim();
        $("[data-booking-frame]").replaceChildren(frame);
        e.currentTarget.hidden = true;
      });
    }

    const daysBox = $("[data-days]", bookingForm);
    const slotsBox = $("[data-slots]", bookingForm);
    const now = romeNow();
    const shortFmt = new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    const longFmt = new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
    const days = [];
    for (let k = 0; k < 21 && days.length < 8; k++) {
      const date = new Date(Date.UTC(now.y, now.m - 1, now.d + k));
      const times = [];
      for (const [from, to] of hours[date.getUTCDay()] || []) {
        for (let t = toMin(from); t + 30 <= toMin(to); t += 30) if (k > 0 || t >= now.min + 60) times.push(fromMin(t));
      }
      if (times.length) {
        days.push({
          label: k === 0 ? T.oggiBreve : k === 1 ? T.domaniBreve : shortFmt.format(date),
          long: longFmt.format(date),
          iso: date.toISOString().slice(0, 10),
          times
        });
      }
    }
    const choose = (box, btn) => $$("[role=radio]", box).forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
    const renderSlots = (d) => {
      slotsBox.replaceChildren(...d.times.map((t) => {
        const b = el("button", "pick", t);
        b.type = "button";
        b.setAttribute("role", "radio");
        b.setAttribute("aria-checked", "false");
        b.addEventListener("click", () => { choose(slotsBox, b); bookingForm.elements.orario.value = t; });
        return b;
      }));
    };
    daysBox.replaceChildren(...days.map((d) => {
      const b = el("button", "pick pick--day");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      b.append(el("b", "", d.label), el("span", "", T.orari(d.times.length)));
      b.addEventListener("click", () => {
        choose(daysBox, b);
        bookingForm.elements.giorno.value = d.long;
        if (bookingForm.elements.data) bookingForm.elements.data.value = d.iso;
        bookingForm.elements.orario.value = "";
        renderSlots(d);
      });
      return b;
    }));
    bookingForm.addEventListener("reset", () => setTimeout(() => {
      choose(daysBox, null);
      slotsBox.replaceChildren(el("p", "muted", T.primaGiorno));
      $$("[data-lang-field]", bookingForm).forEach((input) => { input.value = LANG; });
    }));

    const params = new URLSearchParams(location.search);
    const wanted = (params.get("servizio") || "").toLowerCase();
    if (wanted) {
      const option = [...bookingForm.elements.servizio.options].find((o) => o.dataset.servizio === wanted)
        || [...bookingForm.elements.servizio.options].find((o) => o.text.toLowerCase().includes(wanted));
      if (option) option.selected = true;
    }
    if (params.get("problema")) bookingForm.elements.messaggio.value = `${T.problemaPrefisso}: ${params.get("problema")}`;
  }

  /* ---------- Moduli (Netlify Forms, con WhatsApp come riserva) ---------- */
  const bookingDays = $("[data-days]");
  $$("form[data-form]").forEach((form) => {
    const status = $("[data-form-status]", form);
    const submit = $("[type=submit]", form);
    const SKIP = ["form-name", "bot-field", "privacy", "condizioni", "lingua", "data", "aggiornamenti"];
    const summary = () => {
      const lines = [form.dataset.waIntro || T.ciao];
      for (const [key, value] of new FormData(form)) {
        if (!value || SKIP.includes(key)) continue;
        const field = form.elements.namedItem(key);
        const label = field?.dataset?.label || field?.labels?.[0]?.firstChild?.textContent?.trim() || key;
        lines.push(`${label}: ${value}`);
      }
      return lines.join("\n");
    };
    const say = (text, kind, extra) => {
      status.className = `form__status ${kind}`;
      status.textContent = text;
      if (extra) status.append(" ", extra);
    };
    const waFallback = () => {
      const a = el("a", "", T.waRiserva);
      a.href = waLink(summary());
      a.target = "_blank";
      a.rel = "noopener";
      return a;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.matches("[data-booking]") && !form.elements.orario.value) {
        say(T.scegliOrario, "err");
        bookingDays?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        return;
      }
      submit.disabled = true;
      say(T.invio, "");
      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        let link = null;
        if (form.dataset.successLink) {
          link = el("a", "", form.dataset.successLinkText || T.continua);
          link.href = form.dataset.successLink;
        }
        say(form.dataset.success || T.inviato, "ok", link);
      } catch {
        say(T.nonInviato, "err", waFallback());
      } finally {
        submit.disabled = false;
      }
    });
    $("[data-form-wa]", form)?.addEventListener("click", () => openWa(summary()));
  });

  /* ---------- Come funziona: il Mac segue i passi mentre scorri ---------- */
  const story = $("[data-story]");
  if (story) {
    const steps = $$(".story__step", story);
    const activate = (n) => {
      story.dataset.active = n;
      steps.forEach((s) => s.classList.toggle("is-active", s.dataset.step === n));
    };
    activate("1");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) activate(entry.target.dataset.step);
      }), { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach((s) => io.observe(s));
    }
  }

  /* ---------- Comparsa morbida degli elementi ---------- */
  $$(".bento, .trust, .plans, .rules, .cards, .guides, .reviews__list").forEach((group) => {
    $$(".reveal", group).forEach((node, i) => node.style.setProperty("--d", `${(i % 4) * 70}ms`));
  });
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((node) => node.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }), { rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((node) => io.observe(node));
  }

  /* ---------- Effetti 3D con il mouse ----------
     Il mouse può mandare anche 120 eventi al secondo: ogni effetto si aggiorna
     al massimo una volta per fotogramma. */
  const unaVoltaPerFotogramma = (fn) => {
    let ultimo = null;
    return (e) => {
      if (!ultimo) requestAnimationFrame(() => { fn(ultimo); ultimo = null; });
      ultimo = e;
    };
  };
  if (!reduceMotion && finePointer) {
    document.addEventListener("pointermove", unaVoltaPerFotogramma((e) => {
      const glass = e.target.closest?.(".glass");
      if (!glass) return;
      const r = glass.getBoundingClientRect();
      glass.style.setProperty("--mx", `${e.clientX - r.left}px`);
      glass.style.setProperty("--my", `${e.clientY - r.top}px`);
    }), { passive: true });

    // hero e Mac reagiscono al mouse: --nx e --ny vanno da -0.5 a 0.5
    const norm = (v) => Math.max(-0.7, Math.min(0.7, v)).toFixed(3);
    $$("[data-tilt-zone]").forEach((zone) => {
      const area = zone.closest("section") || zone;
      area.addEventListener("pointermove", unaVoltaPerFotogramma((e) => {
        const r = zone.getBoundingClientRect();
        zone.style.setProperty("--nx", norm((e.clientX - r.left) / r.width - 0.5));
        zone.style.setProperty("--ny", norm((e.clientY - r.top) / r.height - 0.5));
      }), { passive: true });
      area.addEventListener("pointerleave", () => {
        zone.style.setProperty("--nx", "0");
        zone.style.setProperty("--ny", "0");
      });
    });

    $$("[data-tilt]").forEach((card) => {
      let dentro = false;
      card.addEventListener("pointerenter", () => { dentro = true; });
      card.addEventListener("pointermove", unaVoltaPerFotogramma((e) => {
        if (!dentro) return; // il mouse è già uscito prima di questo fotogramma
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      }), { passive: true });
      card.addEventListener("pointerleave", () => { dentro = false; card.style.transform = ""; });
    });
  }

  /* ---------- Caricamenti opzionali ---------- */
  // statistiche senza cookie (Cloudflare Web Analytics)
  if (C.cloudflareAnalytics) {
    const s = el("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.dataset.cfBeacon = JSON.stringify({ token: C.cloudflareAnalytics });
    document.head.append(s);
  }
  // assistente virtuale
  if (C.assistente && !document.body.hasAttribute("data-no-assistant")) {
    const s = el("script");
    s.src = `${BASE}assistente.js`;
    s.defer = true;
    document.body.append(s);
  }
  // scena 3D: solo se il dispositivo la supporta
  const webgl2 = (() => {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      return !!gl;
    } catch {
      return false;
    }
  })();
  // niente 3D sui telefoni con poca memoria (meno di 4 GB): resta il logo, e lo scorrimento è fluido
  const pocaMemoria = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  if (!reduceMotion && webgl2 && !pocaMemoria && !navigator.connection?.saveData && !document.body.hasAttribute("data-no-3d")) {
    const load = () => import("./scene3d.js")
      .then((scene) => scene.start())
      .catch((err) => console.warn("Scena 3D non disponibile, resta il logo statico.", err));
    if (document.readyState === "complete") load();
    else addEventListener("load", load, { once: true });
  }
})();
