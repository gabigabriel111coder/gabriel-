/* ==========================================================================
   Pannello del tecnico: gestionale delle richieste, monitoraggio dei PC,
   messaggi pronti, codici QR, controllo impostazioni e materiali da stampare.
   Pagine private: non compaiono su Google (noindex + robots.txt). I dati dei
   clienti non stanno nelle pagine: arrivano dalle funzioni di Netlify solo con
   la chiave di accesso (ADMIN_TOKEN).
   ========================================================================== */
const MESSAGGI = [
  ["Benvenuto", "Ciao! Sono [Nome] di Gabriel Tech, assistenza informatica da remoto. Raccontami in breve il problema e che dispositivo usi (PC Windows, Mac, telefono): ti dico subito se posso risolverlo a distanza e quanto costa."],
  ["Fuori orario", "Grazie del messaggio! In questo momento non sono disponibile: ti rispondo appena torno, negli orari indicati sul sito. Se è urgente, scrivilo nel messaggio."],
  ["Preventivo e condizioni", "Si risolve da remoto. Prezzo: [{{p.rapido}}/{{p.completo}}] €, tempo stimato: [X] minuti. Se non riesco a risolvere, non paghi. Le condizioni sono qui: {condizioni}\nChiedendomi di iniziare subito accetti che, a lavoro completato, non si applica il diritto di recesso. Se va bene, rispondi «Accetto» e ci colleghiamo."],
  ["Istruzioni AnyDesk", "Per collegarci segui questa guida, ci vogliono 2 minuti: {collegati}\nPoi dimmi il numero che vedi sotto «Il tuo indirizzo» e premi «Accetta» quando arriva la mia richiesta. Vedrai tutto quello che faccio e potrai chiudere quando vuoi."],
  ["Conferma appuntamento", "Ciao [Nome]! Confermo l'appuntamento di [giorno] alle [ora]. Qualche minuto prima tieni pronto AnyDesk: {collegati}\nA presto!"],
  ["Promemoria", "Ciao [Nome], ti ricordo il nostro appuntamento di oggi alle [ora]. Tieni il computer acceso e AnyDesk aperto. Se hai un imprevisto, scrivimi pure."],
  ["Dopo l'intervento", "Fatto! Ecco il link per il pagamento: [link]. Ti arriverà la fattura via email. Se ti sono stato utile, una recensione mi aiuta tantissimo: {recensione}\nGrazie!"],
  ["Richiesta recensione", "Ciao [Nome], com'è andata con il computer in questi giorni? Se sei soddisfatto, mi lasceresti due righe su Google? Ci vuole un minuto: {recensione}\nGrazie mille!"]
];

