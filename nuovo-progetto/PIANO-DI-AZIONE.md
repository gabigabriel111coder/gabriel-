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
- [ ] **5bis. Funzioni in più:** attiva pagamenti, notifiche Telegram, gestionale con messaggi automatici, monitoraggio dei PC, recensioni e il resto quando sei pronto (vedi Fase 5bis).
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
| Famiglia | 14,90 €/mese | 1 intervento rapido al mese, fino a 3 dispositivi, monitoraggio del PC |
| Professionisti | 39 €/mese | fino a 2 ore al mese, fino a 3 postazioni, monitoraggio di PC e backup |
| Aziende | su preventivo | oltre 3 postazioni, monitoraggio di tutte le postazioni |

Gli abbonamenti sono importanti: ti danno un'entrata fissa ogni mese. Il monitoraggio dei PC (Fase 5bis) li rende più convincenti, perché spesso risolvi un problema prima che il cliente se ne accorga.

**Decisioni da confermare tu:** i prezzi, la garanzia «se non risolvo, non paghi», il supplemento di 10 € per le urgenze fuori orario, il tempo extra a 20 € ogni 30 minuti e gli orari. Si cambiano tutte in `sito/assets/config.js` (vedi Fase 3).

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
| `sito/assets/config.js` | **Il pannello di controllo**: numero, WhatsApp, email, orari, prezzi, dati dell'attività, dominio, link di pagamento, recensioni, video, offerte e altro. Tutto quello che lasci vuoto resta nascosto sul sito |
| `sito/en/` | La versione in inglese, creata dal generatore: non modificarla a mano |
| `sito/agent/` | I programmi di monitoraggio da installare sui PC degli abbonati (Windows e Mac) |
| `strumenti/modelli/home.html` | Il modello della home: testi, sezioni e foto |
| `strumenti/contenuti.mjs` | I testi delle 12 pagine dei servizi e delle 4 guide |
| `strumenti/traduzioni/en.mjs` | Il dizionario italiano → inglese di tutte le frasi del sito |
| `strumenti/genera-pagine.mjs` | Il generatore: ricrea tutte le pagine, in italiano e in inglese, con la stessa grafica. Si lancia con `npm run genera` |
| `netlify/functions/` | Le automazioni: richieste dai moduli, gestionale, promemoria, monitoraggio e assistente virtuale |
| `netlify/lib/` | Parti comuni delle automazioni. `dati.mjs` lo crea il generatore da `config.js` |
| `test/` | Le prove automatiche delle automazioni: `npm test` |
| `PIANO-DI-AZIONE.md`, `BRAND.md`, `README.md` | Documenti per te: non vanno online |

**Tutte le pagine sono generate**, compresa la home (dal modello `strumenti/modelli/home.html`) e la versione inglese. Se modifichi a mano un file dentro `sito/`, la prossima rigenerazione cancella la modifica: cambia il modello, `strumenti/contenuti.mjs` o il generatore e poi rigenera, oppure chiedimelo. Con Netlify collegato a GitHub la rigenerazione parte da sola a ogni pubblicazione.

### Cosa cambiare prima di pubblicare
Quasi tutto si cambia **in un solo posto**, `sito/assets/config.js`, e poi si rigenera (`npm run genera`, oppure pubblicando su Netlify). I nuovi valori finiscono da soli in tutte le pagine italiane e inglesi, nei dati per Google, nelle email ai clienti e nelle risposte dell'assistente.

| Cosa | Dove |
|---|---|
| **Numero, WhatsApp, email, orari** | `config.js`. Si aggiornano anche lo stato «Disponibile ora» e il calendario delle prenotazioni |
| **Nome e cognome, P.IVA, indirizzo, anni di esperienza** | `config.js` (`titolare`, `piva`, `indirizzo`, `anniEsperienza`): compaiono in «Chi sono», nel footer, nelle condizioni e nella privacy |
| **Prezzi** | `config.js` (`prezzi`): home, pagine dei servizi, buoni regalo, aziende, condizioni, diagnosi, versione inglese e assistente virtuale |
| **Dominio** (dopo averlo comprato) | `config.js` (`sito`): indirizzi per Google, sitemap, codici QR e link nelle email. Finché non lo metti, sul sito pubblicato si usa da solo l'indirizzo di Netlify |
| **Tua foto** | Carica un file chiamato `foto.jpg` (oppure `.png` o `.webp`) nella cartella `sito/assets`. Il sito lo trova da solo, lo ritaglia sul volto e ne prepara versioni leggere. Vedi «La fiducia al centro» (sezione 8ter) |
| **Testi della home** | `strumenti/modelli/home.html`. Se aggiungi frasi nuove, il generatore te le elenca in `strumenti/traduzioni/mancanti-en.json`: aggiungi la traduzione in `strumenti/traduzioni/en.mjs`, oppure chiedimelo |
| **Condizioni e privacy** | Nel generatore: falle verificare prima di pubblicare |

