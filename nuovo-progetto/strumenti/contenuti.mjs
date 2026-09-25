/* ==========================================================================
   Testi delle pagine dei servizi e delle guide.
   Dopo una modifica rigenera le pagine con:  node strumenti/genera-pagine.mjs
   ========================================================================== */

export const SERVIZI = [
  {
    slug: "pc-lento", titolo: "PC lento o bloccato", icona: "gauge", colore: "blue",
    h1: "PC lento o bloccato? Lo rimetto in forma da remoto.",
    pacchetto: "Completo", durata: "fino a 60 minuti",
    descrizione: "PC lento, che si blocca o ci mette minuti ad accendersi? Pulizia, ottimizzazione e controllo virus da remoto con AnyDesk. {{p.completo}} €, se non risolvo non paghi.",
    lead: "Avvio lentissimo, programmi che si bloccano, ventola sempre accesa: mi collego al tuo computer, trovo la causa e lo sistemo mentre guardi.",
    sintomi: ["Ci mette minuti ad accendersi", "Programmi e browser si bloccano", "Ventola sempre accesa e disco al 100%", "Messaggi di spazio quasi pieno"],
    cosa: ["Pulizia di file inutili e temporanei", "Disattivo i programmi inutili all'avvio", "Controllo virus, estensioni e software indesiderato", "Aggiornamenti di sistema e driver", "Controllo della salute del disco, e ti dico se conviene un SSD"],
    limiti: "Se il disco è guasto o il PC ha bisogno di più memoria o di un SSD, serve un tecnico sul posto: ti dico con onestà se ne vale la pena.",
    faq: [
      ["Quanto migliora il PC?", "Dipende dalla causa: spesso la differenza si nota subito, soprattutto all'accensione. Se il limite è l'hardware te lo dico prima, senza farti spendere."],
      ["Perdo i miei file?", "No. Non cancello documenti, foto o programmi che usi. Prima degli interventi importanti controlliamo insieme che ci sia un backup."]
    ],
    correlati: ["guide/pc-lento", "servizi/virus", "servizi/windows-11"]
  },
  {
    slug: "virus", titolo: "Virus, pop-up e finti avvisi", icona: "bug", colore: "red",
    h1: "Virus, pop-up e finti avvisi: li rimuovo da remoto.",
    pacchetto: "Completo", durata: "fino a 60 minuti",
    descrizione: "Rimozione di virus, malware, pop-up e finti avvisi da remoto. Pulizia del browser e messa in sicurezza degli account dopo una truffa. {{p.completo}} €.",
    lead: "Pubblicità che si aprono da sole, avvisi di «virus rilevato», programmi che non hai installato tu: li tolgo e rimetto in sicurezza il computer e i tuoi account.",
    sintomi: ["Finestre e pubblicità che si aprono da sole", "Il browser apre pagine strane", "Avvisi di «virus rilevato» con un numero da chiamare", "Hai dato accesso al PC a uno sconosciuto"],
    cosa: ["Scansione completa e rimozione di malware e adware", "Pulizia del browser e delle estensioni sospette", "Rimozione dei programmi di controllo remoto installati da altri", "Antivirus attivo e aggiornamenti in regola", "Messa in sicurezza degli account principali"],
    limiti: "Se hai dato dati bancari o codici a un truffatore, chiama subito la tua banca: viene prima di tutto il resto.",
    faq: [
      ["Mi è comparso un avviso con un numero da chiamare: cosa faccio?", "Non chiamare. È una pagina truffa: chiudi il browser, anche da Gestione attività, e scrivimi. Microsoft e le banche non mettono mai numeri di telefono negli avvisi."],
      ["Devo comprare un antivirus?", "Spesso basta la protezione già inclusa in Windows, configurata bene. Se ti serve altro te lo dico prima, e scegli tu."]
    ],
    correlati: ["guide/finto-tecnico", "servizi/account-password", "servizi/pc-lento"]
  },
  {
    slug: "windows-11", titolo: "Windows 11 e aggiornamenti", icona: "up", colore: "indigo",
    h1: "Passa a Windows 11, o metti in sicurezza Windows 10.",
    pacchetto: "Completo", durata: "circa 60 minuti di lavoro",
    nota: "Se l'installazione è lunga, il PC lavora da solo: ti avviso io quando ha finito.",
    descrizione: "Windows 10 non è più supportato: passaggio a Windows 11 senza perdere dati, oppure aggiornamenti di sicurezza estesi (ESU). Assistenza da remoto, {{p.completo}} €.",
    lead: "Windows 10 non riceve più gli aggiornamenti normali. Verifico se il tuo PC può passare a Windows 11 e lo aggiorno senza perdere nulla; se non si può, lo mettiamo comunque in sicurezza.",
    sintomi: ["Il PC ti avvisa che Windows 10 non è più supportato", "Gli aggiornamenti si bloccano o danno errore", "Non sai se il PC può passare a Windows 11", "Spazio insufficiente per aggiornare"],
    cosa: ["Verifico se il PC è compatibile con Windows 11", "Backup dei tuoi file prima di iniziare", "Aggiornamento a Windows 11 senza perdere dati e programmi", "Se non è compatibile, attivo gli aggiornamenti di sicurezza estesi (ESU)", "Sistemo gli aggiornamenti bloccati"],
    faq: [
      ["Il mio PC è troppo vecchio per Windows 11?", "Lo verifichiamo insieme in pochi minuti. Se non è compatibile ti spiego le alternative, senza spingerti a comprare un PC nuovo."],
      ["Perdo programmi e file?", "No: l'aggiornamento mantiene file e programmi. Per sicurezza facciamo comunque un backup prima."]
    ],
    correlati: ["guide/windows-10", "servizi/backup-foto", "servizi/pc-lento"]
  },
  {
    slug: "email-pec", titolo: "Email, PEC e Outlook", icona: "mail", colore: "sky",
    h1: "Email e PEC che funzionano, su PC e telefono.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    descrizione: "Configurazione di email e PEC su Outlook, PC e smartphone, caselle piene, messaggi che non partono. Assistenza da remoto, {{p.rapido}} €.",
    lead: "Posta che non parte, casella piena, PEC da configurare su Outlook o sul telefono: sistemo tutto da remoto e ti lascio una casella in ordine.",
    sintomi: ["Le email non partono o non arrivano", "La casella è piena", "Devi configurare la PEC su Outlook o sul telefono", "Telefono nuovo e la posta non si sincronizza"],
    cosa: ["Configurazione delle caselle più diffuse su PC e telefono", "Configurazione della PEC", "Pulizia e archiviazione della casella piena", "Firme, cartelle e regole automatiche", "Protezione dalle email truffa (phishing)"],
    faq: [
      ["Mi aiuti anche ad aprire una PEC?", "Sì: ti guido nella scelta e nell'attivazione con il gestore che preferisci, poi la configuriamo insieme."],
      ["Ti serve la mia password?", "La scrivi tu mentre guardo: non te la chiedo e non la salvo."]
    ],
    correlati: ["servizi/account-password", "guide/finto-tecnico", "servizi/smartphone"]
  },
  {
    slug: "spid-cie", titolo: "SPID, CIE e servizi pubblici online", icona: "id", colore: "green",
    h1: "SPID, CIE e servizi online: ti guido passo passo.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    nota: "Per una richiesta completa dello SPID a volte serve l'intervento Completo: te lo dico prima.",
    descrizione: "Aiuto per SPID, CIE, app IO, INPS, Agenzia delle Entrate, Fascicolo sanitario e pagoPA. Assistenza da remoto con calma, da {{p.rapido}} €.",
    lead: "Richiedere lo SPID, attivare la CIE, entrare su INPS o sul Fascicolo sanitario: ti accompagno passo passo, con calma, finché non riesci da solo.",
    sintomi: ["Devi richiedere lo SPID o attivare la CIE", "Non riesci ad accedere a INPS, Agenzia delle Entrate o Fascicolo sanitario", "Hai cambiato telefono e l'app non funziona più", "Hai dimenticato password o codici"],
    cosa: ["Ti guido nella richiesta dello SPID o nell'attivazione della CIE", "Installo e configuro le app (IO, CieID, app del gestore)", "Recupero degli accessi con le procedure ufficiali", "Ti accompagno su INPS, Agenzia delle Entrate, Fascicolo sanitario e pagoPA", "Ti insegno a farlo da solo la prossima volta"],
    limiti: "Il riconoscimento dell'identità lo fai tu con il gestore: io ti preparo e ti guido. Le password le scrivi sempre tu.",
    faq: [
      ["Meglio SPID o CIE?", "Con entrambi accedi ai servizi pubblici online. Se hai già la Carta d'Identità Elettronica, spesso è la strada più veloce: valutiamo insieme."],
      ["Mi è arrivato un SMS che dice che lo SPID scade: è vero?", "Attenzione: è una truffa molto diffusa. Non cliccare il link: scrivimi e controlliamo insieme sul sito ufficiale del tuo gestore."]
    ],
    correlati: ["guide/spid", "servizi/smartphone", "servizi/email-pec"]
  },
  {
    slug: "stampanti", titolo: "Stampanti e scanner", icona: "printer", colore: "gray",
    h1: "Stampanti e scanner: li faccio funzionare da remoto.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    descrizione: "Stampante non in linea, stampa via Wi-Fi, scanner non rilevato, driver: configurazione da remoto per tutte le marche. {{p.rapido}} €.",
    lead: "Stampante «non in linea», stampa via Wi-Fi che non va, scanner che il PC non vede: sistemo driver e collegamenti direttamente dal tuo computer.",
    sintomi: ["La stampante risulta «non in linea»", "Non stampa via Wi-Fi", "Lo scanner non viene rilevato", "Hai una stampante nuova da installare"],
    cosa: ["Installazione dei driver e dei programmi ufficiali", "Collegamento alla rete Wi-Fi", "Stampa da telefono e tablet", "Scansione su PC e in PDF", "Code di stampa bloccate"],
    limiti: "Se la stampante ha un guasto meccanico, come carta incastrata dentro o testine rotte, serve un tecnico sul posto.",
    faq: [
      ["La stampante deve essere accesa?", "Sì, accesa e vicina a te: alcune cose, come premere un tasto o inserire la carta, le fai tu mentre ti guido."],
      ["Va bene qualsiasi marca?", "Sì, lavoro con tutte le principali marche."]
    ],
    correlati: ["servizi/wifi-rete", "servizi/programmi-office", "guide/pc-lento"]
  },
  {
    slug: "account-password", titolo: "Account e password", icona: "key", colore: "orange",
    h1: "Account bloccati e password dimenticate: li recuperiamo insieme.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    nota: "I recuperi più complessi possono richiedere l'intervento Completo: te lo dico prima.",
    descrizione: "Recupero account Google, Apple, Microsoft e social, verifica in due passaggi, gestore di password. Assistenza da remoto, da {{p.rapido}} €.",
    lead: "Non riesci più a entrare in Google, Apple, Microsoft o sui social? Recuperiamo l'accesso con le procedure ufficiali e mettiamo tutto in sicurezza.",
    sintomi: ["Non riesci più ad accedere a Google, Apple o Microsoft", "Account social bloccato o rubato", "Hai dimenticato le password", "Ricevi avvisi di accessi sospetti"],
    cosa: ["Recupero con le procedure ufficiali di ogni servizio", "Attivo la verifica in due passaggi", "Ti configuro un gestore di password", "Controllo i dispositivi collegati e chiudo gli accessi sospetti", "Metto in sicurezza l'email, che è la chiave di tutto"],
    limiti: "Il recupero dipende dalle regole di ogni servizio: a volte serve qualche giorno di attesa, e non sempre è possibile. Te lo dico prima.",
    faq: [
      ["Mi hanno rubato l'account: cosa faccio adesso?", "Scrivimi subito. Intanto, se puoi, cambia la password dell'email da un altro dispositivo e avvisa i tuoi contatti di non rispondere a richieste strane."],
      ["Mi chiederai le mie password?", "No. Le scrivi sempre tu: io ti guido e controllo che tutto sia configurato bene."]
    ],
    correlati: ["guide/finto-tecnico", "servizi/virus", "servizi/email-pec"]
  },
  {
    slug: "backup-foto", titolo: "Backup e foto", icona: "cloud", colore: "teal",
    h1: "Backup e foto al sicuro, in automatico.",
    pacchetto: "Completo", durata: "fino a 60 minuti",
    descrizione: "Backup automatici su cloud o disco esterno, spazio pieno, trasferimento dati su PC nuovo, recupero di file cancellati. Da remoto, {{p.completo}} €.",
    lead: "Foto e documenti sono la cosa più preziosa del computer. Imposto un backup automatico, libero spazio senza perdere nulla e sposto i dati sul PC nuovo.",
    sintomi: ["Non hai mai fatto un backup", "Telefono o PC con lo spazio pieno", "Vuoi ritrovare foto o file cancellati", "Devi passare i dati su un PC nuovo"],
    cosa: ["Backup automatico su cloud (OneDrive, iCloud, Google Drive) o su disco esterno", "Liberare spazio senza perdere nulla", "Trasferimento dei dati dal vecchio al nuovo PC", "Recupero di file cancellati da poco, quando è possibile", "Ordine in foto e documenti"],
    limiti: "Se il disco è danneggiato fisicamente serve un laboratorio specializzato: non provare programmi a caso, rischi di peggiorare le cose.",
    faq: [
      ["Quale cloud mi conviene?", "Di solito quello che hai già: OneDrive con Windows, iCloud con iPhone e Mac, Google con Android. Scegliamo insieme spazio e costo."],
      ["Posso recuperare le foto cancellate?", "A volte sì, se sono state cancellate da poco e il disco non è stato usato molto. Prima di tutto non salvare nuovi file, e scrivimi."]
    ],
    correlati: ["servizi/windows-11", "servizi/smartphone", "guide/pc-lento"]
  },
  {
    slug: "programmi-office", titolo: "Programmi e Office", icona: "apps", colore: "purple",
    h1: "Programmi e Office installati e configurati bene.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    descrizione: "Installazione e configurazione di Microsoft 365, Office, programmi per PDF, firma digitale e videochiamate. Assistenza da remoto, {{p.rapido}} €.",
    lead: "Microsoft 365, programmi di lavoro, PDF, videochiamate che non funzionano: installo, configuro e ripario, solo con software regolare.",
    sintomi: ["Devi installare Microsoft 365, un antivirus o un programma di lavoro", "Un programma non si apre o dà errore", "Documenti Word o Excel che non si aprono", "Microfono o webcam che non vanno nelle videochiamate"],
    cosa: ["Installazione e attivazione di Microsoft 365 e Office", "Programmi per PDF, firma digitale e videochiamate", "Riparazione dei programmi che danno errore", "Configurazione di microfono, webcam e audio", "Solo software con licenza regolare"],
    faq: [
      ["Mi installi Office gratis?", "Installo solo software con licenza regolare. Ti mostro anche le alternative gratuite e legali, se ti bastano."],
      ["Lavori anche su Mac?", "Sì, lavoro su Windows e macOS."]
    ],
    correlati: ["servizi/stampanti", "servizi/email-pec", "servizi/pc-lento"]
  },
  {
    slug: "wifi-rete", titolo: "Wi-Fi e rete", icona: "wifi", colore: "blue",
    h1: "Wi-Fi lento o instabile? Sistemiamo la rete di casa.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    descrizione: "Wi-Fi lento o instabile, configurazione del router, rete ospiti, condivisione di stampanti e cartelle. Assistenza da remoto, {{p.rapido}} €.",
    lead: "Internet che va e viene, Wi-Fi debole in alcune stanze, dispositivi che non si collegano: capiamo insieme se è la linea o la rete, e sistemiamo quello che si può.",
    sintomi: ["Internet va e viene", "Wi-Fi lento in alcune stanze", "Un dispositivo non si collega", "Vuoi condividere stampante o cartelle"],
    cosa: ["Test della velocità e dei problemi della connessione", "Configurazione di router e Wi-Fi, quando si può fare da remoto", "Consigli su posizione del router e ripetitori", "Rete per gli ospiti e password sicura", "Condivisione di cartelle e stampanti in casa o in ufficio"],
    limiti: "Mi serve almeno un dispositivo collegato a internet. Se la linea è guasta, ti aiuto a parlare con il tuo operatore.",
    faq: [
      ["Puoi configurare il router da remoto?", "Spesso sì, collegandomi a un PC della tua rete. Se il router è dell'operatore, alcune impostazioni a volte le può cambiare solo lui."],
      ["Il problema è la linea o il Wi-Fi?", "Lo capiamo insieme con qualche test: così eviti chiamate inutili all'assistenza dell'operatore."]
    ],
    correlati: ["servizi/stampanti", "servizi/smartphone", "guide/pc-lento"]
  },
  {
    slug: "smartphone", titolo: "Smartphone e tablet", icona: "mobile", colore: "pink",
    h1: "Smartphone e tablet configurati e sotto controllo.",
    pacchetto: "Rapido", durata: "fino a 30 minuti",
    descrizione: "Configurazione di smartphone e tablet Android e iPhone, trasferimento di WhatsApp e foto, memoria piena, sicurezza. Assistenza da remoto, {{p.rapido}} €.",
    lead: "Telefono nuovo da configurare, memoria piena, WhatsApp da trasferire: ti aiuto da remoto, su Android e su iPhone.",
    sintomi: ["Hai un telefono nuovo da configurare", "La memoria è piena", "Devi trasferire o recuperare WhatsApp", "Non sai usare un'app"],
    cosa: ["Configurazione di telefoni e tablet nuovi", "Trasferimento di contatti, foto e WhatsApp", "Liberare spazio senza perdere le foto", "Sicurezza: blocco schermo, aggiornamenti, app sospette", "Ti insegno le funzioni che ti servono"],
    limiti: "Su Android posso controllare il telefono a distanza. Su iPhone e iPad vedo lo schermo che condividi e ti guido passo passo.",
    faq: [
      ["Come ti colleghi al mio telefono?", "Con l'app AnyDesk, dallo store ufficiale. Ti guido io nell'installazione: ci vogliono due minuti."],
      ["Mi ripari anche lo schermo rotto?", "No, lavoro solo da remoto: per i guasti fisici ti consiglio a chi rivolgerti."]
    ],
    correlati: ["servizi/backup-foto", "servizi/spid-cie", "servizi/lezioni"]
  },
  {
    slug: "lezioni", titolo: "Lezioni e corsi a distanza", icona: "cap", colore: "yellow",
    h1: "Lezioni a distanza e piccoli corsi, con calma.",
    pacchetto: "Lezione", durata: "30 minuti (60 minuti: {{p.completo}} €)",
    nota: "Con il Pacchetto 5 ore ogni lezione costa meno.",
    descrizione: "Lezioni a distanza su PC, smartphone, SPID, email e sicurezza online, anche per genitori e nonni. Corsi in piccoli gruppi. Da {{p.rapido}} €.",
    lead: "Impari a usare PC, smartphone e servizi online con i tuoi tempi, con parole semplici. Anche per genitori e nonni, anche in piccoli gruppi.",
    sintomiTitolo: "Per chi è",
    sintomi: ["Genitori e nonni che vogliono essere autonomi", "Chi ha un PC o un telefono nuovo", "Chi deve usare SPID, email o videochiamate", "Piccole attività con strumenti nuovi"],
    cosaTitolo: "Cosa impari",
    cosa: ["Usare bene smartphone, tablet e PC", "Email, WhatsApp e videochiamate", "Servizi pubblici online con SPID o CIE", "Riconoscere truffe e messaggi falsi", "Foto, cloud e documenti"],
    extra: {
      titolo: "Corsi in piccoli gruppi",
      testo: "Corsi di 3 o 4 persone in videochiamata su un tema preciso: smartphone per principianti, SPID e servizi online, sicurezza e truffe. Date e prezzi su richiesta: scrivimi per entrare nella lista.",
      wa: "Ciao! Vorrei partecipare a un corso di gruppo. Mi interessa il tema: "
    },
    faq: [
      ["Serve saper già usare il computer?", "No. Partiamo da quello che sai, con parole semplici e i tuoi tempi."],
      ["Posso prenotare una lezione per un familiare lontano?", "Sì: molti figli prenotano le lezioni per i genitori. Il buono regalo è perfetto per questo."]
    ],
    correlati: ["servizi/smartphone", "servizi/spid-cie", "regalo"]
  }
];