export function paginePannello({ page, icon, esc }) {
  const scripts = ["assets/vendor/qrcode.js", "assets/strumenti.js"];
  const accesso = `
  <div class="card glass access" data-access>
    <div data-access-out>
      <h2>Accesso</h2>
      <p class="muted">Scrivi la chiave di accesso che hai impostato su Netlify come <code>ADMIN_TOKEN</code>. Resta salvata solo su questo dispositivo.</p>
      <form class="idform" data-access-form>
        <label class="sr-only" for="adm-key">Chiave di accesso</label>
        <input id="adm-key" type="password" autocomplete="current-password" placeholder="Chiave di accesso" required minlength="24">
        <button class="btn btn--primary" type="submit">Entra</button>
      </form>
      <p class="form__status" role="status" aria-live="polite" data-access-status></p>
      <details class="access__help">
        <summary>Non hai ancora una chiave?</summary>
        <p class="muted">Creane una lunga e casuale con il pulsante, copiala in Netlify (Site configuration → Environment variables → <code>ADMIN_TOKEN</code>), ripubblica il sito e poi incollala qui.</p>
        <div class="cta-row cta-row--tight"><button class="btn btn--ghost btn--xs" type="button" data-gen-key>${icon("key")}Genera una chiave sicura</button></div>
        <p><code class="access__key" data-gen-out></code></p>
      </details>
    </div>
    <div class="access__in" data-access-in hidden>
      <p>${icon("check")}Collegato al gestionale.</p>
      <button class="btn btn--ghost btn--xs" type="button" data-logout>Esci da questo dispositivo</button>
    </div>
  </div>`;
  const menu = (attiva) => `
  <nav class="panel-nav" aria-label="Pannello">
    ${[["index.html", "Strumenti"], ["richieste.html", "Richieste"], ["monitoraggio.html", "Monitoraggio"]].map(([h, t]) => `<a href="${h}"${h === attiva ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
  </nav>`;
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
    traduci: false,
    scripts: [...scripts, "assets/gestionale.js"],
    bodyAttrs: " data-no-3d data-no-assistant",
    body: () => `
<section class="page-hero wrap">
  ${menu("index.html")}
  <h1>Pannello del tecnico</h1>
  <p class="lead">Gli strumenti per il lavoro di ogni giorno. Queste pagine non compaiono su Google: salvale nei preferiti.</p>
</section>

<section class="section section--tight wrap">
  <div class="cards">
    <a class="card-sm glass" href="richieste.html"><span class="ico ico--blue">${icon("calendar")}</span><h3>Richieste e appuntamenti</h3><p>Conferma gli appuntamenti: conferma, promemoria e richiesta di recensione partono da soli.</p></a>
    <a class="card-sm glass" href="monitoraggio.html"><span class="ico ico--green">${icon("shield")}</span><h3>Monitoraggio dei PC</h3><p>Lo stato dei computer degli abbonati, con avvisi su Telegram quando qualcosa non va.</p></a>
  </div>
</section>

<section class="section section--tight wrap">
  ${accesso}
</section>

<section class="section section--tight wrap">
  <div class="cols2">
    <div class="card glass">
      <h2>Controllo impostazioni</h2>
      <p class="muted">Cosa manca in <code>assets/config.js</code> prima di pubblicare.</p>
      <ul class="checks" data-checks></ul>
    </div>
    <div class="card glass">
      <h2>Servizi collegati</h2>
      <p class="muted">Cosa è attivo su Netlify. Visibile dopo l'accesso.</p>
      <ul class="checks" data-services><li class="todo"><svg class="i"><use href="#i-alert"/></svg><div><b>Accedi per vedere lo stato</b></div></li></ul>
      <div class="cta-row cta-row--tight" data-test-box hidden>
        <button class="btn btn--ghost btn--xs" type="button" data-test="telegram">Prova Telegram</button>
        <button class="btn btn--ghost btn--xs" type="button" data-test="email">Prova email</button>
        <button class="btn btn--ghost btn--xs" type="button" data-test="whatsapp">Prova WhatsApp</button>
      </div>
      <p class="form__status" role="status" aria-live="polite" data-test-status></p>
    </div>
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
    noindex: true, traduci: false, chrome: false, scripts,
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
    <div class="flyer__price"><small>Interventi da</small><b>{{p.rapido}} €</b><small>Se non risolvo, non paghi</small></div>
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
    noindex: true, traduci: false, chrome: false, scripts,
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
      <h2>{{cfg.titolare}}</h2>
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
    noindex: true, traduci: false, chrome: false, scripts,
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
          <option value="{{pn.rapido}}|Intervento Rapido · fino a 30 minuti">Rapido · {{p.rapido}} €</option>
          <option value="{{pn.completo}}|Intervento Completo · fino a 60 minuti" selected>Completo · {{p.completo}} €</option>
          <option value="{{pn.pacchetto5}}|Pacchetto 5 ore · da usare in più volte">5 ore · {{p.pacchetto5}} €</option>
          <option value="|Assistenza informatica da remoto">Importo libero</option>
        </select>
      </div>
      <div class="field"><label for="v-importo">Importo (€)</label><input id="v-importo" name="importo" type="number" min="5" step="any" value="{{pn.completo}}"></div>
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
      <p class="vp__amount"><span data-v="importo">{{p.completo}}</span> €</p>
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

  page({
    path: "tecnico/richieste.html",
    title: "Richieste e appuntamenti · Gabriel Tech",
    description: "Gestionale delle richieste di Gabriel Tech.",
    noindex: true,
    traduci: false,
    scripts: ["assets/strumenti.js", "assets/gestionale.js"],
    bodyAttrs: " data-no-3d data-no-assistant",
    body: () => `
<section class="page-hero wrap">
  ${menu("richieste.html")}
  <h1>Richieste e appuntamenti</h1>
  <p class="lead">Le richieste arrivano qui dai moduli del sito. Confermi l'appuntamento e al resto pensa il sito: conferma subito, promemoria qualche ora prima e, il giorno dopo l'intervento, la richiesta di recensione.</p>
</section>

<section class="section section--tight wrap">
  ${accesso}
  <div class="gest" data-need-access hidden>
    <div class="toolbar">
      <div class="filters" role="group" aria-label="Mostra">
        <button type="button" class="pick" data-filter="aperte" aria-pressed="true">Da gestire</button>
        <button type="button" class="pick" data-filter="confermata" aria-pressed="false">Appuntamenti</button>
        <button type="button" class="pick" data-filter="completata" aria-pressed="false">Completate</button>
        <button type="button" class="pick" data-filter="tutte" aria-pressed="false">Tutte</button>
      </div>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--ghost btn--sm" type="button" data-refresh>Aggiorna</button>
        <button class="btn btn--primary btn--sm" type="button" data-new-toggle>${icon("calendar")}Nuova voce</button>
      </div>
    </div>

    <form class="form card glass" data-new-form hidden>
      <h2>Nuova voce</h2>
      <p class="muted">Per i clienti che ti hanno scritto su WhatsApp o chiamato: così ricevono anche loro conferma, promemoria e richiesta di recensione.</p>
      <div class="row">
        <div class="field"><label for="n-nome">Nome</label><input id="n-nome" name="nome" required maxlength="60"></div>
        <div class="field"><label for="n-tel">Telefono</label><input id="n-tel" name="telefono" type="tel" required pattern="[0-9+ ]{6,20}"></div>
      </div>
      <div class="row">
        <div class="field"><label for="n-email">Email <span>(facoltativa)</span></label><input id="n-email" name="email" type="email" maxlength="100"></div>
        <div class="field"><label for="n-lingua">Lingua</label><select id="n-lingua" name="lingua"><option value="it">Italiano</option><option value="en">Inglese</option></select></div>
      </div>
      <div class="field"><label for="n-note">Problema o note</label><textarea id="n-note" name="messaggio" rows="2" maxlength="800"></textarea></div>
      <div class="field"><label for="n-app">Appuntamento <span>(facoltativo, ora italiana)</span></label><input id="n-app" name="appuntamento" type="datetime-local"></div>
      <label class="check"><input type="checkbox" name="aggiornamenti" value="si"><span>Il cliente ha accettato di ricevere su WhatsApp conferma, promemoria e richiesta di recensione.</span></label>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--primary" type="submit">Salva</button>
        <button class="btn btn--ghost" type="button" data-new-toggle>Annulla</button>
      </div>
      <p class="form__status" role="status" aria-live="polite" data-new-status></p>
    </form>

    <p class="form__status" role="status" aria-live="polite" data-list-status></p>
    <div class="req-list" data-list></div>
    <p class="muted empty" data-empty hidden>Nessuna richiesta in questa lista.</p>
  </div>
</section>`
  });

  page({
    path: "tecnico/monitoraggio.html",
    title: "Monitoraggio dei PC · Gabriel Tech",
    description: "Monitoraggio dei computer degli abbonati di Gabriel Tech.",
    noindex: true,
    traduci: false,
    scripts: ["assets/strumenti.js", "assets/gestionale.js"],
    bodyAttrs: " data-no-3d data-no-assistant",
    body: () => `
<section class="page-hero wrap">
  ${menu("monitoraggio.html")}
  <h1>Monitoraggio dei PC</h1>
  <p class="lead">Un piccolo programma, in sola lettura, invia ogni giorno lo stato dei computer degli abbonati. Se qualcosa non va, ti arriva un avviso su Telegram. Non legge file personali e non permette di controllare il PC.</p>
</section>

<section class="section section--tight wrap">
  ${accesso}
  <div class="gest" data-need-access hidden>
    <div class="toolbar">
      <p class="muted" data-mon-summary></p>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--ghost btn--sm" type="button" data-refresh>Aggiorna</button>
        <button class="btn btn--primary btn--sm" type="button" data-add-toggle>${icon("monitor")}Aggiungi un PC</button>
      </div>
    </div>

    <form class="form card glass" data-add-form hidden>
      <h2>Aggiungi un PC</h2>
      <p class="muted">Solo con il consenso del cliente. Dopo il salvataggio ti mostro le istruzioni di installazione, da seguire durante una sessione AnyDesk.</p>
      <div class="row">
        <div class="field"><label for="d-nome">Cliente e computer</label><input id="d-nome" name="nome" required maxlength="60" placeholder="Es. Studio Rossi · PC reception"></div>
        <div class="field"><label for="d-backup">Cartella del backup <span>(facoltativa)</span></label><input id="d-backup" name="backup" maxlength="200" placeholder="Es. E:\\Backup"></div>
      </div>
      <div class="cta-row cta-row--tight">
        <button class="btn btn--primary" type="submit">Crea e mostra le istruzioni</button>
        <button class="btn btn--ghost" type="button" data-add-toggle>Annulla</button>
      </div>
      <p class="form__status" role="status" aria-live="polite" data-add-status></p>
    </form>

    <div class="card glass install" data-install hidden>
      <h2>Istruzioni di installazione · <span data-install-name></span></h2>
      <div class="cols2">
        <div>
          <h3>Windows</h3>
          <ol class="howto">
            <li><div><b>Scarica lo script sul PC del cliente</b><p><a href="../agent/gabrieltech-monitor.ps1" download>gabrieltech-monitor.ps1</a>, nella cartella Download.</p></div></li>
            <li><div><b>Apri PowerShell come amministratore</b><p>Tasto destro su Start → «Terminale (amministratore)» o «Windows PowerShell (amministratore)».</p></div></li>
            <li><div><b>Incolla questo comando e premi Invio</b><p>Il primo controllo parte subito: dopo un minuto il PC compare qui.</p></div></li>
          </ol>
          <pre class="cmd"><code data-cmd="win"></code></pre>
          <button class="btn btn--ghost btn--xs" type="button" data-copy-cmd="win">${icon("copy")}Copia il comando</button>
        </div>
        <div>
          <h3>Mac</h3>
          <ol class="howto">
            <li><div><b>Scarica lo script sul Mac del cliente</b><p><a href="../agent/gabrieltech-monitor.sh" download>gabrieltech-monitor.sh</a>, nella cartella Download.</p></div></li>
            <li><div><b>Apri il Terminale</b><p>Da Launchpad o con Spotlight (Cmd + Spazio, scrivi «Terminale»).</p></div></li>
            <li><div><b>Incolla questo comando e premi Invio</b><p>Chiede la password del Mac: la scrive il cliente.</p></div></li>
          </ol>
          <pre class="cmd"><code data-cmd="mac"></code></pre>
          <button class="btn btn--ghost btn--xs" type="button" data-copy-cmd="mac">${icon("copy")}Copia il comando</button>
        </div>
      </div>
      <p class="callout">Per togliere il monitoraggio basta premere «Rimuovi» qui sotto: al controllo successivo il programma si disinstalla da solo. In alternativa, sul PC: <code>powershell -ExecutionPolicy Bypass -File "$env:ProgramData\\GabrielTech\\monitor.ps1" -Uninstall</code> (Windows) oppure <code>sudo bash "/Library/Application Support/GabrielTech/monitor.sh" uninstall</code> (Mac).</p>
    </div>

    <p class="form__status" role="status" aria-live="polite" data-list-status></p>
    <div class="dev-list" data-devices></div>
    <p class="muted empty" data-empty hidden>Nessun PC monitorato. Aggiungi il primo con il pulsante in alto.</p>
  </div>
</section>`
  });
}
