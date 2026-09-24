# Gabriel Tech · piano d'azione: dal sito al primo cliente

Questo piano spiega cosa c'è nel sito, perché è fatto così e cosa fare, in ordine, per metterlo online e iniziare a lavorare.

> Le parti legali e fiscali sono indicazioni generali, non una consulenza. Prima di aprire l'attività, verificale con un commercialista.

---

## In breve: la lista da spuntare

- [ ] **1. Fisco:** apri la partita IVA con un commercialista e scegli il codice ATECO giusto (vedi Fase 1).
- [ ] **2. AnyDesk:** acquista una licenza commerciale. La versione gratuita non si può usare per lavoro.
- [ ] **3. WhatsApp Business:** configuralo su un numero dedicato, con gli stessi orari del sito.
- [ ] **4. Pagamenti:** attiva un sistema di pagamento con link (carta, PayPal, Satispay) e un programma per la fattura elettronica.
- [ ] **5. Sito:** inserisci i tuoi dati in `sito/assets/config.js` e i segnaposto indicati nella Fase 3. Nome, logo e grafica sono già pronti (vedi `BRAND.md`).
- [ ] **5bis. Funzioni in più:** attiva pagamenti, notifiche Telegram, recensioni e il resto quando sei pronto (vedi Fase 5bis).
- [ ] **6. Online:** pubblica il sito su Netlify e collega il tuo dominio (vedi Fase 4).
- [ ] **7. Google:** crea il profilo dell'attività su Google e registra il sito su Search Console.
- [ ] **8. Procedura:** prepara i messaggi pronti e le condizioni di servizio (vedi Fase 6).
- [ ] **9. Primi clienti:** amici e parenti, gruppi Facebook della tua zona, volantini con codice QR.
- [ ] **10. Recensioni:** chiedine una dopo ogni intervento riuscito.

---

## 1. Cosa c'è nel sito e perché

### Il design
La ricerca sulle tendenze 2026 indica tre direzioni dominanti, e il sito le usa tutte:

- **Liquid Glass:** è il linguaggio grafico presentato da Apple nel giugno 2025 e usato in iOS 26 e macOS Tahoe 26. Nel sito ci sono pannelli di vetro traslucido con un riflesso che segue il mouse.
- **Bento grid:** i servizi sono disposti in riquadri di dimensioni diverse, come nelle pagine prodotto Apple.
- **3D interattivo:**
  - in alto c'è la **G del logo in 3D**: segue il mouse, si trascina col dito e gira quando scorri;
  - forme lucide fluttuano ai bordi e si scansano dal mouse;
  - le schede si alzano in 3D mentre scorri;
  - in «Come funziona» un Mac ruota con lo scorrimento e mostra una sessione di assistenza.

  I dettagli sono in `BRAND.md`.

Scelte tecniche importanti:
- **Il 3D è pensato per restare veloce:**
  - la G e le forme usano WebGL (Three.js, incluso nel sito) e si caricano solo dopo la pagina;
  - se il telefono fatica, la qualità si abbassa da sola;
  - il Mac e le schede sono in CSS puro;
  - se il dispositivo non supporta il 3D, resta il logo statico.
- **Si adatta a telefono, tablet e computer** e passa da solo alla **modalità scura** se il dispositivo la usa.
- **Rispetta chi disattiva le animazioni.** In quel caso le animazioni si fermano.
- **Usa i font di sistema:** su iPhone e Mac il sito usa il font di Apple (SF Pro), sugli altri dispositivi un font equivalente. Non carica font da Google, quindi nessun dato dei visitatori finisce a terzi e non serve un banner per i cookie.

### I servizi
I servizi scelti sono quelli più offerti e più richiesti nell'assistenza da remoto in Italia: PC lento, virus, email e PEC, SPID e servizi pubblici, stampanti, account, backup, Office, rete, smartphone e lezioni.

In più ci sono due temi di attualità:
- **Windows 10 non è più supportato dal 14 ottobre 2025.** Molti devono passare a Windows 11 o attivare gli aggiornamenti di sicurezza estesi (ESU).
- **SPID, CIE, app IO e servizi pubblici online** sono una richiesta tipicamente italiana, frequente soprattutto tra le persone meno esperte.

