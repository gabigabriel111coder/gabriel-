/* Nebbia Vape Atelier — catalogo e prenotazione dei liquidi.
   Per personalizzare il negozio modifica solo NEGOZIO e LIQUIDI qui sotto. */

const NEGOZIO = {
  nome: "Nebbia Vape Atelier",
  indirizzo: "Via Roma 12, 20121 Milano",
  telefono: "+39 333 123 4567",
  whatsapp: "393331234567", // solo cifre, con prefisso internazionale
  mappe: "https://maps.google.com/?q=Via+Roma+12+Milano",
  legale: "P.IVA 00000000000 · Licenza ADM n. 000000",
  // Orari per giorno della settimana (0 = domenica). Vuoto = chiuso.
  orari: {
    1: [["15:30", "19:30"]],
    2: [["09:30", "13:00"], ["15:30", "19:30"]],
    3: [["09:30", "13:00"], ["15:30", "19:30"]],
    4: [["09:30", "13:00"], ["15:30", "19:30"]],
    5: [["09:30", "13:00"], ["15:30", "19:30"]],
    6: [["09:30", "13:00"], ["15:30", "19:30"]],
    0: []
  },
  preavvisoMinuti: 120, // tempo minimo per preparare una prenotazione
  giorniPrenotabili: 7
};

const FORMATI = {
  "10": { nome: "Pronto 10 ml", nota: "Già con nicotina", prezzo: 5.9, nicotina: [0, 3, 6, 9, 12, 18] },
  "mix": { nome: "Mix & Vape 20/60 ml", nota: "Aroma da completare", prezzo: 15.9, nicotina: null },
  "aroma": { nome: "Aroma 10 ml", nota: "Concentrato", prezzo: 7.5, nicotina: null }
};

const FAMIGLIE = {
  tabaccosi: "Tabaccosi",
  fruttati: "Fruttati",
  freschi: "Freschi",
  cremosi: "Cremosi e dolci"
};

const LIQUIDI = [
  { id: "tabacco-reale", nome: "Tabacco Reale", famiglia: "tabaccosi", note: "Virginia dorato · miele · vaniglia", desc: "Pieno ma morbido, con una chiusura dolce di miele di castagno. Il nostro più richiesto.", c1: "#ffcf8a", c2: "#9a4a1c", formati: ["10", "mix", "aroma"], badge: "Il più amato" },
  { id: "ambra", nome: "Ambra", famiglia: "tabaccosi", note: "Burley · caramello · nocciola", desc: "Un tabacco scuro e avvolgente, con caramello bruciato e nocciola tostata.", c1: "#f2a65a", c2: "#b8452b", formati: ["10", "mix"] },
  { id: "cuoio-e-legno", nome: "Cuoio e Legno", famiglia: "tabaccosi", note: "Kentucky · rovere · un filo di rum", desc: "Secco e deciso, per chi ama il sigaro. Si sente il legno, finisce asciutto.", c1: "#c98b5a", c2: "#5a2e18", formati: ["10", "aroma"], scorte: 2 },
  { id: "brezza", nome: "Brezza", famiglia: "freschi", note: "Menta piperita · eucalipto", desc: "Fresco pulito, senza zucchero. La boccata che sveglia.", c1: "#9fe3d0", c2: "#2b8c7a", formati: ["10", "mix"] },
  { id: "ghiaccio-blu", nome: "Ghiaccio Blu", famiglia: "freschi", note: "Mirtillo · lampone blu · ghiaccio", desc: "Frutti blu succosi con un'onda polare che resta in gola.", c1: "#8fb8ff", c2: "#2f47b8", formati: ["10", "mix"], badge: "Novità" },
  { id: "anguria-lime", nome: "Anguria e Lime", famiglia: "freschi", note: "Anguria · lime · fresco", desc: "Estate in un flacone: dolce d'anguria, acidità del lime, freschezza leggera.", c1: "#ff8fa3", c2: "#2f9e5a", formati: ["10", "mix"] },
  { id: "fragola-di-bosco", nome: "Fragola di Bosco", famiglia: "fruttati", note: "Fragoline · panna leggera", desc: "Profumata e naturale, come le fragoline raccolte a giugno.", c1: "#ff7a8a", c2: "#a3173a", formati: ["10", "mix", "aroma"] },
  { id: "notte-viola", nome: "Notte Viola", famiglia: "fruttati", note: "Uva nera · ribes · viola", desc: "Scuro, profumato, un po' misterioso. Uva matura e petali di viola.", c1: "#b9a3ff", c2: "#5a3fb8", formati: ["10", "mix"] },
  { id: "pesca-bianca", nome: "Pesca Bianca", famiglia: "fruttati", note: "Pesca · albicocca · tè bianco", desc: "Vellutata e delicata, con un finale di tè che pulisce il palato.", c1: "#ffd2a8", c2: "#e0795a", formati: ["10", "mix"], scorte: 3 },
  { id: "crema-catalana", nome: "Crema Catalana", famiglia: "cremosi", note: "Crema · zucchero bruciato · limone", desc: "La crosta croccante, la crema sotto, una scorza di limone. Da dessert.", c1: "#ffe3a3", c2: "#c47a2c", formati: ["10", "mix", "aroma"] },
  { id: "tiramisu", nome: "Tiramisù", famiglia: "cremosi", note: "Mascarpone · caffè · cacao", desc: "Caffè espresso e mascarpone, cacao amaro sopra. Goloso senza stancare.", c1: "#d9b38c", c2: "#4a2c1d", formati: ["10", "mix"], badge: "Novità" },
  { id: "pistacchio", nome: "Pistacchio", famiglia: "cremosi", note: "Pistacchio di Bronte · latte", desc: "Tostato e cremoso, con la dolcezza giusta del gelato artigianale.", c1: "#c7dc8a", c2: "#5f7a2a", formati: ["10", "mix"] }
];