**Attenzione:** nome e cognome e P.IVA sono ancora segnaposto tra parentesi quadre: completali in `config.js` prima di far girare il link del sito. Il **pannello del tecnico** (`/tecnico/`) ti mostra cosa manca ancora.

Per vedere il sito sul computer, apri `sito/index.html` con un doppio clic. Per provare anche il 3D serve un piccolo server: dalla cartella `nuovo-progetto` lancia `npm run anteprima` e apri `http://localhost:8080`.

### Il sito in altre lingue
La versione inglese (`/en/`) si crea da sola a ogni rigenerazione, con il dizionario `strumenti/traduzioni/en.mjs`. Ogni pagina ha il pulsante **EN/IT** in alto e, se il browser del visitatore è in un'altra lingua, un piccolo avviso propone la versione giusta. Google riceve i collegamenti tra le due versioni (`hreflang`), quindi mostra a ogni persona la lingua giusta.

Anche i messaggi automatici partono nella lingua della pagina da cui il cliente ha scritto, e l'assistente virtuale risponde nella lingua della domanda.

**Per aggiungere un'altra lingua** (per esempio rumeno o spagnolo) serve un nuovo dizionario come `en.mjs`, le versioni tradotte dei messaggi automatici e dei modelli WhatsApp e la voce nell'elenco `lingue` di `config.js`. Chiedimelo: il generatore è già pronto.

---

## 5. Fase 4: mettere il sito online (Netlify, gratis)

Consiglio **Netlify**: hosting gratuito, HTTPS automatico, moduli di contatto senza server e le funzioni automatiche (Telegram e assistente).