Il sito dice anche con chiarezza **cosa non si fa da remoto** (hardware rotto, PC che non si accende). Così eviti richieste inutili e guadagni fiducia.

### I prezzi
Prezzi trovati sui siti della concorrenza per i privati:

| Chi | Prezzo |
|---|---|
| Webbo.eu | 20 € ogni 30 minuti |
| ALE.A. | 25 € ogni 30 minuti |
| Computer Wizard | 27,45 € ogni 30 minuti (IVA inclusa) |
| Amico Informatico | 29,90 € per 30–60 minuti |

Per le aziende, i contratti mensili partono da circa 15–35 € a postazione al mese.

I prezzi del sito sono in linea con il mercato, con un posizionamento medio:

| Offerta | Prezzo | Note |
|---|---|---|
| Rapido | 25 € | fino a 30 minuti |
| Completo | 45 € | fino a 60 minuti, messo in evidenza |
| Pacchetto 5 ore | 179 € | circa 36 € l'ora, valido 12 mesi |
| Famiglia | 14,90 €/mese | 1 intervento rapido al mese, fino a 3 dispositivi |
| Professionisti | 39 €/mese | fino a 2 ore al mese, fino a 3 postazioni |
| Aziende | su preventivo | oltre 3 postazioni |

Gli abbonamenti sono importanti: ti danno un'entrata fissa ogni mese.

**Decisioni da confermare tu:** i prezzi, la garanzia «se non risolvo, non paghi», il supplemento di 10 € per le urgenze fuori orario, il tempo extra a 20 € ogni 30 minuti e gli orari. Sono tutte modificabili (vedi Fase 3).

### La fiducia
Le truffe del «finto supporto tecnico» usano proprio AnyDesk e TeamViewer. La Polizia Postale segnala anche falsi tecnici che promettono di «recuperare» i soldi rubati da una truffa precedente.

Per questo il sito ha una sezione **Sicurezza** con regole chiare:
- contatto solo su richiesta del cliente;
- mai codici bancari;
- mai gift card;
- mai promesse di recupero fondi;
- sessione aperta e chiusa dal cliente.

**Non offrire mai servizi di «recupero soldi truffati»:** ti farebbe sembrare un truffatore.

---

## 2. Fase 1: basi legali e fiscali (prima di incassare)

1. **Partita IVA.** Il regime forfettario è di solito il più conveniente per chi inizia: tassazione agevolata per le nuove attività e un limite di ricavi annui. Fatti confermare dal commercialista le aliquote e i limiti in vigore quando apri.
2. **Codice ATECO: è la scelta che pesa di più.** Dal 2025 è in vigore la nuova classificazione ATECO.
   - Se ti inquadrano come **artigiano** (per esempio «riparazione computer»), paghi contributi INPS **fissi**, oltre 4.000 € l'anno, anche se guadagni poco.
   - Con un codice di **servizi informatici** svolti come professionista, di solito versi nella gestione separata **in percentuale** su quanto guadagni.
   - Visto che non fai riparazioni fisiche, chiedi espressamente se il secondo caso è possibile.
3. **Fattura elettronica:** è obbligatoria anche per i forfettari. Puoi usare il servizio gratuito dell'Agenzia delle Entrate («Fatture e Corrispettivi») o un'app a pagamento.
4. **Pagamenti elettronici:** devi accettarli. I link di pagamento (SumUp, PayPal, Satispay, Stripe) sono perfetti per il lavoro a distanza.
5. **Partita IVA sul sito:** è obbligatoria. Lo spazio è già pronto nel footer.
6. **Condizioni di servizio:** scrivi una pagina breve con:
   - prezzi e tempi;
   - cosa succede se non risolvi;
   - il fatto che il cliente deve avere un backup dei dati importanti;
   - i limiti della tua responsabilità.

   Per i privati vale la normativa sui contratti a distanza, con diritto di recesso di 14 giorni. Per iniziare subito, il cliente deve chiedere espressamente l'avvio immediato e accettare che, a servizio completato, perde il recesso. Mandagli le condizioni su WhatsApp e fatti rispondere «Accetto» prima di ogni sessione. Fai controllare il testo al commercialista o a un legale.