/* ---------- Utilità ---------- */
const $ = (s, el = document) => el.querySelector(s);
const euro = n => "€ " + n.toFixed(2).replace(".", ",");
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

function bottleHTML(l, size = "") {
  return `<span class="bottle ${size}" style="--c1:${l.c1};--c2:${l.c2}"><span class="bottle__cap"></span><span class="bottle__body"><span class="bottle__liquid"></span><span class="bottle__label">${esc(l.nome)}<small>10 ml</small></span></span></span>`;
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 2600);
}

/* ---------- Verifica età ---------- */
(function ageGate() {
  const gate = $("#agegate");
  if (store.get("nebbia-18", false)) return;
  gate.hidden = false; document.body.classList.add("locked");
  $("#age-yes").focus();
  $("#age-yes").onclick = () => { store.set("nebbia-18", true); gate.hidden = true; document.body.classList.remove("locked"); };
  $("#age-no").onclick = () => { $("#age-no-msg").hidden = false; };
})();

/* ---------- Catalogo ---------- */
let filtro = "tutti", ricerca = "";

function renderFilters() {
  const f = $("#filters");
  f.innerHTML = [["tutti", "Tutti"], ...Object.entries(FAMIGLIE)]
    .map(([k, v]) => `<button type="button" class="chip" data-f="${k}" aria-pressed="${k === filtro}">${v}</button>`).join("");
  f.onclick = e => {
    const b = e.target.closest("[data-f]"); if (!b) return;
    filtro = b.dataset.f; renderFilters(); renderGrid();
  };
}

