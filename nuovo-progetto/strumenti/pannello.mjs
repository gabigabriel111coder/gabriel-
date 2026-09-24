/* ==========================================================================
   Pannello del tecnico: messaggi pronti, codici QR, controllo impostazioni
   e materiali da stampare (volantino, biglietto da visita, buono regalo).
   Pagine private: non compaiono su Google (noindex + robots.txt).
   ========================================================================== */
const MESSAGGI = [
  ["Benvenuto", "Ciao! Sono [Nome] di Gabriel Tech, assistenza informatica da remoto. Raccontami in breve il problema e che dispositivo usi (PC Windows, Mac, telefono): ti dico subito se posso risolverlo a distanza e quanto costa."],
  ["Fuori orario", "Grazie del messaggio! In questo momento non sono disponibile: ti rispondo appena torno, negli orari indicati sul sito. Se è urgente, scrivilo nel messaggio."],
  ["Preventivo e condizioni", "Si risolve da remoto. Prezzo: [25/45] €, tempo stimato: [X] minuti. Se non riesco a risolvere, non paghi. Le condizioni sono qui: {condizioni}\nChiedendomi di iniziare subito accetti che, a lavoro completato, non si applica il diritto di recesso. Se va bene, rispondi «Accetto» e ci colleghiamo."],
  ["Istruzioni AnyDesk", "Per collegarci segui questa guida, ci vogliono 2 minuti: {collegati}\nPoi dimmi il numero che vedi sotto «Il tuo indirizzo» e premi «Accetta» quando arriva la mia richiesta. Vedrai tutto quello che faccio e potrai chiudere quando vuoi."],
  ["Conferma appuntamento", "Ciao [Nome]! Confermo l'appuntamento di [giorno] alle [ora]. Qualche minuto prima tieni pronto AnyDesk: {collegati}\nA presto!"],
  ["Promemoria", "Ciao [Nome], ti ricordo il nostro appuntamento di oggi alle [ora]. Tieni il computer acceso e AnyDesk aperto. Se hai un imprevisto, scrivimi pure."],
  ["Dopo l'intervento", "Fatto! Ecco il link per il pagamento: [link]. Ti arriverà la fattura via email. Se ti sono stato utile, una recensione mi aiuta tantissimo: {recensione}\nGrazie!"],
  ["Richiesta recensione", "Ciao [Nome], com'è andata con il computer in questi giorni? Se sei soddisfatto, mi lasceresti due righe su Google? Ci vuole un minuto: {recensione}\nGrazie mille!"]
];