7. **Assicurazione di responsabilità civile professionale:** è consigliata. Se durante un intervento si perdono dati, sei coperto.
8. **Privacy (GDPR):**
   - `privacy.html` è un modello già scritto: completalo e fallo verificare.
   - Con le aziende firma la nomina a responsabile del trattamento. Lo prevede già il piano Aziende.

---

## 3. Fase 2: strumenti di lavoro

### AnyDesk
- **La versione gratuita è vietata per uso commerciale.** Ti serve una licenza a pagamento.
- La più piccola, «Solo», nel 2026 costa circa 29 dollari al mese con pagamento annuale. Il prezzo è quasi raddoppiato dal 2024: controllalo su [anydesk.com/it/pricing](https://anydesk.com/it/pricing).
- **Alternative:**
  - [RustDesk](https://rustdesk.com), open source e installabile su un tuo server;
  - Splashtop SOS;
  - HelpWire.

  Prima di scegliere, verifica licenza e costi per l'uso commerciale.
- **Sicurezza del tuo account:**
  - attiva la verifica in due passaggi;
  - usa una password unica;
  - tieni AnyDesk aggiornato.
- **Registrazione delle sessioni:** se il piano la prevede, attivala e avvisa il cliente. Ti tutela in caso di contestazioni.

### WhatsApp Business (gratis)
- **Numero dedicato:** usa una seconda SIM o una eSIM, così separi lavoro e vita privata.
- **Profilo:** nome «Gabriel Tech», foto profilo `assets/brand/profile-1024.png`, descrizione, sito e **orari identici a quelli del sito**.
- **Messaggio di benvenuto e messaggio di assenza** fuori orario (testi pronti nella Fase 6).
- **Risposte rapide** per preventivi, istruzioni AnyDesk e link di pagamento.
- **Catalogo** con i pacchetti e i prezzi.
- **Etichette** per seguire i clienti: «Nuovo», «Preventivo inviato», «Da pagare», «Pagato», «Abbonato».

### Pagamenti e amministrazione
- **Link di pagamento:** SumUp, PayPal Business o Satispay Business. Per chi preferisce, anche il bonifico istantaneo.
- **Registro interventi:** basta un foglio di calcolo con data, cliente, problema, durata, prezzo, pagato sì/no, numero fattura e note.

### Strumenti tecnici
- **Licenze:** molti programmi antivirus e di pulizia gratuiti sono **solo per uso personale**. Per lavorare usa versioni con licenza commerciale.
- **Protezione del tuo computer:**
  - password manager;
  - verifica in due passaggi su tutti i tuoi account;
  - disco cifrato (BitLocker o FileVault).

---

## 4. Fase 3: personalizzare il sito

### Come è organizzata la cartella
| Cartella o file | Cosa contiene |
|---|---|
| `sito/` | **Il sito vero e proprio**: l'unica cartella che va online |
| `sito/assets/config.js` | **Il pannello di controllo**: numero, WhatsApp, email, orari, link di pagamento, recensioni, video, offerte e altro. Tutto quello che lasci vuoto resta nascosto sul sito |
| `strumenti/contenuti.mjs` | I testi delle 12 pagine dei servizi e delle 4 guide |
| `strumenti/genera-pagine.mjs` | Il generatore: ricrea tutte le pagine interne con la stessa grafica. Si lancia con `node strumenti/genera-pagine.mjs` oppure `npm run genera` |
| `netlify/functions/` | Le automazioni: notifica Telegram e assistente virtuale |
| `PIANO-DI-AZIONE.md`, `BRAND.md`, `README.md` | Documenti per te: non vanno online |

Le pagine interne (servizi, guide, prenotazione, regalo, aziende, condizioni, privacy) sono **generate**. Se modifichi a mano una di queste pagine, la prossima rigenerazione cancella la modifica. Per cambiarle modifica `strumenti/contenuti.mjs` o il generatore e poi rigenera, oppure chiedimelo.

### Cosa cambiare prima di pubblicare
| Cosa | Dove |
|---|---|
| **Numero, WhatsApp, email, orari** | `sito/assets/config.js`: si aggiornano da soli in tutte le pagine, compreso lo stato «Disponibile ora» e il calendario delle prenotazioni |
| Stessi dati, per Google | `sito/index.html`: il blocco `application/ld+json` in alto (telefono, email, orari) |
| **[Nome Cognome], [X] anni, P.IVA** | `sito/index.html` (sezione «Chi sono») e `strumenti/genera-pagine.mjs` (footer, condizioni e privacy), poi rigenera. Nel footer della home si aggiorna da solo, perché anche quello lo scrive il generatore |
| **Tua foto** | Metti la foto in `sito/assets/` (per esempio `foto.jpg`). In `sito/index.html`, nella sezione «Chi sono», sostituisci `<svg class="i"><use href="#i-user"/></svg>` con `<img src="assets/foto.jpg" alt="Nome Cognome">` e togli `aria-hidden="true"` dal riquadro |
| **Prezzi** | `sito/index.html` (sezione `PREZZI`), `strumenti/contenuti.mjs` (prezzo di ogni servizio), `strumenti/genera-pagine.mjs` (buoni, aziende, condizioni), il quiz in `sito/assets/main.js` (`PACCHETTI`) e le istruzioni dell'assistente in `netlify/functions/assistente.mjs`. È il cambiamento più sparso: se cambi i prezzi, chiedimelo e li aggiorno ovunque |
| **Dominio** (dopo averlo comprato) | `sito/assets/config.js` (`sito`), `strumenti/genera-pagine.mjs` (`DOMINIO`, poi rigenera) e la testata di `sito/index.html` (`canonical`, `og:url`, `og:image`, blocco `ld+json`) |
| **Condizioni e privacy** | Completa le parti tra parentesi quadre nel generatore e falle verificare |

**Attenzione:** il numero `+39 000 000 0000` e l'email `info@example.com` sono finti. Non pubblicare il sito prima di averli sostituiti. Il **pannello del tecnico** (`/tecnico/`) ti mostra cosa manca ancora.

Per vedere il sito sul computer, apri `sito/index.html` con un doppio clic. Per provare anche il 3D serve un piccolo server: dalla cartella `nuovo-progetto` lancia `npm run anteprima` e apri `http://localhost:8080`.

---

## 5. Fase 4: mettere il sito online (Netlify, gratis)

Consiglio **Netlify**: hosting gratuito, HTTPS automatico, moduli di contatto senza server e le funzioni automatiche (Telegram e assistente).

### Opzione A: in 5 minuti, per provare
1. Vai su [app.netlify.com/drop](https://app.netlify.com/drop) e crea un account.
2. Trascina nella pagina la cartella **`sito`**, non tutta `nuovo-progetto`: così piano e documenti restano privati.
3. Ricevi subito un indirizzo del tipo `nome-a-caso.netlify.app`.

Con questa opzione notifica Telegram e assistente virtuale non funzionano: servono l'opzione B.

### Opzione B: collegato a GitHub (consigliata)
Ogni modifica caricata su GitHub aggiorna il sito da sola.
1. Prima porta il lavoro sul branch `main` di GitHub. Posso aprire io la pull request.
2. In Netlify scegli **Add new project → Import an existing project → GitHub** e seleziona il repository `gabriel-`.
3. Imposta:
   - **Branch:** `main`
   - **Base directory:** `nuovo-progetto`
   - **Build command:** vuoto

   Il resto, cioè cartella da pubblicare e funzioni, lo legge da solo dal file `netlify.toml`.
4. Premi **Deploy**.

### Attivare i moduli
Il sito ha tre moduli: richiamata, prenotazione e preventivo aziende.
1. In Netlify apri **Forms** e attiva il **rilevamento dei moduli (form detection)**, poi ripubblica il sito.
2. In **Forms → Form notifications** aggiungi una **notifica email** verso il tuo indirizzo.
3. Fai una prova da ogni modulo.
4. Controlla i limiti del piano gratuito: il numero di invii al mese è limitato.

### Il tuo dominio
1. **Compra un dominio `.it`**, per esempio `gabrieltech.it` (prima verifica che sia libero). Costa pochi euro l'anno.
2. In Netlify apri **Domain management → Add a domain** e segui le istruzioni per il DNS. Il certificato HTTPS è automatico.
3. **Email professionale** (per esempio `info@gabrieltech.it`): di solito la offre lo stesso registrar, oppure puoi usare Zoho, Google Workspace o Microsoft 365.
4. **Aggiorna il sito** con il dominio (Fase 3).

---

## 5bis. Le funzioni in più e come attivarle

Il sito funziona già senza nessuna di queste. Ognuna si accende quando compili la voce indicata, e fino ad allora resta nascosta.

### Già attive, senza fare niente
- **Diagnosi in 3 domande** nella home: consiglia il pacchetto e porta a WhatsApp o alla prenotazione.
- **Prenotazione** (`prenota.html`) con i tuoi orari veri: il cliente sceglie giorno e ora, a te arriva la richiesta nel modulo di Netlify (e su Telegram, se lo attivi), poi confermi su WhatsApp.
- **Guida AnyDesk** (`collegati.html`): riconosce da sola Windows, Mac, Android o iPhone e prepara il messaggio WhatsApp con l'indirizzo AnyDesk del cliente.
- **12 pagine di servizi e 4 guide**, per farti trovare su Google, più **regalo**, **aziende**, **condizioni**, **privacy** e la pagina **404** con la G in 3D.
- **Offerte stagionali** in alto nella home: si accendono da sole tra le date scritte in `config.js` (`offerte`). Adesso c'è quella di settembre per il PC della scuola; a dicembre parte il buono regalo di Natale.
- **Tema chiaro/scuro** con il pulsante in alto, **cursore** e **icone in 3D**, e il **Mac** che in «Come funziona» racconta i tre passi mentre scorri.

### Da attivare quando vuoi
| Funzione | Cosa fare | Voce in `config.js` |
|---|---|---|
| **Pagamenti online** (pacchetto, abbonamenti, buoni) | Crea i link di pagamento: con Stripe, «Payment Links», anche ricorrenti per gli abbonamenti; oppure PayPal, SumUp o Satispay | `pagamenti` |
| **Area abbonati** | In Stripe attiva il «Customer portal» e copia il link | `pagamenti.areaAbbonati` |
| **Calendario esterno** (Cal.com o Calendly, gratis nella versione base) | Crea un evento da 30 e uno da 60 minuti con i tuoi orari e copia il link. Si carica solo quando il cliente preme il pulsante, perché usa cookie | `prenotazioneEsterna` |
| **Recensioni sul sito** | Aggiungi quelle vere, con il permesso dei clienti | `recensioni` |
| **Link «Lascia una recensione»** | Nel profilo Google dell'attività, «Chiedi recensioni»: copia il link. La pagina `recensione.html` e il codice QR lo usano | `linkRecensioneGoogle` |
| **Video di presentazione** | Registra 30 secondi. Metti il file in `sito/assets/video/` (meglio sotto i 10 MB) o caricalo su YouTube | `video` |
| **Canale WhatsApp** | WhatsApp → Aggiornamenti → Canali → Crea canale, poi copia il link | `canaleWhatsApp` |
| **Statistiche senza cookie** | Account gratuito Cloudflare → Web Analytics → aggiungi il sito e copia il «token» | `cloudflareAnalytics` |

### Notifica sul telefono con Telegram (gratis)
Ogni richiesta dai moduli ti arriva subito su Telegram, con il link per scrivere al cliente su WhatsApp.
1. Su Telegram apri **@BotFather**, scrivi `/newbot` e scegli un nome: ricevi un **token**.
2. Manda un messaggio qualsiasi al tuo nuovo bot.
3. Nel browser apri `https://api.telegram.org/bot<TOKEN>/getUpdates`, mettendo il tuo token al posto di `<TOKEN>`, e copia il numero dopo `"chat":{"id":`.
4. In Netlify apri **Site configuration → Environment variables** e aggiungi:
   - `TELEGRAM_BOT_TOKEN`: il token;
   - `TELEGRAM_CHAT_ID`: il numero copiato.
5. Ripubblica il sito e fai una prova dal modulo.

### Assistente virtuale (risponde anche di notte)
Una finestra «Domande?» risponde su servizi, prezzi e funzionamento e, quando serve, passa il cliente a WhatsApp. Non chiede mai password o dati bancari.
1. Crea un account nella [console di Anthropic](https://console.anthropic.com), aggiungi un metodo di pagamento e **imposta un limite di spesa mensile**: è la tua protezione principale.
2. Crea una **chiave API**.
3. In Netlify aggiungi le variabili:
   - `ANTHROPIC_API_KEY`: la chiave;
   - `SITE_URL`: il tuo indirizzo, per esempio `https://www.gabrieltech.it`. Così l'assistente risponde solo dal tuo sito.
4. In `config.js` metti `assistente: true` e ripubblica.

**Costi:** l'assistente usa `claude-opus-5`, il modello più affidabile. Le istruzioni fisse vengono messe in cache, quindi ogni risposta costa in genere intorno a 1–2 centesimi. Con qualche centinaio di domande al mese sono pochi euro. Se vuoi spendere meno si può usare un modello più economico: dimmelo e adatto la funzione.

**Da ricordare:**
- **Se cambi prezzi o servizi,** vanno aggiornati anche nelle istruzioni dell'assistente, in `netlify/functions/assistente.mjs`.
- **Privacy:** le domande vengono elaborate da Anthropic, come già scritto nell'informativa privacy.

### Il pannello del tecnico (`/tecnico/`)
Una pagina solo per te, non indicizzata da Google: salvala nei preferiti. Contiene:
- **Controllo impostazioni:** cosa manca ancora in `config.js`.
- **Messaggi pronti:** i messaggi della Fase 6, più conferma appuntamento, promemoria e richiesta recensione. Si copiano o si aprono in WhatsApp con un clic.
- **Codici QR** di sito, WhatsApp, recensioni e guida AnyDesk, da scaricare in PNG o SVG.
- **Da stampare:**
  - **volantino A5**;
  - **biglietto da visita** 85 × 55 mm fronte e retro;
  - **buono regalo**, con codice e scadenza generati da soli.

  Dalla finestra di stampa scegli «Salva come PDF» e mandalo in tipografia.

Il pannello non è protetto da password: non scriverci mai dati dei clienti.

### Monitoraggio a distanza per gli abbonati (quando crescerai)
Per offrire assistenza «preventiva» agli abbonati Professionisti e Aziende serve un programma di monitoraggio (RMM), come NinjaOne, Atera o Tactical RMM: avvisa se un disco si riempie o un backup fallisce. Sceglilo quando hai i primi clienti in abbonamento, e solo allora aggiungilo alla descrizione dei piani.

---

## 6. Fase 5: farsi trovare

1. **Profilo dell'attività su Google** (Google Business Profile):
   - crealo come attività **senza sede visibile**, che serve una zona;
   - usa `assets/brand/profile-1024.png` come logo;
   - scegli una categoria legata all'assistenza informatica;
   - inserisci orari identici al sito e il link al sito.
2. **Recensioni vere:** dopo ogni intervento riuscito manda il link diretto per recensirti. **Non inventare mai recensioni.** Quando ne avrai 5 o più, aggiungiamo una sezione «Dicono di me» al sito.
3. **Google Search Console:** verifica il dominio e invia l'indirizzo del sito, così Google lo indicizza prima.
4. **Parole chiave** che le persone cercano, da usare nei testi e in future pagine dedicate:
   - «assistenza computer da remoto»
   - «tecnico pc online»
   - «rimozione virus da remoto»
   - «configurare PEC»
   - «aiuto SPID»
   - «passare a Windows 11»

   Una pagina per ogni servizio aiuta molto su Google. Posso crearle io.
5. **Passaparola:** per esempio «Porta un amico: 5 € di sconto a tutti e due».
6. **Sul territorio:**
   - volantini con codice QR in bar, tabaccherie e cartolerie;
   - accordi con CAF e patronati, che vedono ogni giorno persone in difficoltà con SPID e servizi online;
   - accordi con i negozi di informatica della zona: loro ti mandano i problemi software, tu mandi a loro i guasti hardware.
7. **Gruppi Facebook** della tua città e del tuo quartiere: offri consigli utili, non solo pubblicità.
8. **Pubblicità a pagamento:**
   - **Google Ads:** gli annunci di assistenza tecnica sono soggetti a regole restrittive. Prima di investire, verifica le norme della categoria «assistenza tecnica di terze parti».
   - **Meta (Facebook e Instagram):** puoi partire con un budget piccolo, rivolto alla tua zona e a un pubblico over 50.

---

## 7. Fase 6: come svolgere ogni intervento

### La procedura
1. **Primo contatto:** rispondi con il messaggio pronto e fai 2 o 3 domande:
   - che dispositivo usa?
   - cosa succede esattamente?
   - da quando?
2. **Preventivo:** dì subito se il problema si risolve da remoto e scrivi prezzo e durata stimata.
3. **Consenso:** manda le condizioni di servizio e aspetta «Accetto».
4. **Collegamento:**
   - il cliente scarica AnyDesk **dal sito ufficiale**;
   - ti detta il suo numero;
   - accetta lui la connessione.
5. **Prima di toccare qualcosa:** se l'intervento è delicato, crea un punto di ripristino o verifica che esista un backup.
6. **Durante:** spiega cosa fai, con parole semplici. Non aprire file personali che non servono.
7. **Verifica:** controllate insieme che il problema sia risolto.
8. **Chiusura:** chiudi la sessione. Se non è un cliente in abbonamento, suggerisci di disinstallare AnyDesk o di disattivare l'accesso non presidiato.
9. **Pagamento:** manda il link e poi la fattura elettronica.
10. **Dopo 2 o 3 giorni:** chiedi se va tutto bene e manda il link per la recensione.

### Messaggi pronti per WhatsApp Business

Li trovi anche nel pannello del tecnico (`/tecnico/`), pronti da copiare con un clic.

**Benvenuto**
> Ciao! Sono [Nome] di Gabriel Tech, assistenza informatica da remoto. Raccontami in breve il problema e che dispositivo usi (PC Windows, Mac, telefono): ti dico subito se posso risolverlo a distanza e quanto costa.

**Fuori orario**
> Grazie del messaggio! In questo momento non sono disponibile. Ti rispondo appena torno, negli orari indicati sul sito. Se è urgente, scrivilo nel messaggio.

**Preventivo**
> Si risolve da remoto. Prezzo: [25/45] €, tempo stimato: [X] minuti. Se non riesco a risolvere, non paghi. Ecco le condizioni del servizio: [link]. Se va bene, rispondi «Accetto» e ci colleghiamo.

**Istruzioni AnyDesk**
> Scarica AnyDesk solo da qui: https://anydesk.com/it/downloads. Aprilo e dettami il numero che vedi in alto («Il tuo indirizzo»). Quando compare la richiesta, premi «Accetta». Vedrai tutto quello che faccio e potrai chiudere quando vuoi.

**Dopo l'intervento**
> Fatto! Ecco il link per il pagamento: [link]. Ti arriverà la fattura via email. Se ti sono stato utile, una recensione mi aiuta tantissimo: [link recensione]. Grazie!

---

## 8. Sicurezza e reputazione

- **I tuoi account** (AnyDesk, WhatsApp, email, Google):
  - verifica in due passaggi ovunque;
  - su WhatsApp attiva anche il PIN di verifica in due passaggi.
- **Mai:**
  - chiedere codici OTP, PIN o password della banca;
  - accettare gift card o criptovalute;
  - chiamare clienti che non ti hanno contattato.
- **Se un cliente è stato truffato:**
  - aiutalo a mettere al sicuro account e PC;
  - digli di chiamare subito la banca;
  - consiglia di fare denuncia alla [Polizia Postale](https://www.commissariatodips.it/).
- **Accesso non presidiato** (entrare nel PC senza che il cliente accetti ogni volta): solo per clienti in abbonamento, con consenso scritto e revocabile.

---

## 9. Costi di partenza (stime da verificare)

| Voce | Costo indicativo |
|---|---|
| Hosting del sito (Netlify, piano gratuito) | 0 € |
| Dominio `.it` | pochi euro l'anno |
| Licenza AnyDesk Solo | circa 29 $ al mese (pagamento annuale) |
| WhatsApp Business | 0 € |
| SIM dedicata | circa 5–10 € al mese |
| Commissioni sui pagamenti | una piccola percentuale su ogni incasso |
| Commercialista | chiedi 2 o 3 preventivi |
| Contributi INPS | dipendono dal codice ATECO (Fase 1) |
| Assicurazione RC professionale | chiedi un preventivo |
| Notifiche Telegram, Cal.com o Calendly base, Cloudflare Web Analytics | 0 € |
| Stripe, PayPal, SumUp, Satispay | nessun canone di base, solo una commissione sui pagamenti |
| Assistente virtuale (facoltativo) | in genere pochi euro al mese, con il limite di spesa che scegli tu |

**Esempio:** con AnyDesk e la SIM spendi circa 35–40 € al mese. Bastano un intervento Completo e un Rapido al mese per coprirli, prima di tasse e contributi. Ogni abbonamento Famiglia o Professionisti rende l'entrata più stabile.

---

## 10. Prossimi passi che posso fare io

1. Aprire la pull request per portare il sito su `main`, necessaria per l'Opzione B di Netlify.
2. Inserire i tuoi dati veri: nome e cognome, numero, email, P.IVA, foto, dominio.
3. Tradurre il sito nelle lingue che parli (inglese, rumeno, spagnolo…), per raggiungere le comunità straniere in Italia: dimmi quali.
4. Scrivere altre guide (una al mese aiuta molto su Google) e pagine per le domande più frequenti dei tuoi clienti.
5. Collegare i link di pagamento, il calendario e l'assistente quando hai creato gli account.

---

## Fonti della ricerca

- Tendenze di design 2026 (Liquid Glass, bento grid, 3D): [theplusaddons.com](https://theplusaddons.com/blog/web-design-trends-2026/), [gezar.dk](https://gezar.dk/en/blog/web-design-trends-2026), [studiomeyer.io](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check), [rajeshrnair.com](https://rajeshrnair.com/blog/design/ui-ux/ui-design-trends-2026-bento-grids-glassmorphism.html)
- Prezzi e servizi dell'assistenza remota in Italia: [Computer Wizard](https://www.computerwizard.it/modalita-assistenza/assistenza-remota-privati/), [ALE.A.](https://www.assistenzaconsulenzainformatica.it/richiesta-di-assistenza-remota/), [Amico Informatico](https://www.amicoinformatico.it/assistenza-remota/), [Webbo.eu](https://www.webbo.eu/assistenza-da-remoto/), [Bulltech: contratti IT 2026](https://bulltech.it/blog/costo-contratto-assistenza-it-2026), [Cronoshare](https://www.cronoshare.it/quanto-costa/manutenzione-informatica-aziende)
- Licenze e prezzi AnyDesk: [anydesk.com/pricing](https://anydesk.com/en/pricing), [costbench.com](https://costbench.com/software/remote-desktop/anydesk/), [realvnc.com](https://www.realvnc.com/en/blog/anydesk-pricing/)
- Truffe del finto supporto tecnico: [Polizia di Stato](https://www.poliziadistato.it/articolo/la-polizia-postale-informa--attenzione-alle-truffe-tramite-spoofing), [Itaca Notizie, giugno 2026](https://itacanotizie.it/2026/06/28/falsa-assistenza-denaro-truffe-polizia-postale/), [HelpWire](https://www.helpwire.app/blog/avoid-anydesk-scams/)
- Fine del supporto a Windows 10 ed ESU: [Microsoft](https://www.microsoft.com/en-us/windows/end-of-support), [Microsoft ESU](https://www.microsoft.com/en-us/windows/extended-security-updates)