function renderGrid() {
  const q = ricerca.trim().toLowerCase();
  const list = LIQUIDI.filter(l =>
    (filtro === "tutti" || l.famiglia === filtro) &&
    (!q || (l.nome + " " + l.note + " " + FAMIGLIE[l.famiglia]).toLowerCase().includes(q)));
  $("#grid").innerHTML = list.map((l, i) => {
    const min = Math.min(...l.formati.map(f => FORMATI[f].prezzo));
    const badge = l.scorte ? `<span class="card__badge card__badge--low">Ultimi ${l.scorte}</span>` : l.badge ? `<span class="card__badge">${esc(l.badge)}</span>` : "";
    return `<button type="button" class="card" data-open="${l.id}" style="--c1:${l.c1};--c2:${l.c2};animation-delay:${i * 40}ms">
      <span class="card__visual">${badge}${bottleHTML(l)}</span>
      <span class="card__body">
        <span class="card__family">${FAMIGLIE[l.famiglia]}</span>
        <span class="card__name">${esc(l.nome)}</span>
        <span class="card__notes">${esc(l.note)}</span>
        <span class="card__foot"><span class="card__price"><small>da</small>${euro(min)}</span><span class="card__cta">Prenota →</span></span>
      </div>
    </button>`;
  }).join("");
  $("#empty").hidden = list.length > 0;
}

$("#search").addEventListener("input", e => { ricerca = e.target.value; renderGrid(); });
document.addEventListener("click", e => {
  const b = e.target.closest("[data-open]"); if (b) openProduct(b.dataset.open);
});

/* ---------- Pannelli ---------- */
let lastFocus = null;
function openSheet(el) {
  lastFocus = document.activeElement;
  el.hidden = false; document.body.classList.add("locked");
  setTimeout(() => $(".sheet__close", el).focus(), 50);
}
function closeSheet(el) {
  el.hidden = true;
  if (!document.querySelector(".sheet:not([hidden])")) document.body.classList.remove("locked");
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll(".sheet").forEach(s => s.addEventListener("click", e => {
  if (e.target.closest("[data-close]")) closeSheet(s);
}));
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  const open = [...document.querySelectorAll(".sheet:not([hidden])")].pop();
  if (open) closeSheet(open);
});

/* ---------- Scheda prodotto ---------- */
const sel = { id: null, formato: "10", nic: 6, qty: 1 };

function openProduct(id) {
  const l = LIQUIDI.find(x => x.id === id); if (!l) return;
  Object.assign(sel, { id, formato: l.formati[0], qty: 1 });
  const nicOpts = FORMATI[sel.formato].nicotina;
  if (nicOpts && !nicOpts.includes(sel.nic)) sel.nic = 6;
  const sheet = $("#product-sheet");
  $("#ps-visual").style.cssText = `--c1:${l.c1};--c2:${l.c2}`;
  $("#ps-visual").innerHTML = bottleHTML(l, "bottle--xxl");
  $("#ps-family").textContent = FAMIGLIE[l.famiglia];
  $("#ps-name").textContent = l.nome;
  $("#ps-notes").textContent = l.note;
  $("#ps-desc").textContent = l.desc;
  renderOptions();
  openSheet(sheet);
}

function renderOptions() {
  const l = LIQUIDI.find(x => x.id === sel.id);
  $("#ps-formats").innerHTML = l.formati.map(f =>
    `<button type="button" role="radio" class="opt__item" data-formato="${f}" aria-checked="${f === sel.formato}">${FORMATI[f].nome}<small>${FORMATI[f].nota} · ${euro(FORMATI[f].prezzo)}</small></button>`).join("");
  const nic = FORMATI[sel.formato].nicotina;
  $("#ps-nic-wrap").hidden = !nic;
  if (nic) $("#ps-nic").innerHTML = nic.map(n =>
    `<button type="button" role="radio" class="opt__item opt__item--nic" data-nic="${n}" aria-checked="${n === sel.nic}">${n}</button>`).join("");
  $("#ps-qty").textContent = sel.qty;
  $("#ps-price").textContent = euro(FORMATI[sel.formato].prezzo * sel.qty);
}

