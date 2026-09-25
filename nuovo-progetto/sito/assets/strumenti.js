/* ==========================================================================
   Gabriel Tech · pannello del tecnico e pagine da stampare
   ========================================================================== */
(() => {
  const C = window.CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const sito = (C.sito && !/example\.com/.test(C.sito) ? C.sito : location.origin).replace(/\/$/, "");
  const LINK = {
    sito: `${sito}/`,
    whatsapp: `https://wa.me/${C.whatsapp}`,
    recensione: `${sito}/recensione.html`,
    collegati: `${sito}/collegati.html`,
    condizioni: `${sito}/condizioni.html`
  };
  const download = (blob, name) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  /* ---------- Codici QR ---------- */
  const qrSvg = (text) => {
    const qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true, alt: `Codice QR: ${text}` });
  };
  if (window.qrcode) {
    $$("[data-qr]").forEach((box) => { box.innerHTML = qrSvg(LINK[box.dataset.qr]); });
  }
  $$("[data-qr-label]").forEach((node) => { node.textContent = LINK[node.dataset.qrLabel].replace(/^https?:\/\//, "").replace(/\/$/, ""); });
  $$("[data-qr-svg]").forEach((btn) => btn.addEventListener("click", () => {
    download(new Blob([qrSvg(LINK[btn.dataset.qrSvg])], { type: "image/svg+xml" }), `qr-${btn.dataset.qrSvg}.svg`);
  }));
  $$("[data-qr-png]").forEach((btn) => btn.addEventListener("click", () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      canvas.toBlob((blob) => download(blob, `qr-${btn.dataset.qrPng}.png`));
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(LINK[btn.dataset.qrPng]))}`;
  }));

  /* ---------- Messaggi pronti ---------- */
  $$("[data-msg]").forEach((area) => {
    area.value = area.value.replace(/\{(\w+)\}/g, (m, key) => LINK[key] || m);
    const box = area.closest(".msg");
    $("[data-copy]", box).addEventListener("click", async (e) => {
      try {
        await navigator.clipboard.writeText(area.value);
      } catch {
        area.select();
        document.execCommand("copy");
      }
      const btn = e.currentTarget;
      const old = btn.lastChild.textContent;
      btn.lastChild.textContent = "Copiato!";
      setTimeout(() => { btn.lastChild.textContent = old; }, 1500);
    });
    $("[data-send]", box).addEventListener("click", () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(area.value)}`, "_blank", "noopener");
    });
  });

  /* ---------- Controllo impostazioni ---------- */
  const checks = $("[data-checks]");
  if (checks) {
    const pay = C.pagamenti || {};
    const payCount = Object.values(pay).filter(Boolean).length;
    const list = [
      [!/000 000 0000|0000000000/.test(`${C.phoneDisplay}${C.whatsapp}`), "Numero di telefono e WhatsApp", "Sostituisci il numero finto con il tuo."],
      [!/example\.com/.test(C.email || "example.com"), "Email", "Sostituisci info@example.com con la tua email."],
      [!/example\.com/.test(C.sito || "example.com"), "Dominio del sito", "Serve per codici QR e messaggi: mettilo quando lo compri."],
      [![C.titolare, C.piva, C.indirizzo, C.anniEsperienza].some((v) => !v || /^\[.*\]$/.test(String(v))), "Dati dell'attività", "Scrivi nome e cognome, P.IVA, indirizzo e anni di esperienza (titolare, piva, indirizzo, anniEsperienza)."],
      [!!C.linkRecensioneGoogle, "Link per le recensioni Google", "Lo trovi nel profilo dell'attività su Google, alla voce «Chiedi recensioni»."],
      [payCount > 0, `Link di pagamento (${payCount} impostati)`, "Crea i link con Stripe, PayPal, SumUp o Satispay."],
      [Array.isArray(C.recensioni) && C.recensioni.length > 0, "Recensioni sul sito", "Aggiungi le prime recensioni vere, con il permesso dei clienti."],
      [!!C.video, "Video di presentazione", "Registra 30 secondi in cui ti presenti."],
      [!!C.canaleWhatsApp, "Canale WhatsApp", "Facoltativo: consigli e allerta truffe per i clienti."],
      [!!C.cloudflareAnalytics, "Statistiche senza cookie", "Facoltativo: token di Cloudflare Web Analytics."],
      [!!C.assistente, "Assistente virtuale", "Facoltativo: prima configura la chiave su Netlify (vedi il piano)."]
    ];
    checks.replaceChildren(...list.map(([ok, title, hint]) => {
      const li = document.createElement("li");
      li.className = ok ? "ok" : "todo";
      li.innerHTML = `<svg class="i"><use href="#i-${ok ? "check" : "alert"}"/></svg>`;
      const text = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = title;
      text.append(b);
      if (!ok) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = hint;
        text.append(p);
      }
      li.append(text);
      return li;
    }));
  }

  /* ---------- Buono regalo ---------- */
  const form = $("[data-voucher-form]");
  if (form) {
    const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // niente 0/O e 1/I, che si confondono
    const newCode = () => {
      const bytes = crypto.getRandomValues(new Uint8Array(8));
      const chars = [...bytes].map((b) => ALFABETO[b % ALFABETO.length]).join("");
      return `GT-${chars.slice(0, 4)}-${chars.slice(4)}`;
    };
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    form.elements.codice.value = newCode();
    form.elements.scadenza.value = expiry.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });

    const render = () => {
      const [price, label] = form.elements.tipo.value.split("|");
      if (price) form.elements.importo.value = price;
      form.elements.importo.readOnly = !!price;
      const values = {
        per: form.elements.per.value || "…",
        da: form.elements.da.value || "…",
        importo: form.elements.importo.value || "…",
        tipo: label,
        messaggio: form.elements.messaggio.value,
        codice: form.elements.codice.value,
        scadenza: form.elements.scadenza.value
      };
      $$("[data-v]").forEach((node) => { node.textContent = values[node.dataset.v]; });
    };
    form.addEventListener("input", render);
    $("[data-new-code]").addEventListener("click", () => { form.elements.codice.value = newCode(); render(); });
    render();
  }

  $$("[data-print]").forEach((btn) => btn.addEventListener("click", () => window.print()));
})();
