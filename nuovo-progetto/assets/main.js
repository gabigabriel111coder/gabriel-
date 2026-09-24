/* ==========================================================================
   IMPOSTAZIONI: modifica solo questa parte con i tuoi dati.
   Numero, WhatsApp, email e orari vengono aggiornati in tutto il sito.
   ========================================================================== */
const CONFIG = {
  phoneDisplay: "+39 000 000 0000", // come appare sul sito
  phoneLink: "+390000000000",       // per il tasto "Chiama": + prefisso e numero, senza spazi
  whatsapp: "390000000000",         // per WhatsApp: 39 e numero, senza + né spazi
  email: "info@example.com",
  // Orari in ora italiana. 1 = lunedì … 6 = sabato, 0 = domenica. Più fasce per giorno.
  hours: {
    1: [["09:00", "13:00"], ["14:30", "19:30"]],
    2: [["09:00", "13:00"], ["14:30", "19:30"]],
    3: [["09:00", "13:00"], ["14:30", "19:30"]],
    4: [["09:00", "13:00"], ["14:30", "19:30"]],
    5: [["09:00", "13:00"], ["14:30", "19:30"]],
    6: [["09:00", "13:00"]],
    0: []
  },
  whatsappText: "Ciao! Ho bisogno di assistenza informatica da remoto."
};

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const DAYS = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text || CONFIG.whatsappText)}`;

  /* ---------- Contatti ---------- */
  $$("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-phone]").forEach((a) => { a.textContent = CONFIG.phoneDisplay; a.href = `tel:${CONFIG.phoneLink}`; });
  $$("[data-call]").forEach((a) => { a.href = `tel:${CONFIG.phoneLink}`; });
  $$("[data-email]").forEach((a) => { a.textContent = CONFIG.email; a.href = `mailto:${CONFIG.email}`; });
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Disponibilità in tempo reale (ora italiana) ---------- */
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const pretty = (t) => t.replace(/^0/, "");
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  function romeNow() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday), min: Number(parts.hour) * 60 + Number(parts.minute) };
  }

  function availability() {
    const { day, min } = romeNow();
    const slot = (CONFIG.hours[day] || []).find(([from, to]) => min >= toMin(from) && min < toMin(to));
    if (slot) return { open: true, text: `Disponibile ora · fino alle ${pretty(slot[1])}` };
    for (let i = 0; i <= 7; i++) {
      const d = (day + i) % 7;
      const next = (CONFIG.hours[d] || []).find(([from]) => i > 0 || toMin(from) > min);
      if (next) {
        const when = i === 0 ? "oggi" : i === 1 ? "domani" : DAYS[d];
        return { open: false, text: `Ora non disponibile · torno ${when} alle ${pretty(next[0])}` };
      }
    }
    return { open: false, text: "Scrivimi su WhatsApp: ti rispondo appena possibile" };
  }

  function renderStatus() {
    const s = availability();
    $$("[data-status]").forEach((el) => {
      el.classList.toggle("is-open", s.open);
      el.classList.toggle("is-closed", !s.open);
      $("[data-status-text]", el).textContent = s.text;
    });
  }
  renderStatus();
  setInterval(renderStatus, 60 * 1000);

  const hoursBody = $("[data-hours] tbody");
  if (hoursBody) {
    const { day } = romeNow();
    hoursBody.replaceChildren(...[1, 2, 3, 4, 5, 6, 0].map((d) => {
      const tr = document.createElement("tr");
      if (d === day) tr.className = "today";
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = cap(DAYS[d]);
      const td = document.createElement("td");
      const slots = CONFIG.hours[d] || [];
      td.textContent = slots.length ? slots.map(([a, b]) => `${pretty(a)}–${pretty(b)}`).join(" · ") : "Chiuso";
      tr.append(th, td);
      return tr;
    }));
  }

  /* ---------- Menu su telefono ---------- */
  const nav = $("[data-nav]");
  const toggle = $("[data-menu]");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  };
  toggle?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Interventi / Abbonamenti ---------- */
  const seg = $("[data-seg]");
  if (seg) {
    const tabs = $$("[role=tab]", seg);
    const select = (i) => {
      tabs.forEach((tab, j) => {
        tab.setAttribute("aria-selected", String(i === j));
        tab.tabIndex = i === j ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = i !== j;
      });
      seg.dataset.active = String(i);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
        select(n);
        tabs[n].focus();
      });
    });
  }

  /* ---------- Comparsa morbida delle sezioni ---------- */
  $$(".bento, .trust, .plans, .rules, .steps").forEach((group) => {
    $$(".reveal", group).forEach((el, i) => el.style.setProperty("--d", `${(i % 4) * 70}ms`));
  });
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }), { rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Effetti 3D con il mouse ---------- */
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
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

  /* ---------- Modulo "Ti richiamo io" (Netlify Forms) ---------- */
  const form = $("[data-form]");
  if (form) {
    const status = $("[data-form-status]", form);
    const submit = $("[type=submit]", form);

    const summary = () => {
      const f = new FormData(form);
      return [
        `Ciao, sono ${f.get("nome") || "…"}.`,
        `Problema: ${f.get("problema")}.`,
        f.get("messaggio") ? `Dettagli: ${f.get("messaggio")}` : "",
        f.get("telefono") ? `Il mio numero: ${f.get("telefono")}.` : "",
        `Preferisco essere contattato: ${String(f.get("quando")).toLowerCase()}.`
      ].filter(Boolean).join("\n");
    };

    const say = (text, kind, offerWhatsApp = false) => {
      status.className = `form__status ${kind}`;
      status.textContent = text;
      if (offerWhatsApp) {
        const a = document.createElement("a");
        a.href = waLink(summary());
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "Mandamelo su WhatsApp.";
        status.append(" ", a);
      }
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
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
        say("Grazie! Ho ricevuto la richiesta: ti richiamo appena possibile, negli orari di disponibilità.", "ok");
      } catch {
        say("Non sono riuscito a inviare la richiesta.", "err", true);
      } finally {
        submit.disabled = false;
      }
    });

    $("[data-form-wa]", form)?.addEventListener("click", () => {
      window.open(waLink(summary()), "_blank", "noopener");
    });
  }
  /* ---------- Scena 3D: solo se il dispositivo la supporta ---------- */
  const webgl2 = (() => {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      return !!gl;
    } catch {
      return false;
    }
  })();
  if (!reduceMotion && webgl2 && !navigator.connection?.saveData) {
    const load = () => import("./scene3d.js")
      .then((scene) => scene.start())
      .catch((err) => console.warn("Scena 3D non disponibile, resta il logo statico.", err));
    if (document.readyState === "complete") load();
    else addEventListener("load", load, { once: true });
  }
})();