$("#ps-formats").onclick = e => { const b = e.target.closest("[data-formato]"); if (b) { sel.formato = b.dataset.formato; renderOptions(); } };
$("#ps-nic").onclick = e => { const b = e.target.closest("[data-nic]"); if (b) { sel.nic = +b.dataset.nic; renderOptions(); } };
$("#ps-minus").onclick = () => { sel.qty = Math.max(1, sel.qty - 1); renderOptions(); };
$("#ps-plus").onclick = () => { sel.qty = Math.min(10, sel.qty + 1); renderOptions(); };
$("#ps-add").onclick = () => {
  const nic = FORMATI[sel.formato].nicotina ? sel.nic : null;
  const key = `${sel.id}|${sel.formato}|${nic}`;
  const found = bag.find(i => i.key === key);
  if (found) found.qty = Math.min(10, found.qty + sel.qty);
  else bag.push({ key, id: sel.id, formato: sel.formato, nic, qty: sel.qty });
  saveBag();
  closeSheet($("#product-sheet"));
  const l = LIQUIDI.find(x => x.id === sel.id);
  toast(`${l.nome} aggiunto alla prenotazione`);
  const c = $("#bag-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
};

/* ---------- Prenotazione ---------- */
let bag = store.get("nebbia-bag", []).filter(i => LIQUIDI.some(l => l.id === i.id) && FORMATI[i.formato]);
function saveBag() { store.set("nebbia-bag", bag); renderBag(); }
const itemPrice = i => FORMATI[i.formato].prezzo * i.qty;
const bagTotal = () => bag.reduce((s, i) => s + itemPrice(i), 0);
const itemLabel = i => `${FORMATI[i.formato].nome}${i.nic !== null ? ` · ${i.nic} mg/ml` : ""}`;

function itemsHTML(items, removable) {
  return items.map((i, idx) => {
    const l = LIQUIDI.find(x => x.id === i.id);
    return `<li class="bag-item" style="--c1:${l.c1};--c2:${l.c2}">
      <span class="bag-item__dot" aria-hidden="true"></span>
      <span><span class="bag-item__name">${i.qty} × ${esc(l.nome)}</span><br><span class="bag-item__meta">${itemLabel(i)}</span></span>
      <span class="bag-item__right"><span class="bag-item__price">${euro(itemPrice(i))}</span>${removable ? `<button type="button" class="bag-item__rm" data-rm="${idx}">Rimuovi</button>` : ""}</span>
    </li>`;
  }).join("");
}

function renderBag() {
  const n = bag.reduce((s, i) => s + i.qty, 0);
  const c = $("#bag-count"); c.textContent = n; c.classList.toggle("has", n > 0);
  $("#bag-list").innerHTML = itemsHTML(bag, true);
  $("#bag-empty").hidden = bag.length > 0;
  $("#book-form").hidden = bag.length === 0;
  $("#bag-total").textContent = euro(bagTotal());
}
$("#bag-list").onclick = e => {
  const b = e.target.closest("[data-rm]"); if (!b) return;
  bag.splice(+b.dataset.rm, 1); saveBag();
};

$("#bag-open").onclick = () => {
  $("#bag-view").hidden = false; $("#done-view").hidden = true;
  renderDays(); openSheet($("#bag"));
};

/* Giorni e orari di ritiro, calcolati dagli orari del negozio */
const toMin = hhmm => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const fromMin = m => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function slotsFor(date) {
  const now = new Date();
  const earliest = date.toDateString() === now.toDateString() ? now.getHours() * 60 + now.getMinutes() + NEGOZIO.preavvisoMinuti : 0;
  const out = [];
  for (const [a, b] of NEGOZIO.orari[date.getDay()] || []) {
    for (let m = toMin(a); m + 30 <= toMin(b); m += 30) if (m >= earliest) out.push(`${fromMin(m)}–${fromMin(m + 30)}`);
  }
  return out;
}

let days = [], dayIdx = 0;
function renderDays() {
  days = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  for (let i = 0; days.length < NEGOZIO.giorniPrenotabili && i < 21; i++) {
    const day = new Date(d); day.setDate(d.getDate() + i);
    if (slotsFor(day).length) days.push(day);
  }
  dayIdx = Math.min(dayIdx, days.length - 1);
  const today = new Date().toDateString();
  $("#days").innerHTML = days.map((day, i) => {
    const label = day.toDateString() === today ? "oggi" : GIORNI[day.getDay()].slice(0, 3);
    return `<button type="button" role="radio" class="day" data-day="${i}" aria-checked="${i === dayIdx}" aria-label="${GIORNI[day.getDay()]} ${day.getDate()} ${MESI[day.getMonth()]}"><small>${label}</small><b>${day.getDate()}</b><small>${MESI[day.getMonth()]}</small></button>`;
  }).join("");
  renderSlots();
}
function renderSlots() {
  const s = days[dayIdx] ? slotsFor(days[dayIdx]) : [];
  $("#slot").innerHTML = s.map(x => `<option>${x}</option>`).join("");
}
$("#days").onclick = e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  dayIdx = +b.dataset.day;
  document.querySelectorAll(".day").forEach(x => x.setAttribute("aria-checked", x === b));
  renderSlots();
};