export function paginePannello({ page, icon, esc }) {
  const scripts = ["assets/vendor/qrcode.js", "assets/strumenti.js"];
  const bar = (title, note) => `
<div class="print-bar no-print">
  <a class="btn btn--ghost btn--sm" href="index.html">← Pannello</a>
  <button class="btn btn--primary btn--sm" type="button" data-print>Stampa o salva PDF</button>
  <p class="muted"><b>${title}.</b> ${note}</p>
</div>`;

  page({
    path: "tecnico/index.html",
    title: "Pannello del tecnico · Gabriel Tech",
    description: "Strumenti di lavoro di Gabriel Tech.",
    noindex: true,
    scripts,
    bodyAttrs: " data-no-3d data-no-assistant",
    body: () => `
<section class="page-hero wrap">
  <h1>Pannello del tecnico</h1>
  <p class="lead">Gli strumenti per il lavoro di ogni giorno. Questa pagina non compare su Google: salvala nei preferiti.</p>
  <p class="callout callout--warn narrow-left">Non è protetta da password: non scriverci mai dati dei clienti.</p>
</section>

<section class="section section--tight wrap">
  <div class="card glass">
    <h2>Controllo impostazioni</h2>
    <p class="muted">Cosa manca in <code>assets/config.js</code> prima di pubblicare.</p>
    <ul class="checks" data-checks></ul>
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head"><h2>Messaggi pronti</h2><p>Modifica le parti tra [parentesi quadre], poi copia o apri WhatsApp e scegli il cliente.</p></div>
  <div class="msgs">
    ${MESSAGGI.map(([t, m], i) => `<div class="msg glass">
      <h3>${t}</h3>
      <label class="sr-only" for="msg-${i}">${t}</label>
      <textarea id="msg-${i}" data-msg>${esc(m)}</textarea>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--ghost btn--xs" type="button" data-copy>${icon("copy")}Copia</button>
        <button class="btn btn--wa btn--xs" type="button" data-send>${icon("chat")}Apri WhatsApp</button>
      </div>
    </div>`).join("\n    ")}
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head"><h2>Codici QR</h2><p>Da mettere su volantini, biglietti, fatture o sulla vetrina di un negozio amico.</p></div>
  <div class="qrs">
    ${[["sito", "Il sito"], ["whatsapp", "Chat WhatsApp"], ["recensione", "Lascia una recensione"], ["collegati", "Guida AnyDesk"]].map(([k, t]) => `<div class="qr-card glass">
      <h3>${t}</h3>
      <div data-qr="${k}"></div>
      <p data-qr-label="${k}"></p>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--ghost btn--xs" type="button" data-qr-png="${k}">PNG</button>
        <button class="btn btn--ghost btn--xs" type="button" data-qr-svg="${k}">SVG</button>
      </div>
    </div>`).join("\n    ")}
  </div>
</section>

<section class="section section--tight wrap">
  <div class="head"><h2>Da stampare</h2><p>Si aprono pronti per la stampa: scegli «Salva come PDF» per mandarli in tipografia.</p></div>
  <div class="cards">
    <a class="card-sm glass" href="volantino.html"><span class="ico ico--blue">${icon("printer")}</span><h3>Volantino A5</h3><p>Servizi, prezzi, telefono e codice QR del sito.</p></a>
    <a class="card-sm glass" href="biglietto.html"><span class="ico ico--indigo">${icon("id")}</span><h3>Biglietto da visita</h3><p>Fronte con il logo, retro con contatti e codice QR.</p></a>
    <a class="card-sm glass" href="buono.html"><span class="ico ico--pink">${icon("gift")}</span><h3>Buono regalo</h3><p>Scrivi nome e importo: codice e scadenza si creano da soli.</p></a>
  </div>
</section>`
  });

  page({
    path: "tecnico/volantino.html",
    title: "Volantino · Gabriel Tech",
    description: "Volantino A5 da stampare.",
    noindex: true, chrome: false, scripts,
    bodyAttrs: ' class="print-page" data-no-3d data-no-assistant',
    body: () => `${bar("Volantino A5", "Nella finestra di stampa scegli il formato A5 e margini «Nessuno».")}
<div class="sheets">
  <article class="sheet sheet--a5 flyer">
    <header class="flyer__top"><svg class="flyer__logo"><use href="#logo-mark"/></svg><span class="brand__name">Gabriel <b>Tech</b></span></header>
    <h1>Il tuo computer,<br><span class="grad">sistemato a distanza.</span></h1>
    <p class="flyer__lead">Assistenza informatica da remoto per privati e piccole attività. Mi collego al tuo PC in sicurezza, risolvo il problema mentre guardi e paghi solo a lavoro finito.</p>
    <ul class="flyer__list">
      <li>${icon("gauge")}PC lento e virus</li>
      <li>${icon("up")}Windows 11</li>
      <li>${icon("mail")}Email e PEC</li>
      <li>${icon("id")}SPID e CIE</li>
      <li>${icon("printer")}Stampanti e Wi-Fi</li>
      <li>${icon("mobile")}Smartphone e lezioni</li>
    </ul>
    <div class="flyer__price"><small>Interventi da</small><b>25 €</b><small>Se non risolvo, non paghi</small></div>
    <footer class="flyer__bottom">
      <div class="flyer__qr" data-qr="sito"></div>
      <div>
        <p class="flyer__cta">Inquadra il codice o scrivimi su WhatsApp</p>
        <p class="flyer__phone" data-phone>+39 000 000 0000</p>
        <p class="flyer__site" data-qr-label="sito"></p>
      </div>
    </footer>
  </article>
</div>`
  });

  page({
    path: "tecnico/biglietto.html",
    title: "Biglietto da visita · Gabriel Tech",
    description: "Biglietto da visita da stampare.",
    noindex: true, chrome: false, scripts,
    bodyAttrs: ' class="print-page" data-no-3d data-no-assistant',
    body: () => `${bar("Biglietto da visita 85 × 55 mm", "Due pagine: fronte e retro. In tipografia chiedi la stampa fronte-retro.")}
<div class="sheets">
  <article class="sheet sheet--card card-front">
    <svg><use href="#logo-mark"/></svg>
    <span class="brand__name">Gabriel <b>Tech</b></span>
    <small>Assistenza informatica da remoto</small>
  </article>
  <article class="sheet sheet--card card-back">
    <div>
      <h2>[Nome Cognome]</h2>
      <p class="role">Tecnico informatico</p>
      <p><span data-phone>+39 000 000 0000</span><br><span data-email>info@example.com</span><br><span data-qr-label="sito"></span></p>
    </div>
    <div data-qr="sito"></div>
  </article>
</div>`
  });

  page({
    path: "tecnico/buono.html",
    title: "Buono regalo · Gabriel Tech",
    description: "Crea un buono regalo da stampare.",
    noindex: true, chrome: false, scripts,
    bodyAttrs: ' class="print-page" data-no-3d data-no-assistant',
    body: () => `${bar("Buono regalo A5", "Compila i campi: l'anteprima si aggiorna da sola. Annota codice e scadenza nel tuo registro, il sito non li salva.")}
<div class="builder no-print">
  <form class="card glass" data-voucher-form>
    <div class="row">
      <div class="field"><label for="v-per">Per</label><input id="v-per" name="per" placeholder="Mamma" maxlength="40"></div>
      <div class="field"><label for="v-da">Da</label><input id="v-da" name="da" placeholder="Luca" maxlength="40"></div>
    </div>
    <div class="row">
      <div class="field">
        <label for="v-tipo">Buono</label>
        <select id="v-tipo" name="tipo">
          <option value="25|Intervento Rapido · fino a 30 minuti">Rapido · 25 €</option>
          <option value="45|Intervento Completo · fino a 60 minuti" selected>Completo · 45 €</option>
          <option value="179|Pacchetto 5 ore · da usare in più volte">5 ore · 179 €</option>
          <option value="|Assistenza informatica da remoto">Importo libero</option>
        </select>
      </div>
      <div class="field"><label for="v-importo">Importo (€)</label><input id="v-importo" name="importo" type="number" min="5" step="5" value="45"></div>
    </div>
    <div class="field"><label for="v-msg">Messaggio <span>(facoltativo)</span></label><textarea id="v-msg" name="messaggio" maxlength="140" rows="2" placeholder="Così la prossima volta non devi aspettare me!"></textarea></div>
    <div class="row">
      <div class="field"><label for="v-codice">Codice</label><input id="v-codice" name="codice" readonly></div>
      <div class="field"><label for="v-scad">Scadenza</label><input id="v-scad" name="scadenza"></div>
    </div>
    <div class="cta-row cta-row--tight"><button class="btn btn--ghost btn--sm" type="button" data-new-code>Nuovo codice</button></div>
  </form>
</div>
<div class="sheets">
  <article class="sheet sheet--a5l voucher-print">
    <div class="vp__left">
      <div class="vp__brand"><svg><use href="#logo-mark"/></svg><span class="brand__name">Gabriel <b>Tech</b></span></div>
      <p class="vp__kicker">Buono regalo</p>
      <p class="vp__amount"><span data-v="importo">45</span> €</p>
      <p class="vp__type" data-v="tipo">Intervento Completo · fino a 60 minuti</p>
    </div>
    <div class="vp__right">
      <div class="vp__row"><small>Per</small><b data-v="per">Mamma</b></div>
      <div class="vp__row"><small>Da</small><b data-v="da">Luca</b></div>
      <p class="vp__msg" data-v="messaggio"></p>
      <div class="vp__code">
        <div class="vp__row"><small>Codice</small><b data-v="codice"></b></div>
        <div class="vp__row"><small>Valido fino al</small><b data-v="scadenza"></b></div>
      </div>
      <div class="vp__foot">
        <div data-qr="whatsapp"></div>
        <p>Per usarlo scrivimi su WhatsApp al <b data-phone>+39 000 000 0000</b> indicando il codice. Assistenza da remoto in tutta Italia.</p>
      </div>
    </div>
  </article>
</div>`
  });
}
