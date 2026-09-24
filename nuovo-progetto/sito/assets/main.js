/* ==========================================================================
   Gabriel Tech · script del sito
   I tuoi dati (numero, orari, link…) si cambiano in assets/config.js
   ========================================================================== */
(() => {
  const C = window.CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const root = document.documentElement;
  const BASE = document.currentScript ? new URL(".", document.currentScript.src).href : "assets/";
  const DAYS = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const waLink = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text || C.whatsappText || "")}`;
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

  /* ---------- Tema chiaro / scuro ---------- */
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  function syncTheme() {
    const dark = isDark();
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Passa al tema chiaro" : "Passa al tema scuro");
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
  $$("[data-phone]").forEach((a) => { a.textContent = C.phoneDisplay; a.href = `tel:${C.phoneLink}`; });
  $$("[data-call]").forEach((a) => { a.href = `tel:${C.phoneLink}`; });
  $$("[data-email]").forEach((a) => { a.textContent = C.email; a.href = `mailto:${C.email}`; });
  $$("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

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
    a.href = `https://wa.me/?text=${encodeURIComponent(a.dataset.share.replace("{sito}", C.sito || location.origin))}`;
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
    const current = C.offerte.find((o) => o && o.dal <= today && today <= o.al);
    if (current) {
      $("[data-offer-text]", offer).textContent = current.testo;
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
      play.append(el("span", "", "Guarda il video · 30 secondi"));
      play.addEventListener("click", () => {
        const frame = el("iframe");
        frame.src = `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
        frame.title = "Video di presentazione";
        frame.allow = "autoplay; encrypted-media; picture-in-picture";
        frame.allowFullscreen = true;
        videoBox.replaceChildren(frame);
      });
      videoBox.append(play);
    } else {
      const video = el("video");
      video.src = C.video;
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
    if (slot) return { open: true, text: `Disponibile ora · fino alle ${pretty(slot[1])}` };
    for (let i = 0; i <= 7; i++) {
      const d = (day + i) % 7;
      const next = (hours[d] || []).find(([from]) => i > 0 || toMin(from) > min);
      if (next) {
        const when = i === 0 ? "oggi" : i === 1 ? "domani" : DAYS[d];
        return { open: false, text: `Ora non disponibile · torno ${when} alle ${pretty(next[0])}` };
      }
    }
    return { open: false, text: "Scrivimi su WhatsApp: ti rispondo appena possibile" };
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
      const th = el("th", "", cap(DAYS[d]));
      th.scope = "row";
      const slots = hours[d] || [];
      tr.append(th, el("td", "", slots.length ? slots.map(([a, b]) => `${pretty(a)}–${pretty(b)}`).join(" · ") : "Chiuso"));
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
      menuBtn.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    };
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
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
    if (label) label.textContent = ["Windows", "Mac", "Android", "iPhone o iPad"][os];
  }
  const anydeskForm = $("[data-anydesk-id]");
  anydeskForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = anydeskForm.elements.id.value.trim();
    if (!id) { anydeskForm.elements.id.focus(); return; }
    openWa(`Ciao, sono pronto per l'assistenza! Il mio indirizzo AnyDesk è: ${id}`);
  });

  /* ---------- Diagnosi in 3 domande ---------- */
  const quiz = $("[data-quiz]");
  if (quiz) {
    const PROBLEMI = {
      lento: ["PC lento o bloccato", "Completo", "servizi/pc-lento.html"],
      virus: ["virus, pop-up o finti avvisi", "Completo", "servizi/virus.html"],
      windows: ["Windows 11 e aggiornamenti", "Completo", "servizi/windows-11.html"],
      backup: ["backup e foto", "Completo", "servizi/backup-foto.html"],
      email: ["email, PEC o Outlook", "Rapido", "servizi/email-pec.html"],
      spid: ["SPID, CIE e servizi online", "Rapido", "servizi/spid-cie.html"],
      stampante: ["stampante o scanner", "Rapido", "servizi/stampanti.html"],
      account: ["account e password", "Rapido", "servizi/account-password.html"],
      altro: ["un altro problema", "", ""]
    };
    const PACCHETTI = { Rapido: ["25 €", "fino a 30 minuti"], Completo: ["45 €", "fino a 60 minuti"] };
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
      const device = answer("dispositivo").value;
      const key = answer("problema").value;
      const state = answer("stato").value;
      const [nome, pacchetto, pagina] = PROBLEMI[key];
      const box = el("div", "quiz__card");
      const actions = el("div", "cta-row cta-row--tight");
      let title, text;
      if (state === "spento") {
        title = "Qui serve un tecnico sul posto";
        text = "Se il dispositivo non si accende, di solito è un guasto hardware: da remoto non posso intervenire. Scrivimi lo stesso: ti dico gratis a chi rivolgerti.";
        actions.append(button("Chiedimi un consiglio", "btn--wa", null, `Ciao! Il mio ${device} non si accende. Mi consigli a chi rivolgermi?`));
      } else if (state === "offline") {
        title = "Proviamo prima a voce";
        text = "Senza internet non posso collegarmi, ma spesso il problema è proprio la connessione. Chiamami o scrivimi dal telefono e proviamo a sistemarla insieme: intervento Rapido, 25 €. Se non si risolve, non paghi.";
        actions.append(button("Scrivimi su WhatsApp", "btn--wa", null, `Ciao! Il mio ${device} non va su internet (${nome}). Possiamo provare a sistemarlo a voce?`));
        const call = el("a", "btn btn--ghost", "Chiama");
        call.href = `tel:${C.phoneLink}`;
        actions.append(call);
      } else if (!pacchetto) {
        title = "Raccontami il problema";
        text = "Descrivimelo su WhatsApp: ti rispondo con prezzo e tempi. Il preventivo è gratis e, se non si risolve da remoto, non paghi.";
        actions.append(button("Scrivimi su WhatsApp", "btn--wa", null, `Ciao! Ho fatto la diagnosi sul sito (${device}). Il mio problema è: `));
      } else {
        const [prezzo, tempo] = PACCHETTI[pacchetto];
        title = "Si risolve da remoto";
        text = `Per ${nome} ti consiglio l'intervento ${pacchetto}: ${prezzo}, ${tempo}. Se non si risolve, non paghi.`;
        if (/iPhone/.test(device)) text += " Su iPhone e iPad ti guido passo passo con la condivisione dello schermo.";
        actions.append(button("Scrivimi su WhatsApp", "btn--wa", null, `Ciao! Ho fatto la diagnosi sul sito: ${device}, problema: ${nome}. Mi consiglia l'intervento ${pacchetto} (${prezzo}).`));
        actions.append(button("Prenota", "btn--primary", `prenota.html?servizio=${pacchetto}&problema=${encodeURIComponent(nome)}`));
        actions.append(button("Scopri il servizio", "btn--ghost", pagina));
      }
      box.append(el("p", "quiz__kicker", state === "ok" && pacchetto ? "Risultato" : "Il mio consiglio"), el("h3", "", title), el("p", "", text), actions);
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
        frame.title = "Calendario delle prenotazioni";
        $("[data-booking-frame]").replaceChildren(frame);
        e.currentTarget.hidden = true;
      });
    }

    const daysBox = $("[data-days]", bookingForm);
    const slotsBox = $("[data-slots]", bookingForm);
    const now = romeNow();
    const shortFmt = new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    const longFmt = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
    const days = [];
    for (let k = 0; k < 21 && days.length < 8; k++) {
      const date = new Date(Date.UTC(now.y, now.m - 1, now.d + k));
      const times = [];
      for (const [from, to] of hours[date.getUTCDay()] || []) {
        for (let t = toMin(from); t + 30 <= toMin(to); t += 30) if (k > 0 || t >= now.min + 60) times.push(fromMin(t));
      }
      if (times.length) days.push({ label: k === 0 ? "Oggi" : k === 1 ? "Domani" : shortFmt.format(date), long: longFmt.format(date), times });
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
      b.append(el("b", "", d.label), el("span", "", `${d.times.length} orari`));
      b.addEventListener("click", () => {
        choose(daysBox, b);
        bookingForm.elements.giorno.value = d.long;
        bookingForm.elements.orario.value = "";
        renderSlots(d);
      });
      return b;
    }));
    bookingForm.addEventListener("reset", () => setTimeout(() => {
      choose(daysBox, null);
      slotsBox.replaceChildren(el("p", "muted", "Scegli prima un giorno."));
    }));

    const params = new URLSearchParams(location.search);
    const wanted = params.get("servizio");
    if (wanted) {
      const option = [...bookingForm.elements.servizio.options].find((o) => o.text.toLowerCase().includes(wanted.toLowerCase()));
      if (option) option.selected = true;
    }
    if (params.get("problema")) bookingForm.elements.messaggio.value = `Problema: ${params.get("problema")}`;
  }

  /* ---------- Moduli (Netlify Forms, con WhatsApp come riserva) ---------- */
  const bookingDays = $("[data-days]");
  $$("form[data-form]").forEach((form) => {
    const status = $("[data-form-status]", form);
    const submit = $("[type=submit]", form);
    const SKIP = ["form-name", "bot-field", "privacy", "condizioni"];
    const summary = () => {
      const lines = [form.dataset.waIntro || "Ciao!"];
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
      const a = el("a", "", "Mandamela su WhatsApp.");
      a.href = waLink(summary());
      a.target = "_blank";
      a.rel = "noopener";
      return a;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.matches("[data-booking]") && !form.elements.orario.value) {
        say("Scegli un giorno e un orario.", "err");
        bookingDays?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        return;
      }
      submit.disabled = true;
      say("Invio in corso…", "");
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
          link = el("a", "", form.dataset.successLinkText || "Continua");
          link.href = form.dataset.successLink;
        }
        say(form.dataset.success || "Grazie! Ho ricevuto la richiesta: ti rispondo appena possibile.", "ok", link);
      } catch {
        say("Non sono riuscito a inviare la richiesta.", "err", waFallback());
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

  /* ---------- Effetti 3D con il mouse ---------- */
  if (!reduceMotion && finePointer) {
    document.addEventListener("pointermove", (e) => {
      const glass = e.target.closest?.(".glass");
      if (!glass) return;
      const r = glass.getBoundingClientRect();
      glass.style.setProperty("--mx", `${e.clientX - r.left}px`);
      glass.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });

    // hero e Mac reagiscono al mouse: --nx e --ny vanno da -0.5 a 0.5
    const norm = (v) => Math.max(-0.7, Math.min(0.7, v)).toFixed(3);
    $$("[data-tilt-zone]").forEach((zone) => {
      const area = zone.closest("section") || zone;
      area.addEventListener("pointermove", (e) => {
        const r = zone.getBoundingClientRect();
        zone.style.setProperty("--nx", norm((e.clientX - r.left) / r.width - 0.5));
        zone.style.setProperty("--ny", norm((e.clientY - r.top) / r.height - 0.5));
      });
      area.addEventListener("pointerleave", () => {
        zone.style.setProperty("--nx", "0");
        zone.style.setProperty("--ny", "0");
      });
    });

    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
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
  if (!reduceMotion && webgl2 && !navigator.connection?.saveData && !document.body.hasAttribute("data-no-3d")) {
    const load = () => import("./scene3d.js")
      .then((scene) => scene.start())
      .catch((err) => console.warn("Scena 3D non disponibile, resta il logo statico.", err));
    if (document.readyState === "complete") load();
    else addEventListener("load", load, { once: true });
  }
})();