function dayLabel(day) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((day - t) / 864e5);
  const pre = diff === 0 ? "Oggi, " : diff === 1 ? "Domani, " : "";
  return `${pre}${GIORNI[day.getDay()]} ${day.getDate()} ${MESI[day.getMonth()]}`;
}

function makeCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = ""; for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
  return "NB-" + s;
}

$("#book-form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target;
  const err = $("#form-error");
  f.querySelectorAll(".invalid").forEach(x => x.classList.remove("invalid"));
  const nome = $("#nome").value.trim();
  const tel = $("#telefono").value.replace(/[^\d+]/g, "");
  const problems = [];
  if (nome.length < 2) { $("#nome").classList.add("invalid"); problems.push("il nome"); }
  if (tel.replace("+", "").length < 8) { $("#telefono").classList.add("invalid"); problems.push("un cellulare valido"); }
  if (!$("#slot").value) problems.push("un orario di ritiro");
  if (!$("#maggiorenne").checked) { $("#maggiorenne").closest(".check").classList.add("invalid"); problems.push("la conferma della maggiore età"); }
  if (!$("#privacy").checked) { $("#privacy").closest(".check").classList.add("invalid"); problems.push("il consenso ai dati"); }
  if (problems.length) {
    err.textContent = "Manca " + problems.join(", ") + ".";
    err.hidden = false; return;
  }
  err.hidden = true;

  const code = makeCode();
  const day = days[dayIdx];
  const when = `${dayLabel(day)}, ${$("#slot").value}`;
  const righe = bag.map(i => `${i.qty} × ${LIQUIDI.find(l => l.id === i.id).nome} (${itemLabel(i)})`);
  $("#f-giorno").value = dayLabel(day);
  $("#f-prodotti").value = righe.join("; ");
  $("#f-totale").value = euro(bagTotal());
  $("#f-codice").value = code;

  // Su Netlify la prenotazione arriva al negozio (Netlify Forms).
  // Altrove l'invio fallisce e il cliente la manda su WhatsApp.
  const btn = $("#book-submit"); btn.disabled = true; btn.textContent = "Invio in corso…";
  let ricevuta = false;
  try {
    const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(f)).toString() });
    ricevuta = r.ok;
  } catch {}
  btn.disabled = false; btn.textContent = "Conferma prenotazione";

  const msg = [
    `Ciao ${NEGOZIO.nome}! Vorrei prenotare:`, ...righe.map(r => "• " + r),
    `Totale: ${euro(bagTotal())}`, `Ritiro: ${when}`, `Nome: ${nome}`, `Codice: ${code}`,
    $("#note").value.trim() ? `Note: ${$("#note").value.trim()}` : ""
  ].filter(Boolean).join("\n");

  $("#done-name").textContent = nome.split(" ")[0];
  $("#done-lead").textContent = ricevuta
    ? "Abbiamo ricevuto la tua prenotazione. Ti prepariamo tutto e ti aspettiamo in negozio."
    : "Manca un ultimo passo: invia la prenotazione su WhatsApp con il pulsante qui sotto, così il negozio la riceve e te la prepara.";
  $("#done-code").textContent = code;
  $("#done-when").textContent = when;
  $("#done-total").textContent = euro(bagTotal());
  $("#done-list").innerHTML = itemsHTML(bag, false);
  const wa = $("#done-wa");
  wa.href = `https://wa.me/${NEGOZIO.whatsapp}?text=${encodeURIComponent(msg)}`;
  wa.textContent = ricevuta ? "Scrivici su WhatsApp" : "Invia la prenotazione su WhatsApp";
  wa.className = "btn btn--block " + (ricevuta ? "btn--ghost" : "btn--primary");

  store.set("nebbia-ultima", { code, when, nome });
  bag = []; saveBag();
  f.reset();
  $("#bag-view").hidden = true; $("#done-view").hidden = false;
  $("#bag .sheet__panel").scrollTop = 0;
});