export const GUIDE = [
  {
    slug: "finto-tecnico", titolo: "Truffa del finto tecnico: come riconoscerla e cosa fare", breve: "Truffa del finto tecnico", minuti: 4,
    descrizione: "Come funziona la truffa del finto supporto tecnico con AnyDesk, i segnali per riconoscerla e cosa fare subito se hai dato accesso al computer.",
    lead: "Una telefonata a sorpresa o un avviso a tutto schermo, poi la richiesta di installare un programma per «sistemare» il computer. Ecco come riconoscere la truffa e cosa fare se ci sei cascato.",
    html: `
<h2>Come funziona</h2>
<p>I truffatori si presentano come tecnici di Microsoft, della banca, dell'operatore telefonico o di una «società di assistenza». Dicono che il tuo computer è infetto o che il conto è in pericolo, e ti chiedono di installare un programma di controllo remoto come AnyDesk o TeamViewer. Una volta dentro, ti fanno aprire l'home banking o ti chiedono di pagare.</p>
<p>Una variante molto diffusa: qualcuno ti contatta promettendo di <strong>recuperare i soldi persi in una truffa precedente</strong>, in cambio di un anticipo. È un'altra truffa.</p>
<h2>I segnali da riconoscere</h2>
<ul>
  <li>Il contatto arriva a sorpresa: non l'hai chiesto tu.</li>
  <li>Ti mettono fretta e paura: «il PC è infetto», «il conto sta per essere svuotato».</li>
  <li>Una pagina blocca il browser, mostra un numero da chiamare e a volte fa suonare un allarme.</li>
  <li>Ti chiedono di installare un programma di controllo remoto.</li>
  <li>Ti chiedono di aprire l'home banking o di leggere i codici che ricevi via SMS.</li>
  <li>Vogliono essere pagati con gift card, ricariche, criptovalute o bonifici urgenti.</li>
</ul>
<p class="callout">Microsoft non telefona per problemi al computer e i veri messaggi di errore di Windows non contengono numeri di telefono. Nessuna banca ti chiede di installare programmi o di dare i codici che ricevi.</p>
<h2>Se hai una pagina bloccata con un numero</h2>
<p>Non chiamare. Chiudi il browser: su Windows premi <strong>Ctrl + Maiusc + Esc</strong>, seleziona il browser e premi «Termina attività». Su Mac premi <strong>Cmd + Opzione + Esc</strong> e chiudi il browser. Alla riapertura non ripristinare le schede precedenti.</p>
<h2>Se hai già dato accesso al computer</h2>
<ol>
  <li><strong>Scollega internet:</strong> spegni il Wi-Fi o stacca il cavo.</li>
  <li><strong>Chiama subito la tua banca</strong> al numero ufficiale, quello sul retro della carta, e fai bloccare carte e accessi.</li>
  <li><strong>Da un altro dispositivo cambia le password</strong>, a partire dall'email.</li>
  <li><strong>Fai controllare il computer</strong> e rimuovere i programmi installati dai truffatori.</li>
  <li><strong>Denuncia</strong> alla Polizia Postale, anche online su <a href="https://www.commissariatodips.it/" target="_blank" rel="noopener">commissariatodips.it</a>, e conserva le prove: numeri, messaggi, schermate.</li>
</ol>
<h2>Come lavoro io</h2>
<p>Ti contatto solo se me lo chiedi tu, ti dico il prezzo prima di iniziare, non ti chiedo mai codici bancari e si paga solo con metodi tracciabili e fattura. Se qualcuno ti chiama dicendo di essere me e non l'hai chiesto tu, riattacca e scrivimi al numero che trovi su questo sito.</p>`,
    correlati: ["servizi/virus", "servizi/account-password", "guide/pc-lento"]
  },
  {
    slug: "pc-lento", titolo: "PC lento: 5 controlli da fare da solo", breve: "PC lento: 5 controlli", minuti: 4,
    descrizione: "PC lento? Cinque controlli da fare da solo su Windows e Mac prima di chiamare un tecnico: riavvio, spazio su disco, programmi all'avvio, aggiornamenti e virus.",
    lead: "Prima di chiamare un tecnico, ecco cinque controlli che puoi fare da solo in pochi minuti, su Windows e su Mac.",
    html: `
<h2>1. Riavvia davvero</h2>
<p>Su Windows «Arresta» spesso non spegne del tutto il sistema, per accendersi più in fretta. Usa <strong>Riavvia</strong>: libera la memoria e completa gli aggiornamenti in sospeso.</p>
<h2>2. Controlla lo spazio sul disco</h2>
<p>Con il disco quasi pieno tutto rallenta. Su Windows apri <strong>Impostazioni › Sistema › Archiviazione</strong> e attiva il Sensore memoria. Su Mac apri <strong>Impostazioni di Sistema › Generali › Archiviazione</strong>. Cerca di lasciare libero almeno il 10–15% del disco.</p>
<h2>3. Togli i programmi inutili all'avvio</h2>
<p>Molti programmi partono da soli all'accensione. Su Windows apri Gestione attività con <strong>Ctrl + Maiusc + Esc</strong>, vai su «App di avvio» e disattiva quelli che non ti servono. Su Mac guarda in <strong>Impostazioni di Sistema › Generali › Elementi login</strong>.</p>
<p class="callout callout--warn">Nel dubbio non disattivare antivirus, driver audio o programmi che non conosci: chiedimi prima.</p>
<h2>4. Installa gli aggiornamenti</h2>
<p>Su Windows apri <strong>Impostazioni › Windows Update</strong>, su Mac <strong>Impostazioni di Sistema › Generali › Aggiornamento software</strong>. Gli aggiornamenti correggono errori e problemi di sicurezza.</p>
<h2>5. Controlla virus ed estensioni del browser</h2>
<p>Su Windows apri <strong>Sicurezza di Windows › Protezione da virus e minacce</strong> e avvia un'analisi. Poi guarda le estensioni del browser e rimuovi quelle che non hai installato tu.</p>
<h2>Se è ancora lento</h2>
<p>Se dopo questi controlli il computer resta lento, la causa può essere più profonda: programmi in conflitto, software indesiderato, un disco che si sta rovinando. A volte, su PC con qualche anno, un disco SSD cambia tutto: è un lavoro da fare sul posto, ma ti dico prima se ne vale la pena.</p>`,
    correlati: ["servizi/pc-lento", "servizi/virus", "servizi/windows-11"]
  },
  {
    slug: "spid", titolo: "SPID: cos'è, come si ottiene e i problemi più comuni", breve: "SPID: guida semplice", minuti: 4,
    descrizione: "Cos'è lo SPID, come si ottiene, la differenza con la CIE e come risolvere i problemi più comuni: password dimenticata, telefono nuovo, SMS truffa.",
    lead: "Lo SPID è la chiave per entrare nei servizi pubblici online. Ecco come funziona, come si ottiene e come uscire dai problemi più comuni.",
    html: `
<h2>Cos'è</h2>
<p>SPID è il <strong>Sistema Pubblico di Identità Digitale</strong>: un nome utente, una password e un secondo passaggio di sicurezza, di solito un'app o un codice via SMS. Con queste credenziali entri nei siti della pubblica amministrazione: INPS, Agenzia delle Entrate, Fascicolo sanitario, app IO, scuola, Comune.</p>
<h2>Come si ottiene</h2>
<p>Lo SPID si richiede a uno dei <strong>gestori di identità</strong> accreditati: alcuni lo rilasciano gratis, altri a pagamento. In genere servono:</p>
<ul>
  <li>un documento d'identità valido e la tessera sanitaria;</li>
  <li>un indirizzo email e un numero di cellulare personali;</li>
  <li>un riconoscimento, che a seconda del gestore si fa di persona, in videochiamata, con la Carta d'Identità Elettronica o con la firma digitale.</li>
</ul>
<h2>SPID o CIE?</h2>
<p>Con la <strong>Carta d'Identità Elettronica</strong> e l'app CieID accedi agli stessi servizi. Se hai già la CIE e i suoi codici, spesso è la strada più veloce.</p>
<h2>I problemi più comuni</h2>
<ul>
  <li><strong>Password dimenticata:</strong> si recupera dal sito o dall'app del tuo gestore, con la procedura ufficiale.</li>
  <li><strong>Telefono nuovo:</strong> l'app del gestore va riattivata sul nuovo telefono, a volte con un codice ricevuto per email o SMS.</li>
  <li><strong>Numero di cellulare cambiato:</strong> va aggiornato nel profilo del gestore, altrimenti non ricevi i codici.</li>
  <li><strong>Codici che non arrivano:</strong> controlla che il numero sia giusto e che il telefono riceva gli SMS.</li>
</ul>
<p class="callout callout--warn">Attenzione agli SMS e alle email che dicono che lo SPID «sta per scadere» o «va aggiornato» con un link: è una truffa molto diffusa. Non cliccare e controlla sempre sul sito ufficiale del tuo gestore.</p>
<h2>Come posso aiutarti</h2>
<p>Ti guido nella richiesta, installo e configuro le app, ti aiuto a recuperare l'accesso e ti accompagno sui siti di INPS, Agenzia delle Entrate e Fascicolo sanitario. Il riconoscimento lo fai tu con il gestore, e le password le scrivi sempre tu.</p>`,
    correlati: ["servizi/spid-cie", "servizi/smartphone", "guide/finto-tecnico"]
  },
  {
    slug: "windows-10", titolo: "Windows 10 senza aggiornamenti: cosa fare adesso", breve: "Windows 10: cosa fare", minuti: 3,
    descrizione: "Dal 14 ottobre 2025 Windows 10 non riceve più aggiornamenti gratuiti. Le tre strade: passare a Windows 11, attivare gli aggiornamenti estesi (ESU) o cambiare PC.",
    lead: "Dal 14 ottobre 2025 Windows 10 non riceve più gli aggiornamenti gratuiti. Il PC continua a funzionare, ma diventa sempre più esposto. Ecco le tre strade possibili.",
    html: `
<h2>Cosa è cambiato</h2>
<p>Microsoft ha terminato il supporto a Windows 10 il <strong>14 ottobre 2025</strong>. Il computer si accende e funziona come prima, ma senza aggiornamenti di sicurezza ogni nuova falla resta aperta: con il tempo diventa più facile che un virus lo infetti.</p>
<h2>Strada 1: passare a Windows 11</h2>
<p>Se il PC è compatibile, l'aggiornamento a Windows 11 è <strong>gratuito</strong> e mantiene file e programmi. Servono, tra le altre cose, un processore supportato, 4 GB di memoria, 64 GB di spazio e il chip di sicurezza TPM 2.0. L'app di Microsoft <strong>Controllo integrità PC</strong> ti dice in un minuto se il tuo PC è compatibile.</p>
<p class="callout callout--warn">Esistono trucchi per installare Windows 11 su PC non compatibili: li sconsiglio, perché il sistema può smettere di ricevere aggiornamenti o funzionare male.</p>
<h2>Strada 2: gli aggiornamenti di sicurezza estesi (ESU)</h2>
<p>Se il PC non è compatibile, Microsoft offre ai privati il programma <strong>ESU</strong>: aggiornamenti di sicurezza per un periodo limitato. Si può attivare gratis accedendo con un account Microsoft. Le condizioni e le scadenze possono cambiare: ti aiuto a verificare se il tuo PC può attivarlo e fino a quando.</p>
<h2>Strada 3: cambiare computer</h2>
<p>Se il PC ha molti anni ed è lento, a volte conviene cambiarlo. In quel caso ti aiuto a scegliere senza spendere più del necessario e a trasferire tutti i dati dal vecchio al nuovo, da remoto.</p>
<h2>Come posso aiutarti</h2>
<p>Verifico la compatibilità, faccio il backup, aggiorno a Windows 11 o attivo l'ESU e sistemo gli aggiornamenti bloccati. È l'intervento Completo, {{p.completo}} €: se non risolvo, non paghi.</p>`,
    correlati: ["servizi/windows-11", "servizi/backup-foto", "guide/pc-lento"]
  }
];