### Opzione A: in 5 minuti, per provare
1. Vai su [app.netlify.com/drop](https://app.netlify.com/drop) e crea un account.
2. Trascina nella pagina la cartella **`sito`**, non tutta `nuovo-progetto`: così piano e documenti restano privati.
3. Ricevi subito un indirizzo del tipo `nome-a-caso.netlify.app`.

Con questa opzione il sito funziona, in italiano e in inglese, ma le automazioni (Telegram, gestionale, messaggi, monitoraggio, assistente) no: servono l'opzione B.

### Opzione B: collegato a GitHub (consigliata)
Ogni modifica caricata su GitHub aggiorna il sito da sola. Il sito è già sul branch `main` del repository `gabriel-` e le impostazioni per Netlify sono già pronte.
1. Vai su [app.netlify.com/signup](https://app.netlify.com/signup) e scegli **Sign up with GitHub**: l'account è gratuito.
2. Scegli **Add new project → Import an existing project → GitHub**. Autorizza Netlify a vedere il repository `gabriel-` e selezionalo.
3. Lascia tutti i campi come sono, con il branch `main`. Il resto lo legge da solo dai file `netlify.toml`:
   - la cartella `nuovo-progetto`;
   - la cartella da pubblicare;
   - le funzioni;
   - il comando `npm run genera`, che a ogni pubblicazione rigenera le pagine da `config.js`.
4. Premi **Deploy**. Dopo un paio di minuti il sito è online a un indirizzo del tipo `nome-a-caso.netlify.app`.
5. Per un indirizzo più bello, apri **Site configuration → Change site name** e scrivi per esempio `gabrieltech`: il sito diventa `gabrieltech.netlify.app`, se il nome è libero.

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
- **Prenotazione** (`prenota.html`) con i tuoi orari veri: il cliente sceglie giorno e ora e la richiesta arriva nei moduli di Netlify e, se lo attivi, nel gestionale e su Telegram.
- **Versione in inglese** di tutto il sito, con il pulsante EN/IT (vedi «Il sito in altre lingue» nella Fase 3).
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
Ogni richiesta dai moduli ti arriva subito su Telegram, con il link per scrivere al cliente su WhatsApp e quello per gestirla nel pannello. Qui arrivano anche gli avvisi del monitoraggio dei PC.
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
- **Prezzi e orari** li prende da soli da `config.js`. Se aggiungi un servizio nuovo, va aggiunto anche nelle istruzioni in `netlify/functions/assistente.mjs`.
- **Lingua:** risponde in italiano o in inglese, come la domanda.
- **Protezione dalla spesa:** oltre al limite di spesa su Anthropic, ogni visitatore può fare al massimo 30 domande all'ora.
- **Privacy:** le domande vengono elaborate da Anthropic, come già scritto nell'informativa privacy.

### Il pannello del tecnico (`/tecnico/`)
Una pagina solo per te, non indicizzata da Google: salvala nei preferiti. Ha tre sezioni:
- **Strumenti:**
  - controllo delle impostazioni di `config.js` e dei servizi collegati su Netlify, con i pulsanti per provarli;
  - messaggi pronti per WhatsApp;
  - codici QR di sito, WhatsApp, recensioni e guida AnyDesk;
  - materiali da stampare: volantino A5, biglietto da visita e buono regalo. Dalla finestra di stampa scegli «Salva come PDF» e mandalo in tipografia.
- **Richieste:** il gestionale di richieste e appuntamenti (sotto).
- **Monitoraggio:** lo stato dei PC degli abbonati (sotto).

Le pagine del pannello si possono aprire, ma i dati dei clienti compaiono **solo dopo l'accesso con la tua chiave** (`ADMIN_TOKEN`), che resta salvata solo sul dispositivo che usi.

### Gestionale e messaggi automatici
Ogni richiesta dai moduli del sito finisce nel pannello, in **Richieste**. Da lì:
1. **Confermi l'appuntamento** scegliendo data e ora: al cliente parte subito la conferma.
2. **Qualche ora prima** gli arriva il promemoria, mai di notte (per gli appuntamenti presto al mattino arriva la sera prima).
3. Quando premi **Fatto**, il giorno dopo gli arriva la richiesta di recensione.

Puoi anche inserire a mano i clienti che ti chiamano o ti scrivono su WhatsApp («Nuova voce»), spostare o annullare un appuntamento, aggiungere note ed eliminare una richiesta. Le richieste più vecchie di 12 mesi si cancellano da sole, come dice l'informativa privacy.

**Chi riceve cosa:**
- **Email:** ricevuta della richiesta, conferma e promemoria a chi lascia l'indirizzo. La richiesta di recensione solo a chi ha dato il consenso.
- **WhatsApp:** solo a chi ha spuntato la casella del consenso, al massimo 3 messaggi: conferma, promemoria e recensione.
- Ogni messaggio parte nella lingua del cliente (italiano o inglese). Nel pannello vedi quali messaggi sono partiti e quali no.

**1. Attiva il gestionale.** Nel pannello, sotto «Accesso», premi «Genera una chiave sicura» e copiala. In Netlify apri **Site configuration → Environment variables** e aggiungi:
- `ADMIN_TOKEN`: la chiave copiata;
- `SITE_URL`: il tuo indirizzo, per esempio `https://www.gabrieltech.it`.

Ripubblica il sito e accedi al pannello con la chiave. Non serve nessun database: l'archivio è Netlify Blobs, compreso nel piano gratuito.

**2. Email automatiche.** Scegli uno dei due servizi, entrambi con un piano gratuito:
- **Brevo** (azienda francese): circa 300 email al giorno gratis. In **SMTP & API → API Keys** crea una chiave, poi aggiungi la variabile `BREVO_API_KEY`.
- **Resend**: circa 3.000 email al mese gratis. Crea una chiave, poi aggiungi la variabile `RESEND_API_KEY`.

In entrambi i casi:
1. Verifica il tuo dominio seguendo le istruzioni del servizio. Serve per non finire nello spam, quindi ti serve un dominio tuo.
2. Aggiungi la variabile `EMAIL_MITTENTE`, per esempio `Gabriel Tech <assistenza@gabrieltech.it>`.

Le risposte dei clienti arrivano all'email scritta in `config.js`.

**3. WhatsApp automatico** (facoltativo, il più impegnativo). Usa la **WhatsApp Business Platform** (Cloud API) di Meta. Serve un numero diverso da quello che usi nell'app WhatsApp Business, oppure devi spostare quel numero sulla piattaforma.
1. Su [developers.facebook.com](https://developers.facebook.com) crea un'app di tipo «Business» e aggiungi il prodotto **WhatsApp**.
2. Collega il numero e verifica la tua attività nel Business Manager.
3. Crea un **utente di sistema** con un token permanente e il permesso `whatsapp_business_messaging`.
4. Aggiungi le variabili:
   - `WHATSAPP_TOKEN`: il token;
   - `WHATSAPP_PHONE_ID`: l'ID del numero, non il numero stesso.
5. In **WhatsApp Manager → Modelli di messaggio** crea questi tre modelli, categoria **Utility**, in italiano (`it`) e in inglese (`en`), con questi nomi esatti. Il sito inserisce da solo nome e data al posto di {{1}} e {{2}}.

| Nome | Italiano | Inglese |
|---|---|---|
| `gt_conferma` | Ciao {{1}}, confermo il nostro appuntamento di assistenza di {{2}} (ora italiana). Qualche minuto prima tieni pronto AnyDesk: trovi la guida sul sito. Per cambiare orario rispondi a questo messaggio. | Hi {{1}}, your remote support appointment is confirmed for {{2}} (Italian time). A few minutes before, please have AnyDesk ready: the guide is on the website. To change the time, just reply to this message. |
| `gt_promemoria` | Ciao {{1}}, ti ricordo l'appuntamento di assistenza di {{2}} (ora italiana). Tieni il computer acceso e AnyDesk aperto. Se hai un imprevisto, rispondi a questo messaggio. | Hi {{1}}, a reminder of your remote support appointment on {{2}} (Italian time). Please keep your computer on and AnyDesk open. If something comes up, just reply to this message. |
| `gt_recensione` | Ciao {{1}}, com'è andata con il tuo dispositivo dopo l'intervento? Se sei soddisfatto, una recensione mi aiuta tantissimo: {{2}} Grazie! | Hi {{1}}, how is your device doing after our session? If you're happy, a review helps me a lot: {{2}} Thank you! |

Meta approva i modelli in genere in poche ore. Ogni messaggio ha un piccolo costo, di solito pochi centesimi: controlla il listino di Meta per l'Italia.

**4. Prova tutto.** Nel pannello, in «Servizi collegati», usa i pulsanti **Prova Telegram**, **Prova email** e **Prova WhatsApp**. La prova WhatsApp usa il modello `hello_world`, che Meta crea da solo. Poi fai una prenotazione di prova dal sito, confermala nel pannello con il tuo numero e controlla che arrivino conferma e promemoria.

I promemoria e le richieste di recensione li manda una funzione che Netlify esegue da sola ogni ora (`automazioni`): non devi attivare niente.

### Monitoraggio dei PC degli abbonati
Un piccolo programma, in **sola lettura**, controlla ogni giorno lo stato del computer dell'abbonato e te lo manda nel pannello, in **Monitoraggio**. Controlla:
- spazio e salute dei dischi;
- antivirus (acceso e aggiornato) e firewall;
- aggiornamenti di Windows e riavvii in sospeso;
- data dell'ultimo backup;
- da quanti giorni il PC non viene riavviato;
- sul Mac: FileVault, Gatekeeper e protezione di sistema.

Se qualcosa non va ti arriva un avviso su Telegram, una volta sola per ogni problema nuovo. Se un PC non si fa sentire per 3 giorni, ricevi un avviso anche per quello. Così spesso sistemi un disco pieno o un backup fermo prima che il cliente se ne accorga: è il valore in più degli abbonamenti.

**Cosa non fa:** non legge file, email o foto e non permette di controllare il computer. Per collegarti serve sempre AnyDesk, con il permesso del cliente.

**Come si aggiunge un PC** (serve il gestionale attivo):
1. **Prima chiedi il consenso al cliente** e spiegagli cosa controlla il programma. Il monitoraggio è già descritto nelle condizioni e nella privacy.
2. Nel pannello, in **Monitoraggio**, premi «Aggiungi un PC», scrivi il nome (per esempio «Studio Rossi · PC reception») e, se c'è, la cartella del backup (per esempio `E:\Backup`, meglio un disco del computer o USB).
3. Collegato con AnyDesk:
   - scarica sul PC del cliente lo script dal link nel pannello;
   - apri **PowerShell come amministratore** (sul Mac, il **Terminale**);
   - incolla il comando che ti mostra il pannello.

   Dopo un minuto il PC compare nell'elenco.

**Per toglierlo** premi «Rimuovi il monitoraggio»: al controllo successivo il programma si disinstalla da solo e i dati dei controlli vengono cancellati. In alternativa puoi toglierlo dal PC con il comando indicato nel pannello. Toglilo sempre quando finisce un abbonamento.

**Quando i PC diventano tanti** (per esempio oltre 30–50, o aziende che vogliono aggiornamenti automatici e antivirus gestito), valuta un programma professionale di gestione a distanza (RMM) come NinjaOne, Atera o Tactical RMM.

### Riepilogo delle variabili di Netlify
Si impostano in **Site configuration → Environment variables**. Dopo ogni modifica, ripubblica il sito.

| Variabile | A cosa serve | Obbligatoria? |
|---|---|---|
| `SITE_URL` | Il tuo indirizzo, per esempio `https://www.gabrieltech.it` | Consigliata |
| `ADMIN_TOKEN` | Chiave del pannello: gestionale e monitoraggio (almeno 24 caratteri) | Per il gestionale |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Avvisi sul tuo telefono | Facoltative |
| `BREVO_API_KEY` oppure `RESEND_API_KEY`, e `EMAIL_MITTENTE` | Email automatiche ai clienti | Facoltative |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | WhatsApp automatico | Facoltative |
| `WHATSAPP_API_VERSION` | Versione delle API di Meta (se non la metti: `v23.0`) | Facoltativa |
| `ANTHROPIC_API_KEY` | Assistente virtuale | Facoltativa |

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

## 8bis. Velocità del sito

### Cosa rallentava lo scorrimento
Le misure fatte nel browser hanno trovato due cause, che insieme si moltiplicavano:
- **la scena 3D si ridisegnava sempre**, 60 volte al secondo anche a pagina ferma, e quasi alla risoluzione piena dello schermo;
- **i riquadri «vetro» sfocavano ciò che c'era dietro** (l'effetto `backdrop-filter`). Sopra una scena 3D in movimento, il browser doveva rifare la sfocatura di ogni riquadro visibile a ogni fotogramma: con decine di riquadri, il telefono o il computer non ce la facevano.

Le animazioni che accompagnano lo scorrimento, invece, pesano pochissimo e sono rimaste.

### Fase 1: fatto
1. **Vetro:** la sfocatura vera resta solo sulla barra in alto, più leggera. I riquadri hanno un vetro più pieno, che a colpo d'occhio sembra uguale.
2. **Scena 3D più leggera:**
   - risoluzione ridotta (1,25 volte sui computer, 1 sui telefoni): per uno sfondo decorativo non si nota;
   - a pagina ferma si ridisegna 30 volte al secondo con la G in vista e circa 10 senza; a pieno ritmo solo mentre scorri o muovi il mouse;
   - qualità automatica per tutta la visita: se il dispositivo fatica, scende di risoluzione, poi a 30 fotogrammi al secondo, poi toglie metà delle forme;
   - niente 3D sui telefoni con meno di 4 GB di memoria: resta il logo normale.
3. **Meno lavoro nascosto:**
   - la posizione della G si misura solo quando cambia l'impaginazione, non a ogni fotogramma;
   - sui telefoni, la barra del browser che appare e scompare non ricrea più la scena;
   - gli effetti del mouse si aggiornano al massimo una volta per fotogramma.

**Risultati** (stessa prova prima e dopo: 2 secondi a pagina ferma e 40 scatti di rotellina, su un computer senza scheda grafica, quindi con numeri più bassi di un dispositivo vero):

| Prova | Prima | Dopo |
|---|---|---|
| Telefono, home, mentre scorri | 33 fotogrammi al secondo, 35 scatti | 55 fotogrammi al secondo, 18 scatti |
| Telefono, home, pagina ferma | 25 fotogrammi al secondo | 59 fotogrammi al secondo, nessuno scatto |
| Telefono, pagina di un servizio, mentre scorri | 71 fotogrammi al secondo, 7 scatti | 120 fotogrammi al secondo, nessuno scatto |
| Computer, home, mentre scorri | 22 fotogrammi al secondo, 137 scatti | 34 fotogrammi al secondo, 76 scatti |
| Computer, pagina di un servizio, mentre scorri | 22 fotogrammi al secondo, 123 scatti | 38 fotogrammi al secondo, 61 scatti |

Uno «scatto» è un fotogramma che resta sullo schermo più di un ventesimo di secondo: è quello che si percepisce come scorrimento a singhiozzo. Su un telefono o un computer veri, con la loro scheda grafica, i numeri sono più alti.

### Seconda tornata: fatto
Dopo la prima correzione la navigazione tra le pagine era ancora lenta. Le misure su un telefono lento simulato hanno trovato altre due cause: la scena 3D si ricaricava a ogni pagina, e alcune animazioni decorative ricalcolavano la pagina circa 60 volte al secondo, anche quando non si vedevano.
1. **3D solo dove serve:**
   - la G in 3D c'è solo nella home e solo sui computer con scheda grafica;
   - telefoni e pagine interne mostrano il logo normale e si aprono molto più in fretta;
   - la scena si ferma dopo la prima parte della home;
   - se il computer non ha la scheda grafica o va a scatti, la scena si spegne da sola.
2. **Animazioni leggere:**
   - le animazioni decorative ora le fa la scheda grafica, senza ricalcolare la pagina;
   - si fermano quando non si vedono;
   - sui telefoni la comparsa dei blocchi è più semplice, senza rotazione 3D.
3. **Pagine pronte in anticipo:** con Chrome ed Edge, quando il mouse si ferma su un link la pagina viene preparata prima del clic, così si apre all'istante.

| Prova (telefono lento simulato) | Prima | Dopo |
|---|---|---|
| Home: lavoro che blocca la pagina | 1,9 secondi | 0,6 secondi |
| Home: dati da scaricare | 805 KB | 117 KB |
| Pagina di un servizio: lavoro che blocca la pagina | 0,5 secondi | 0,2 secondi |
| Computer senza scheda grafica, home ferma | 8 fotogrammi al secondo | 56 fotogrammi al secondo |
| Telefono, home mentre scorri | 55 fotogrammi al secondo, 18 scatti | 60 fotogrammi al secondo, nessuno scatto |

### Fase 2: da fare solo se serve
1. **Misura sul tuo telefono.** Apri il sito e scorri la home e una pagina dei servizi. Se scatta ancora, dimmi il modello del telefono e il browser.
2. **Controllo gratuito di Google:** su [pagespeed.web.dev](https://pagespeed.web.dev) incolla l'indirizzo del sito e guarda il risultato «Dispositivi mobili». Ripetilo una volta al mese e dopo ogni modifica grande.
3. **Se qualche telefono resta lento:** la scena 3D solo nella prima schermata, cioè la G, senza le forme che fluttuano lungo la pagina.
4. **Peso della pagina:**
   - la libreria 3D (Three.js) pesa circa 180 KB compressi e si carica dopo la pagina, quindi non la rallenta; si può ridurre di circa metà con una versione su misura;
   - la tua foto pesa poco: il sito ne prepara da solo due versioni WebP leggere (160 e 480 pixel).
5. **Cache:** i file che cambiano raramente (logo, immagini, libreria 3D) possono restare nella memoria del browser più a lungo, così chi torna sul sito lo apre subito.

---

## 8ter. La fiducia al centro

Chi chiede assistenza da remoto fa entrare uno sconosciuto nel proprio computer: prima di tutto deve fidarsi. Il sito ora lo dice in ogni punto in cui il cliente decide.

### Fatto
- **La tua foto, rotonda, in quattro punti:**
  - nell'apertura della home, accanto a «Ti rispondo io, di persona»;
  - nelle pagine dei servizi e in quella della prenotazione;
  - grande in «Chi sono», con un anello colorato che gira mentre scorri;
  - in un cerchio che accompagna lo scorrimento: sul computer in basso a sinistra, con la disponibilità del momento; sul telefono dentro il pulsante WhatsApp.

  La foto è `sito/assets/foto.jpg`, già ritagliata sul volto e senza dati nascosti (posizione, telefono).
- **Testi riscritti sulla fiducia:**
  - il prezzo lo dici prima, per iscritto, e non cambia senza il sì del cliente;
  - «se non risolvo, non paghi»;
  - paga alla fine, con fattura;
  - vede tutto e chiude quando vuole;
  - risponde e si collega sempre la stessa persona, niente call center.
- **«Chi sono» subito dopo l'apertura della home**, in un riquadro tutto tuo:
  - la tua foto grande e il titolo «Ci metto la faccia»;
  - un testo in prima persona: 15 anni di lavoro, rispondi e ti colleghi sempre tu, la fiducia te la vuoi guadagnare;
  - «Cosa ti prometto»: sei una persona di parola, i dati non si perdono, la connessione è sicura, fai le cose per bene;
  - anni di esperienza, città e fattura elettronica, più la P.IVA quando la inserisci.
- **Verifica del numero** nella sezione Sicurezza: chi riceve una chiamata «a nome tuo» scrive il numero e il sito gli dice subito se sei davvero tu. È la difesa più diretta contro la truffa del finto tecnico.
- **Due nuove domande frequenti:** «Chi c'è dietro Gabriel Tech?» e «Come faccio a sapere che sei davvero tu?».
- **Per Google:** la città è nei dati dell'attività, e il tuo nome ci va da solo quando lo scrivi in `config.js`.
- **Niente segnaposto in vista:** finché nome e P.IVA non ci sono, il sito mostra «Gabriel Tech» invece delle parentesi quadre.

### Come cambiare la foto (2 minuti, anche dal telefono)
1. Scegli una foto vera:
   - viso ben illuminato, sorriso, sfondo semplice;
   - meglio quadrata o verticale;
   - non importa se è grande: il sito la alleggerisce da solo.
2. Rinominala **`foto.jpg`**, come quella di adesso.
3. Apri [questa pagina di GitHub](https://github.com/gabigabriel111coder/gabriel-/upload/main/nuovo-progetto/sito/assets), trascina la foto e premi **Commit changes**: la nuova prende il posto della vecchia.
4. Netlify ripubblica il sito da solo: dopo un paio di minuti la foto nuova compare in tutti e quattro i punti.

Il sito la ritaglia da solo, cercando il volto. Se il risultato non ti convince, ritagliala prima tu, quadrata, oppure mandamela e la preparo io.

### Da fare, in ordine di importanza
1. **Nome e cognome e P.IVA** in `config.js` (`titolare` e `piva`): compaiono in «Chi sono», sotto la foto, a piè di pagina e nei dati per Google. Un nome vero vale più di qualsiasi slogan.
2. **Scheda dell'attività su Google** (gratis), con sede a Bassano del Grappa, orari e foto. È il primo posto dove la gente controlla se esisti davvero. Poi copia il link «Chiedi recensioni» in `config.js` (`linkRecensioneGoogle`).
3. **Le prime 5 recensioni vere**, chieste ai primi clienti soddisfatti: il sito le mostra da solo quando le scrivi in `config.js` (`recensioni`), con il permesso di chi le ha scritte.
4. **Video di presentazione di 30 secondi** (`video` in `config.js`): la tua faccia e la tua voce che spiegano come lavori. Convince più di ogni testo.

### Altre opzioni e integrazioni
| Opzione | Cosa dà | Costo | Chi la fa |
|---|---|---|---|
| **Rapporto d'intervento** via email: a fine lavoro il cliente riceve cosa hai fatto, in 3 righe | Trasparenza, e un ricordo scritto che fa tornare il cliente | Gratis | Posso aggiungerlo io al gestionale |
| **Garanzia di 7 giorni**: se lo stesso problema si ripresenta, ricontrolli gratis | Toglie l'ultimo dubbio prima di pagare | Il tuo tempo | Decidi tu, poi aggiorno testi e condizioni |
| **Pagamenti con Stripe o PayPal** (`pagamenti` in `config.js`) | Il cliente paga con la protezione acquisti del suo circuito | Solo commissioni | Crei i link, io li collego |
| **Trustpilot** (piano gratuito) | Recensioni verificate da un sito esterno. Si può collegare al gestionale per l'invito automatico | Gratis o a pagamento | Tu crei l'account, io lo collego |
| **Numero REA e Camera di Commercio** a piè di pagina | Prova che l'attività è registrata | Gratis | Mi dai il numero |
| **Assicurazione RC professionale**, citata in «Chi sono» e nelle condizioni | Rassicura aziende e professionisti | Da preventivo | Tu la stipuli, io aggiorno i testi |
| **Certificazioni** (per esempio Microsoft, CompTIA) come riquadri in «Chi sono» | Competenza dimostrata | Dipende | Mi mandi i nomi |
| **Profilo WhatsApp Business completo**: foto, indirizzo, orari, catalogo dei servizi | Chi ti scrive vede subito un'attività vera | Gratis | Tu, dal telefono |
| **Casi reali prima e dopo**, anonimi e con il consenso del cliente | Mostra risultati concreti | Gratis | Mi mandi i casi, io creo la sezione |

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
| Gestionale e monitoraggio (Netlify Blobs e funzioni, nei limiti del piano gratuito) | 0 € |
| Email automatiche (Brevo o Resend, piano gratuito) | 0 € |
| WhatsApp automatico (facoltativo) | pochi centesimi a messaggio, secondo il listino di Meta |
| Stripe, PayPal, SumUp, Satispay | nessun canone di base, solo una commissione sui pagamenti |
| Assistente virtuale (facoltativo) | in genere pochi euro al mese, con il limite di spesa che scegli tu |

**Esempio:** con AnyDesk e la SIM spendi circa 35–40 € al mese. Bastano un intervento Completo e un Rapido al mese per coprirli, prima di tasse e contributi. Ogni abbonamento Famiglia o Professionisti rende l'entrata più stabile.

---

## 10. Prossimi passi che posso fare io

1. Collegare il tuo dominio e aggiornarlo in `config.js`, quando lo compri.
2. Inserire i tuoi dati veri: nome e cognome, P.IVA e dominio.
3. Aggiungere altre lingue oltre all'inglese (rumeno, spagnolo, arabo…), per raggiungere le comunità straniere in Italia: dimmi quali.
4. Scrivere altre guide (una al mese aiuta molto su Google) e pagine per le domande più frequenti dei tuoi clienti.
5. Collegare i link di pagamento, il calendario, le email, WhatsApp e l'assistente quando hai creato gli account.

---

## Fonti della ricerca

- Tendenze di design 2026 (Liquid Glass, bento grid, 3D): [theplusaddons.com](https://theplusaddons.com/blog/web-design-trends-2026/), [gezar.dk](https://gezar.dk/en/blog/web-design-trends-2026), [studiomeyer.io](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check), [rajeshrnair.com](https://rajeshrnair.com/blog/design/ui-ux/ui-design-trends-2026-bento-grids-glassmorphism.html)
- Prezzi e servizi dell'assistenza remota in Italia: [Computer Wizard](https://www.computerwizard.it/modalita-assistenza/assistenza-remota-privati/), [ALE.A.](https://www.assistenzaconsulenzainformatica.it/richiesta-di-assistenza-remota/), [Amico Informatico](https://www.amicoinformatico.it/assistenza-remota/), [Webbo.eu](https://www.webbo.eu/assistenza-da-remoto/), [Bulltech: contratti IT 2026](https://bulltech.it/blog/costo-contratto-assistenza-it-2026), [Cronoshare](https://www.cronoshare.it/quanto-costa/manutenzione-informatica-aziende)
- Licenze e prezzi AnyDesk: [anydesk.com/pricing](https://anydesk.com/en/pricing), [costbench.com](https://costbench.com/software/remote-desktop/anydesk/), [realvnc.com](https://www.realvnc.com/en/blog/anydesk-pricing/)
- Truffe del finto supporto tecnico: [Polizia di Stato](https://www.poliziadistato.it/articolo/la-polizia-postale-informa--attenzione-alle-truffe-tramite-spoofing), [Itaca Notizie, giugno 2026](https://itacanotizie.it/2026/06/28/falsa-assistenza-denaro-truffe-polizia-postale/), [HelpWire](https://www.helpwire.app/blog/avoid-anydesk-scams/)
- Fine del supporto a Windows 10 ed ESU: [Microsoft](https://www.microsoft.com/en-us/windows/end-of-support), [Microsoft ESU](https://www.microsoft.com/en-us/windows/extended-security-updates)
