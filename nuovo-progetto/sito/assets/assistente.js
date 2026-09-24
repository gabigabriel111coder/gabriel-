/* ==========================================================================
   Gabriel Tech · finestra dell'assistente virtuale
   Caricata da main.js solo se in config.js c'è assistente: true.
   ========================================================================== */
(() => {
  const C = window.CONFIG || {};
  const ENDPOINT = "/.netlify/functions/assistente";
  const history = []; // { role: "user" | "assistant", content }
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const icon = (name) => `<svg class="i" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const waLink = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;

  // Trasforma i nomi delle pagine del sito e gli indirizzi web in link, senza mai usare HTML dal server
  const SITE_ROOT = new URL(document.querySelector("script[src$='main.js']")?.getAttribute("src") || "assets/main.js", location.href).href.replace(/assets\/main\.js$/, "");
  function renderText(target, text) {
    const parts = text.split(/(\bhttps?:\/\/[^\s)]+|\b[a-z0-9-]+\.html\b)/gi);
    parts.forEach((part, i) => {
      if (i % 2 === 0) { target.append(part); return; }
      const a = el("a", "", part);
      a.href = /^https?:/i.test(part) ? part : SITE_ROOT + part;
      if (/^https?:/i.test(part)) { a.target = "_blank"; a.rel = "noopener"; }
      target.append(a);
    });
  }

  const fab = el("button", "bot-fab");
  fab.type = "button";
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "bot-panel");
  fab.innerHTML = `${icon("chat")}<span>Domande?</span>`;

  const panel = el("section", "bot glass");
  panel.id = "bot-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Assistente virtuale");
  panel.innerHTML = `
    <header class="bot__head">
      <svg class="bot__logo" aria-hidden="true"><use href="#logo-mark"/></svg>
      <div><b>Assistente Gabriel Tech</b><small>Risposte automatiche · per parlare con me usa WhatsApp</small></div>
      <button class="bot__close" type="button" aria-label="Chiudi l'assistente">${icon("x")}</button>
    </header>
    <div class="bot__log" aria-live="polite"></div>
    <p class="bot__note">Non scrivere mai password, codici o dati bancari.</p>
    <form class="bot__form">
      <label class="sr-only" for="bot-input">Scrivi la tua domanda</label>
      <textarea id="bot-input" rows="1" maxlength="1000" placeholder="Scrivi la tua domanda…" required></textarea>
      <button class="btn btn--primary bot__send" type="submit" aria-label="Invia">${icon("arrow")}</button>
    </form>
    <a class="btn btn--wa btn--xs bot__wa" target="_blank" rel="noopener">${icon("chat")}Continua su WhatsApp</a>`;
  document.body.append(fab, panel);

  const log = panel.querySelector(".bot__log");
  const form = panel.querySelector(".bot__form");
  const input = panel.querySelector("textarea");
  const send = panel.querySelector(".bot__send");
  const wa = panel.querySelector(".bot__wa");

  const bubble = (role, text) => {
    const b = el("p", `bot__msg bot__msg--${role}`);
    renderText(b, text);
    log.append(b);
    log.scrollTop = log.scrollHeight;
    return b;
  };
  const updateWa = () => {
    const last = [...history].reverse().find((m) => m.role === "user");
    wa.href = waLink(last ? `Ciao! Ho una domanda: ${last.content}` : C.whatsappText || "Ciao!");
  };
  bubble("assistant", "Ciao! Sono l'assistente virtuale di Gabriel Tech. Chiedimi di servizi, prezzi o come funziona l'assistenza da remoto.");
  updateWa();

  const setOpen = (open) => {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("bot-open", open);
    if (open) input.focus();
  };
  fab.addEventListener("click", () => setOpen(panel.hidden));
  panel.querySelector(".bot__close").addEventListener("click", () => { setOpen(false); fab.focus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); fab.focus(); } });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || send.disabled) return;
    input.value = "";
    history.push({ role: "user", content: text });
    bubble("user", text);
    updateWa();
    const typing = bubble("assistant", "Sto scrivendo…");
    typing.classList.add("bot__msg--typing");
    send.disabled = true;
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || `HTTP ${res.status}`);
      typing.remove();
      history.push({ role: "assistant", content: data.reply });
      bubble("assistant", data.reply);
    } catch (err) {
      typing.remove();
      history.pop(); // la domanda senza risposta non resta nella conversazione
      bubble("assistant", "Non riesco a rispondere in questo momento. Scrivimi su WhatsApp con il pulsante qui sotto: ti rispondo io.");
      console.warn("Assistente:", err);
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