$("#copy-code").onclick = async () => {
  const code = $("#done-code").textContent;
  try { await navigator.clipboard.writeText(code); toast("Codice copiato"); }
  catch {
    const r = document.createRange(); r.selectNodeContents($("#done-code"));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    toast("Codice selezionato: copialo");
  }
};
$("#done-new").onclick = () => { closeSheet($("#bag")); location.hash = "#liquidi"; };

/* ---------- Negozio ---------- */
function renderShop() {
  $("#shop-address").textContent = NEGOZIO.indirizzo;
  $("#shop-phone").textContent = NEGOZIO.telefono;
  $("#shop-maps").href = NEGOZIO.mappe;
  $("#shop-wa").href = `https://wa.me/${NEGOZIO.whatsapp}`;
  $("#shop-legal").textContent = NEGOZIO.legale;
  const today = new Date().getDay();
  $("#shop-hours").innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const o = NEGOZIO.orari[d];
    const txt = o && o.length ? o.map(([a, b]) => `${a}–${b}`).join(" · ") : "Chiuso";
    const name = GIORNI[d][0].toUpperCase() + GIORNI[d].slice(1);
    return `<tr class="${d === today ? "today" : ""}"><td>${name}</td><td>${txt}</td></tr>`;
  }).join("");
}

/* ---------- Barra in alto ---------- */
const topbar = $("#topbar");
addEventListener("scroll", () => topbar.classList.toggle("scrolled", scrollY > 8), { passive: true });

/* ---------- Nebbia animata nell'hero ---------- */
(function mist() {
  const cv = $("#mist"); if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, puffs = [], visible = true, raf;
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function size() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = cv.width = r.width * dpr; h = cv.height = r.height * dpr;
  }
  function seed() {
    puffs = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * w, y: h * (.3 + Math.random() * .6), r: (.12 + Math.random() * .22) * Math.max(w, h),
      vx: (Math.random() - .3) * .25, vy: -(.05 + Math.random() * .15), a: .05 + Math.random() * .08, warm: i % 3 === 0
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const A = cssVar("--mist-a"), B = cssVar("--mist-b");
    for (const p of puffs) {
      if (!still) {
        p.x += p.vx; p.y += p.vy;
        if (p.y + p.r < 0) { p.y = h + p.r * .5; p.x = Math.random() * w; }
        if (p.x - p.r > w) p.x = -p.r;
      }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      const c = p.warm ? B : A;
      g.addColorStop(0, `rgba(${c},${p.a})`); g.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!still && visible) raf = requestAnimationFrame(draw);
  }
  size(); seed(); draw();
  addEventListener("resize", () => { size(); seed(); if (still) draw(); });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf); if (visible && !still) draw();
  }).observe(cv);
})();

renderFilters();
renderGrid();
renderBag();
renderShop();
