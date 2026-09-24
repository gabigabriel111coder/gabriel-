/* ==========================================================================
   Gabriel Tech · gestionale del tecnico (pannello, richieste, monitoraggio)
   Parla con la funzione di Netlify "gestionale" usando la chiave ADMIN_TOKEN.
   I dati dei clienti sono mostrati sempre come testo, mai come HTML.
   ========================================================================== */
(() => {
  const ENDPOINT = "/.netlify/functions/gestionale";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* memoria non disponibile */ } },
    del: (k) => { try { localStorage.removeItem(k); } catch { /* memoria non disponibile */ } }
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "i");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return svg;
  };
  const button = (text, className, onClick) => {
    const b = el("button", `btn btn--xs ${className || "btn--ghost"}`, text);
    b.type = "button";
    if (onClick) b.addEventListener("click", onClick);
    return b;
  };
  const link = (text, href, className = "") => {
    const a = el("a", className, text);
    a.href = href;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  };
  const status = (node, text, kind = "") => {
    if (!node) return;
    node.textContent = text;
    node.className = `form__status ${kind}`.trim();
  };

  /* ---------- Date in ora italiana ---------- */
  const ROMA = "Europe/Rome";
  const fmtData = new Intl.DateTimeFormat("it-IT", { timeZone: ROMA, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const fmtGiorno = new Intl.DateTimeFormat("it-IT", { timeZone: ROMA, weekday: "long", day: "numeric", month: "long" });
  const fmtOra = new Intl.DateTimeFormat("it-IT", { timeZone: ROMA, hour: "2-digit", minute: "2-digit" });
  const quando = (iso) => (iso ? fmtData.format(new Date(iso)) : "");
  const appuntamento = (iso) => `${fmtGiorno.format(new Date(iso))} alle ${fmtOra.format(new Date(iso))}`;
  const rtf = new Intl.RelativeTimeFormat("it", { numeric: "auto" });
  const fa = (iso) => {
    const min = Math.round((new Date(iso) - Date.now()) / 60000);
    if (Math.abs(min) < 60) return rtf.format(min, "minute");
    if (Math.abs(min) < 60 * 36) return rtf.format(Math.round(min / 60), "hour");
    return rtf.format(Math.round(min / 1440), "day");
  };
  // Valore per <input type="datetime-local"> in ora italiana
  const perInput = (iso) => {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
      timeZone: ROMA, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  };
  const numeroWa = (tel = "") => {
    let d = String(tel).replace(/[^\d+]/g, "");
    if (d.startsWith("+")) d = d.slice(1);
    else if (d.startsWith("00")) d = d.slice(2);
    else if (/^3\d{8,9}$/.test(d)) d = `39${d}`;
    return d.replace(/\D/g, "");
  };

  /* ---------- Accesso ---------- */
  let chiave = store.get("gt-admin") || "";
  const box = $("[data-access]");
  if (!box) return;
  const accessStatus = $("[data-access-status]");

  class ErroreApi extends Error {
    constructor(message, codice) { super(message); this.codice = codice; }
  }
  async function api(azione, dati = {}) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${chiave}` },
        body: JSON.stringify({ azione, ...dati })
      });
    } catch {
      throw new ErroreApi("Nessuna connessione: controlla internet e riprova.", 0);
    }
    const tipo = res.headers.get("content-type") || "";
    const body = tipo.includes("json") ? await res.json().catch(() => ({})) : {};
    if (!res.ok) {
      if (res.status === 401) esci("Chiave di accesso sbagliata o cambiata: inseriscila di nuovo.");
      const testo = body.errore || (res.status === 404
        ? "Il gestionale funziona solo sul sito pubblicato su Netlify: qui le funzioni non rispondono."
        : `Errore ${res.status}: riprova tra poco.`);
      throw new ErroreApi(testo, res.status);
    }
    return body;
  }

  const onReady = [];
  function mostraAccesso(dentro) {
    $("[data-access-out]", box).hidden = dentro;
    $("[data-access-in]", box).hidden = !dentro;
    $$("[data-need-access]").forEach((n) => { n.hidden = !dentro; });
  }
  function esci(messaggio = "") {
    chiave = "";
    store.del("gt-admin");
    mostraAccesso(false);
    status(accessStatus, messaggio, messaggio ? "err" : "");
  }
  async function entra() {
    status(accessStatus, "Controllo la chiave…");
    try {
      const stato = await api("stato");
      store.set("gt-admin", chiave);
      status(accessStatus, "");
      mostraAccesso(true);
      onReady.forEach((fn) => fn(stato));
    } catch (err) {
      if (err.codice !== 401) status(accessStatus, err.message, "err");
      if (err.codice === 401 || err.codice === 503) { chiave = ""; store.del("gt-admin"); }
      mostraAccesso(false);
    }
  }
  $("[data-access-form]", box).addEventListener("submit", (e) => {
    e.preventDefault();
    chiave = $("#adm-key", box).value.trim();
    $("#adm-key", box).value = "";
    entra();
  });
  $("[data-logout]", box).addEventListener("click", () => esci());
  $("[data-gen-key]", box)?.addEventListener("click", () => {
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const key = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    $("[data-gen-out]", box).textContent = key;
  });
  const copia = async (testo, btn) => {
    try {
      await navigator.clipboard.writeText(testo);
      const prima = btn.lastChild.textContent;
      btn.lastChild.textContent = "Copiato!";
      setTimeout(() => { btn.lastChild.textContent = prima; }, 1600);
    } catch {
      window.prompt("Copia il testo:", testo);
    }
  };

  /* ---------- Pagina principale del pannello: servizi collegati e prove ---------- */
  const services = $("[data-services]");
  if (services) {
    const testStatus = $("[data-test-status]");
    onReady.push((stato) => {
      const c = stato.canali || {};
      const righe = [
        [c.telegram, "Avvisi su Telegram", "Nuove richieste e problemi dei PC ti arrivano sul telefono.", "Imposta TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID."],
        [c.email, `Email ai clienti${c.emailServizio ? ` (${c.emailServizio})` : ""}`, "Ricevuta, conferma, promemoria e richiesta di recensione.", "Imposta BREVO_API_KEY (oppure RESEND_API_KEY) ed EMAIL_MITTENTE."],
        [c.whatsapp, "WhatsApp automatico", "Conferma, promemoria e recensione a chi ha dato il consenso.", "Imposta WHATSAPP_TOKEN e WHATSAPP_PHONE_ID e fai approvare i modelli."],
        [stato.assistente, "Assistente virtuale", "Risponde alle domande sul sito.", "Imposta ANTHROPIC_API_KEY e assistente: true in config.js."]
      ];
      services.replaceChildren(...righe.map(([ok, titolo, si, no]) => {
        const li = el("li", ok ? "" : "todo");
        li.append(icon(ok ? "check" : "alert"));
        const div = el("div");
        div.append(el("b", "", titolo), el("p", "", ok ? si : `Non attivo. ${no}`));
        li.append(div);
        return li;
      }), (() => {
        const li = el("li");
        li.append(icon("calendar"));
        const div = el("div");
        div.append(el("b", "", "Gestionale attivo"), el("p", "", `${stato.richieste} ${stato.richieste === 1 ? "richiesta nuova" : "richieste nuove"} · ${stato.pc} PC monitorati`));
        li.append(div);
        return li;
      })());
      $("[data-test-box]").hidden = false;
    });
    $$("[data-test]").forEach((btn) => btn.addEventListener("click", async () => {
      const canale = btn.dataset.test;
      let a = "";
      if (canale === "email") a = window.prompt("A quale indirizzo mando l'email di prova?", "") || "";
      if (canale === "whatsapp") a = window.prompt("A quale numero mando il messaggio di prova? (con prefisso, es. +39 333…)", "") || "";
      if (canale !== "telegram" && !a.trim()) return;
      btn.disabled = true;
      status(testStatus, "Invio in corso…");
      try {
        await api("prova", { canale, a });
        status(testStatus, canale === "whatsapp" ? "Inviato il modello di prova «hello_world»: controlla WhatsApp." : "Inviato! Controlla che sia arrivato.", "ok");
      } catch (err) {
        status(testStatus, err.message, "err");
      } finally {
        btn.disabled = false;
      }
    }));
  }

  /* ---------- Richieste e appuntamenti ---------- */
  const list = $("[data-list]");
  if (list) {
    const listStatus = $("[data-list-status]");
    const empty = $("[data-empty]");
    const MODULI = { richiamata: "Richiamata", prenotazione: "Prenotazione", "preventivo-aziende": "Azienda", manuale: "Inserita a mano" };
    const STATI = { nuova: "Da gestire", confermata: "Confermata", completata: "Fatta", annullata: "Annullata" };
    const TIPI = { ricevuta: "Ricevuta", conferma: "Conferma", promemoria: "Promemoria", recensione: "Richiesta di recensione" };
    const FILTRI = {
      aperte: (r) => r.stato === "nuova" || r.stato === "confermata",
      confermata: (r) => r.stato === "confermata",
      completata: (r) => r.stato === "completata",
      tutte: () => true
    };
    let richieste = [];
    let filtro = "aperte";

    const aggiorna = (r) => {
      const i = richieste.findIndex((x) => x.id === r.id);
      if (i >= 0) richieste[i] = r; else richieste.unshift(r);
      disegna();
    };
    // Esegue un'azione dal riquadro di una richiesta, con i messaggi di esito accanto ai pulsanti
    const azione = async (card, nome, dati, successo) => {
      const out = $("[data-card-status]", card);
      $$("button", card).forEach((b) => { b.disabled = true; });
      status(out, "Un momento…");
      try {
        const risposta = await api(nome, dati);
        if (risposta.richiesta) aggiorna(risposta.richiesta);
        else if (nome === "elimina") { richieste = richieste.filter((x) => x.id !== dati.id); disegna(); }
        const esiti = risposta.esiti || [];
        const falliti = esiti.filter((e) => !e.ok);
        let msg = typeof successo === "function" ? successo(risposta) : successo;
        // se la richiesta è uscita dalla lista mostrata, il messaggio va sopra la lista
        let dove = $(`[data-id="${dati.id}"] [data-card-status]`);
        if (!dove) {
          dove = listStatus;
          if (msg && risposta.richiesta) msg = `${risposta.richiesta.nome}: ${msg}`;
        }
        if (falliti.length) status(dove, `${msg} Non riuscito: ${falliti.map((e) => `${e.canale} (${e.errore})`).join("; ")}`, "err");
        else if (msg) status(dove, msg, "ok");
      } catch (err) {
        status(out, err.message, "err");
        $$("button", card).forEach((b) => { b.disabled = false; });
      }
    };
    const esitoInvio = (r, tipo) => {
      const ultimi = (r.messaggi || []).filter((m) => m.tipo === tipo).slice(-2);
      const ok = ultimi.filter((m) => m.ok).map((m) => m.canale);
      return ok.length ? `inviata via ${ok.join(" e ")}.` : "nessun messaggio inviato (email e WhatsApp non attivi o senza consenso).";
    };

    function scheda(r) {
      const card = el("article", "req glass");
      card.dataset.id = r.id;

      const head = el("div", "req__head");
      head.append(el("span", "req__name", r.nome || "Senza nome"), el("span", `state state--${r.stato}`, STATI[r.stato] || r.stato));
      if (r.lingua === "en") head.append(el("span", "state", "EN"));
      head.append(el("span", "req__meta", `${MODULI[r.modulo] || "Richiesta"} · ${quando(r.creata)}`));
      card.append(head);

      if (r.appuntamento) {
        const w = el("p", "req__when");
        w.append(icon("calendar"), document.createTextNode(appuntamento(r.appuntamento)));
        card.append(w);
      } else if (r.richiesto && r.stato === "nuova") {
        card.append(el("p", "req__meta", `Chiede: ${appuntamento(r.richiesto)}`));
      }

      const dl = el("dl", "facts");
      const fatto = (k, v) => {
        dl.append(el("dt", "", k));
        const dd = el("dd");
        if (v instanceof Node) dd.append(v); else dd.textContent = v;
        dl.append(dd);
      };
      const tel = el("span");
      tel.append(link(r.telefono, `tel:${r.telefono.replace(/[^\d+]/g, "")}`));
      const wa = numeroWa(r.telefono);
      if (wa.length >= 10) tel.append(document.createTextNode(" · "), link("WhatsApp", `https://wa.me/${wa}`));
      fatto("Telefono", tel);
      if (r.email) fatto("Email", link(r.email, `mailto:${r.email}`));
      for (const [k, v] of Object.entries(r.dettagli || {})) if (!(r.richiesto && (k === "Giorno" || k === "Orario"))) fatto(k, v);
      fatto("Messaggi automatici", `${r.email ? "email" : "niente email"} · ${r.consenso ? "WhatsApp sì" : "WhatsApp no"}`);
      card.append(dl);
      if (r.messaggio) card.append(el("p", "req__msg", r.messaggio));
      if (r.note) card.append(el("p", "req__msg", `Note: ${r.note}`));

      // Azioni secondo lo stato
      const actions = el("div", "req__actions");
      const orario = el("input");
      orario.type = "datetime-local";
      orario.setAttribute("aria-label", "Data e ora dell'appuntamento (ora italiana)");
      const base = r.appuntamento || r.richiesto;
      if (base && new Date(base) > Date.now()) orario.value = perInput(base);
      const confermaBtn = button(r.stato === "confermata" ? "Cambia orario" : "Conferma e avvisa", "btn--primary", () => {
        if (!orario.value) { status($("[data-card-status]", card), "Scegli data e ora.", "err"); orario.focus(); return; }
        azione(card, "conferma", { id: r.id, appuntamento: orario.value }, (x) => `Confermato: ${esitoInvio(x.richiesta, "conferma")}`);
      });
      if (r.stato === "nuova" || r.stato === "confermata") actions.append(orario, confermaBtn);
      if (r.stato === "confermata") {
        actions.append(button("Fatto", "btn--primary", () => azione(card, "completa", { id: r.id }, (x) => (x.richiesta.lavori?.length ? "Segnato come fatto: la richiesta di recensione partirà domani." : "Segnato come fatto."))));
        actions.append(button("Rimanda la conferma", "", () => azione(card, "invia", { id: r.id, tipo: "conferma" }, "Conferma inviata di nuovo.")));
      }
      if (r.stato === "nuova") actions.append(button("Fatto senza appuntamento", "", () => azione(card, "completa", { id: r.id }, "Segnato come fatto.")));
      if (r.stato === "nuova" || r.stato === "confermata") actions.append(button("Annulla", "btn--danger", () => azione(card, "annulla", { id: r.id }, "Annullata: i messaggi programmati sono stati tolti.")));
      if (r.stato === "completata" && !(r.messaggi || []).some((m) => m.tipo === "recensione" && m.ok)) {
        actions.append(button("Chiedi la recensione ora", "", () => azione(card, "invia", { id: r.id, tipo: "recensione" }, "Richiesta di recensione inviata.")));
      }
      if (r.stato === "completata" || r.stato === "annullata") actions.append(button("Riapri", "", () => azione(card, "riapri", { id: r.id }, "Riaperta.")));
      card.append(actions);
      const out = el("p", "form__status");
      out.dataset.cardStatus = "";
      out.setAttribute("role", "status");
      card.append(out);

      // Storico dei messaggi
      if ((r.messaggi || []).length) {
        const log = el("ul", "req__log");
        for (const m of r.messaggi.slice(-8)) {
          const li = el("li", m.ok ? "" : "ko", `${m.ok ? "✓" : "✗"} ${TIPI[m.tipo] || m.tipo} via ${m.canale} · ${quando(m.quando)}${m.manuale ? " (a mano)" : ""}${m.ok ? "" : ` · ${m.errore || "errore"}`}`);
          log.append(li);
        }
        card.append(log);
      }
      if ((r.lavori || []).length) {
        const prossimi = r.lavori.map((k) => {
          const [ms, tipo] = k.split("_");
          return `${TIPI[tipo] || tipo} ${quando(new Date(Number(ms)).toISOString())}`;
        });
        card.append(el("p", "req__meta", `Programmato: ${prossimi.join(" · ")}`));
      }

      // Modifica dati, note ed eliminazione
      const more = el("details", "req__more");
      more.append(el("summary", "", "Modifica, note, elimina"));
      const form = el("form", "form");
      const campo = (label, input) => {
        const f = el("div", "field");
        const id = `${input.name}-${r.id}`;
        input.id = id;
        const l = el("label", "", label);
        l.htmlFor = id;
        f.append(l, input);
        return f;
      };
      const input = (name, value, type = "text", max = 100) => {
        const i = el("input");
        i.name = name; i.type = type; i.value = value || ""; i.maxLength = max;
        return i;
      };
      const riga = el("div", "row");
      riga.append(campo("Telefono", input("telefono", r.telefono, "tel", 20)), campo("Email", input("email", r.email, "email", 100)));
      const lingua = el("select");
      lingua.name = "lingua";
      [["it", "Italiano"], ["en", "Inglese"]].forEach(([v, t]) => {
        const o = el("option", "", t);
        o.value = v;
        o.selected = r.lingua === v;
        lingua.append(o);
      });
      const note = el("textarea");
      note.name = "note"; note.rows = 2; note.maxLength = 2000; note.value = r.note || "";
      const consenso = el("label", "check");
      const cb = el("input");
      cb.type = "checkbox"; cb.name = "consenso"; cb.checked = Boolean(r.consenso);
      consenso.append(cb, el("span", "", "Il cliente ha accettato i messaggi su WhatsApp"));
      const bottoni = el("div", "req__actions");
      const salva = el("button", "btn btn--primary btn--xs", "Salva");
      salva.type = "submit";
      bottoni.append(salva, button("Elimina definitivamente", "btn--danger", () => {
        if (window.confirm(`Eliminare definitivamente la richiesta di ${r.nome}? Non si può annullare.`)) azione(card, "elimina", { id: r.id }, "");
      }));
      form.append(riga, campo("Lingua dei messaggi", lingua), campo("Note (solo per te)", note), consenso, bottoni);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        azione(card, "modifica", {
          id: r.id, telefono: form.elements.telefono.value, email: form.elements.email.value,
          lingua: lingua.value, note: note.value, consenso: cb.checked
        }, "Salvato.");
      });
      more.append(form);
      card.append(more);
      return card;
    }

    function disegna() {
      const scelte = richieste.filter(FILTRI[filtro]);
      if (filtro === "confermata") scelte.sort((a, b) => new Date(a.appuntamento) - new Date(b.appuntamento));
      list.replaceChildren(...scelte.map(scheda));
      empty.hidden = scelte.length > 0;
      $$("[data-filter]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.filter === filtro));
        let count = $(".count", b);
        if (!count) { count = el("span", "count"); b.append(count); }
        count.textContent = String(richieste.filter(FILTRI[b.dataset.filter]).length);
      });
    }
    async function carica() {
      status(listStatus, "Carico le richieste…");
      try {
        richieste = (await api("richieste")).richieste || [];
        status(listStatus, "");
        disegna();
      } catch (err) {
        status(listStatus, err.message, "err");
      }
    }
    $$("[data-filter]").forEach((b) => b.addEventListener("click", () => { filtro = b.dataset.filter; disegna(); }));
    $("[data-refresh]").addEventListener("click", carica);

    const newForm = $("[data-new-form]");
    $$("[data-new-toggle]").forEach((b) => b.addEventListener("click", () => {
      newForm.hidden = !newForm.hidden;
      if (!newForm.hidden) newForm.elements.nome.focus();
    }));
    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = newForm.elements;
      const out = $("[data-new-status]");
      const btn = $("button[type=submit]", newForm);
      btn.disabled = true;
      status(out, "Salvo…");
      try {
        const { richiesta } = await api("nuova", {
          nome: f.nome.value, telefono: f.telefono.value, email: f.email.value, lingua: f.lingua.value,
          messaggio: f.messaggio.value, appuntamento: f.appuntamento.value, aggiornamenti: f.aggiornamenti.checked ? "si" : ""
        });
        newForm.reset();
        newForm.hidden = true;
        status(out, "");
        aggiorna(richiesta);
        status(listStatus, richiesta.appuntamento ? `Salvata e confermata: ${esitoInvio(richiesta, "conferma")}` : "Salvata.", "ok");
      } catch (err) {
        status(out, err.message, "err");
      } finally {
        btn.disabled = false;
      }
    });
    onReady.push(carica);
  }

  /* ---------- Monitoraggio dei PC ---------- */
  const devices = $("[data-devices]");
  if (devices) {
    const listStatus = $("[data-list-status]");
    const empty = $("[data-empty]");
    const summary = $("[data-mon-summary]");
    const install = $("[data-install]");
    const addForm = $("[data-add-form]");
    const ORDINE = { critico: 3, attenzione: 2, info: 1 };
    let elenco = [];

    const psq = (t) => `'${String(t).replace(/'/g, "''")}'`; // PowerShell
    const shq = (t) => `'${String(t).replace(/'/g, "'\\''")}'`; // Terminale del Mac
    function istruzioni(nome, x) {
      $("[data-install-name]").textContent = nome;
      $("[data-cmd=win]").textContent = `Set-ExecutionPolicy -Scope Process Bypass -Force; & "$env:USERPROFILE\\Downloads\\gabrieltech-monitor.ps1" -Install -Endpoint ${psq(x.endpoint)} -DeviceId ${psq(x.id)} -Token ${psq(x.chiave)}${x.backup ? ` -BackupPath ${psq(x.backup)}` : ""}`;
      $("[data-cmd=mac]").textContent = `sudo bash ~/Downloads/gabrieltech-monitor.sh install ${shq(x.endpoint)} ${shq(x.id)} ${shq(x.chiave)}${x.backup ? ` ${shq(x.backup)}` : ""}`;
      install.hidden = false;
      install.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    $$("[data-copy-cmd]").forEach((b) => b.addEventListener("click", () => copia($(`[data-cmd=${b.dataset.copyCmd}]`).textContent, b)));

    const peggiore = (d) => {
      if (!d.ultimoContatto) return "";
      if (Date.now() - new Date(d.ultimoContatto) > 72 * 3600e3) return "";
      const top = Math.max(0, ...(d.problemi || []).map((p) => ORDINE[p.livello] || 0));
      return top >= 3 ? "critico" : top === 2 ? "attenzione" : "ok";
    };
    const azioneDispositivo = async (card, nome, dati, dopo) => {
      const out = $("[data-card-status]", card);
      $$("button", card).forEach((b) => { b.disabled = true; });
      status(out, "Un momento…");
      try {
        const risposta = await api(nome, dati);
        await carica();
        if (dopo) dopo(risposta);
      } catch (err) {
        status(out, err.message, "err");
        $$("button", card).forEach((b) => { b.disabled = false; });
      }
    };

    function scheda(d) {
      const card = el("article", "dev glass");
      const r = d.report || {};
      const head = el("div", "dev__head");
      const livello = peggiore(d);
      const dot = el("span", `dot${livello ? ` dot--${livello}` : ""}`);
      dot.setAttribute("aria-hidden", "true");
      head.append(dot, el("span", "dev__name", d.nome));
      if (d.revocato) head.append(el("span", "state", "Rimosso"));
      card.append(head);

      const meta = [];
      if (d.revocato) meta.push("Il programma si disinstalla al prossimo controllo");
      else if (!d.ultimoContatto) meta.push("In attesa del primo controllo");
      else meta.push(`Ultimo controllo ${fa(d.ultimoContatto)}`);
      const sistema = [r.sistema?.nome, r.computer?.produttore, r.computer?.modello].filter(Boolean).join(" · ");
      if (sistema) meta.push(sistema);
      card.append(el("p", "dev__meta", meta.join(" — ")));
      if (d.ultimoContatto && !d.revocato && Date.now() - new Date(d.ultimoContatto) > 72 * 3600e3) {
        card.append(el("p", "callout callout--warn", "Nessun controllo da più di 3 giorni: PC spento da tempo, senza internet o programma tolto."));
      }

      if ((r.dischi || []).length) {
        const disks = el("div", "disks");
        for (const k of r.dischi) {
          const usato = Math.max(0, Math.min(100, 100 - (k.liberoGB / k.totaleGB) * 100));
          const problema = (d.problemi || []).find((p) => p.codice === `disco:${k.unita}`);
          const riga = el("div", "disk");
          riga.append(el("span", "", `Disco ${k.unita.replace(/:$/, "")}: ${Math.round(k.liberoGB)} GB liberi su ${Math.round(k.totaleGB)} GB`));
          const meter = el("div", `meter${problema ? ` meter--${problema.livello}` : ""}`);
          meter.setAttribute("role", "img");
          meter.setAttribute("aria-label", `Usato al ${Math.round(usato)}%`);
          const bar = el("i");
          bar.style.width = `${usato}%`;
          meter.append(bar);
          riga.append(meter);
          disks.append(riga);
        }
        card.append(disks);
      }
      const problemi = [...(d.problemi || [])].sort((a, b) => (ORDINE[b.livello] || 0) - (ORDINE[a.livello] || 0));
      if (problemi.length) {
        const ul = el("ul", "issues");
        for (const p of problemi) {
          const li = el("li");
          const dotP = el("span", `dot dot--${p.livello}`);
          dotP.setAttribute("aria-hidden", "true");
          li.append(dotP, el("span", "", p.testo));
          ul.append(li);
        }
        card.append(ul);
      } else if (d.ultimoContatto) {
        card.append(el("p", "req__meta", "Nessun problema trovato."));
      }
      const extra = [];
      if (r.backup?.ultimoGiorni != null) extra.push(`Ultimo backup: ${Math.round(r.backup.ultimoGiorni)} giorni fa`);
      if (r.aggiornamenti?.ultimoGiorni != null) extra.push(`Ultimo aggiornamento: ${Math.round(r.aggiornamenti.ultimoGiorni)} giorni fa`);
      if (r.avvioGiorni != null) extra.push(`Acceso da ${Math.round(r.avvioGiorni)} giorni`);
      if (extra.length) card.append(el("p", "req__meta", extra.join(" · ")));

      const actions = el("div", "req__actions");
      if (!d.revocato) {
        actions.append(button("Nuova chiave e istruzioni", "", () => {
          if (!window.confirm("Creo una nuova chiave: quella vecchia smette di funzionare e dovrai rifare l'installazione su quel PC. Continuo?")) return;
          azioneDispositivo(card, "chiave-dispositivo", { id: d.id }, (x) => istruzioni(d.nome, x.installa));
        }));
        actions.append(button("Rimuovi il monitoraggio", "btn--danger", () => {
          if (!window.confirm(`Togliere il monitoraggio da «${d.nome}»? Al prossimo controllo il programma si disinstalla da solo.`)) return;
          azioneDispositivo(card, "revoca-dispositivo", { id: d.id });
        }));
      } else {
        actions.append(button("Elimina dall'elenco", "btn--danger", () => {
          if (!window.confirm(`Eliminare «${d.nome}» e i suoi dati dall'elenco?`)) return;
          azioneDispositivo(card, "elimina-dispositivo", { id: d.id });
        }));
      }
      card.append(actions);
      const out = el("p", "form__status");
      out.dataset.cardStatus = "";
      out.setAttribute("role", "status");
      card.append(out);
      return card;
    }

    function disegna() {
      const attivi = elenco.filter((d) => !d.revocato);
      const conProblemi = attivi.filter((d) => ["critico", "attenzione"].includes(peggiore(d))).length;
      const silenziosi = attivi.filter((d) => peggiore(d) === "" && d.ultimoContatto).length;
      summary.textContent = elenco.length
        ? `${attivi.length} PC monitorati · ${conProblemi} con problemi${silenziosi ? ` · ${silenziosi} senza notizie` : ""}`
        : "";
      const ordinati = [...elenco].sort((a, b) => {
        const peso = (d) => (d.revocato ? -1 : { critico: 4, attenzione: 3, "": 2, ok: 1 }[peggiore(d)]);
        return peso(b) - peso(a) || a.nome.localeCompare(b.nome, "it");
      });
      devices.replaceChildren(...ordinati.map(scheda));
      empty.hidden = elenco.length > 0;
    }
    async function carica() {
      status(listStatus, "Carico i PC…");
      try {
        elenco = (await api("dispositivi")).dispositivi || [];
        status(listStatus, "");
        disegna();
      } catch (err) {
        status(listStatus, err.message, "err");
      }
    }
    $("[data-refresh]").addEventListener("click", carica);
    $$("[data-add-toggle]").forEach((b) => b.addEventListener("click", () => {
      addForm.hidden = !addForm.hidden;
      if (!addForm.hidden) addForm.elements.nome.focus();
    }));
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const out = $("[data-add-status]");
      const btn = $("button[type=submit]", addForm);
      btn.disabled = true;
      status(out, "Creo…");
      try {
        const nome = addForm.elements.nome.value;
        const risposta = await api("nuovo-dispositivo", { nome, backup: addForm.elements.backup.value });
        addForm.reset();
        addForm.hidden = true;
        status(out, "");
        await carica();
        istruzioni(risposta.dispositivo.nome, risposta.installa);
      } catch (err) {
        status(out, err.message, "err");
      } finally {
        btn.disabled = false;
      }
    });
    onReady.push(carica);
  }

  /* ---------- Avvio ---------- */
  if (chiave) entra();
  else mostraAccesso(false);
})();
