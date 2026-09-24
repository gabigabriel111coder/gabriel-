# Piano d'azione: dal sito al primo cliente

Questo piano spiega cosa c'è nel sito, perché è fatto così e cosa fare, in ordine, per metterlo online e iniziare a lavorare.

> Le parti legali e fiscali sono indicazioni generali, non una consulenza. Prima di aprire l'attività, verificale con un commercialista.

---

## In breve: la lista da spuntare

- [ ] **1. Fisco:** apri la partita IVA con un commercialista e scegli il codice ATECO giusto (vedi Fase 1).
- [ ] **2. AnyDesk:** acquista una licenza commerciale. La versione gratuita non si può usare per lavoro.
- [ ] **3. WhatsApp Business:** configuralo su un numero dedicato, con gli stessi orari del sito.
- [ ] **4. Pagamenti:** attiva un sistema di pagamento con link (carta, PayPal, Satispay) e un programma per la fattura elettronica.
- [ ] **5. Sito:** inserisci i tuoi dati: numero, nome, P.IVA, foto, prezzi e privacy (vedi Fase 3).
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
- **3D interattivo:** in alto c'è un Mac in 3D che ruota seguendo il mouse, con uno schermo animato che mostra una sessione di assistenza.

Scelte tecniche importanti:
- **Il 3D è fatto solo con CSS, senza librerie pesanti.** Il sito resta leggero e veloce anche sul telefono.
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
- **Profilo:** nome dell'attività, descrizione, sito e **orari identici a quelli del sito**.
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

Per vedere il sito sul computer, apri `index.html` con un doppio clic. Il modulo funziona solo quando il sito è online su Netlify.

| Cosa cambiare | Dove |
|---|---|
| **Numero di telefono, WhatsApp, email, orari** | `assets/main.js`, blocco `CONFIG` in alto. Si aggiornano da soli in tutto il sito, compreso lo stato «Disponibile ora» |
| Stessi dati, per Google | `index.html`: il blocco `application/ld+json` in alto (telefono, email, orari), il link del telefono e la tabella degli orari nella sezione Contatti |
| **Nome dell'attività** («Tecnico Remoto» è provvisorio) | `index.html` e `privacy.html`: usa «Trova e sostituisci» |
| **[Nome Cognome], [X] anni, P.IVA** | `index.html` (sezioni «Chi sono» e footer) e `privacy.html` |
| **Tua foto** | Metti la foto in `assets/` (per esempio `foto.jpg`). In `index.html`, nella sezione «Chi sono», sostituisci `<svg class="i"><use href="#i-user"/></svg>` con `<img src="assets/foto.jpg" alt="Nome Cognome">` e togli `aria-hidden="true"` dal riquadro. Una foto vera aumenta molto la fiducia |
| **Prezzi e pacchetti** | `index.html`, sezione `PREZZI`. Aggiorna anche i testi WhatsApp precompilati (attributi `data-wa="…"`) e la nota sotto i prezzi |
| **Dominio** (dopo averlo comprato) | `index.html`: `canonical`, `og:url` e `url` nel blocco `ld+json` (ora c'è `example.com`) |
| **Colori** | `assets/style.css`, variabili in cima al file (`--accent` è il blu principale) |
| **Privacy** | `privacy.html`: completa tutte le parti tra parentesi quadre |

**Attenzione:** il numero `+39 000 000 0000` e l'email `info@example.com` sono finti. Non pubblicare il sito prima di averli sostituiti.

---

## 5. Fase 4: mettere il sito online (Netlify, gratis)

Consiglio **Netlify** perché offre hosting gratuito, HTTPS automatico e riceve le richieste del modulo «Ti richiamo io» senza bisogno di un server.

### Opzione A: in 5 minuti, per provare
1. Vai su [app.netlify.com/drop](https://app.netlify.com/drop) e crea un account.
2. Trascina la cartella `nuovo-progetto` nella pagina.
3. Ricevi subito un indirizzo del tipo `nome-a-caso.netlify.app`.

### Opzione B: collegato a GitHub (consigliata)
Con questa opzione, ogni modifica caricata su GitHub aggiorna il sito da sola.
1. Prima porta la cartella sul branch `main` di GitHub. Posso aprire io la pull request.
2. In Netlify scegli **Add new project → Import an existing project → GitHub** e seleziona il repository `gabriel-`.
3. Imposta:
   - **Branch:** `main`
   - **Base directory:** `nuovo-progetto`
   - **Build command:** vuoto
   - **Publish directory:** `nuovo-progetto`
4. Premi **Deploy**.

### Attivare il modulo di contatto
1. In Netlify apri **Forms** e attiva il **rilevamento dei moduli (form detection)**, poi ripubblica il sito.
2. Apri **Forms → Form notifications** e aggiungi una **notifica email** verso il tuo indirizzo: così ricevi un'email per ogni richiesta di richiamata.
3. Fai una prova dal sito online.
4. Controlla i limiti del piano gratuito: il numero di invii al mese è limitato.

### Il tuo dominio
1. **Compra un dominio `.it`** (per esempio `nomecognome.it` o `nomebrand.it`) da un registrar italiano o europeo. Costa pochi euro l'anno.
2. In Netlify apri **Domain management → Add a domain** e segui le istruzioni per il DNS. Il certificato HTTPS è automatico.
3. **Email professionale** (per esempio `info@tuodominio.it`): di solito la offre lo stesso registrar, oppure puoi usare Zoho, Google Workspace o Microsoft 365.
4. **Aggiorna il sito:** inserisci il dominio in `canonical`, `og:url` e `ld+json` (Fase 3).

---

## 6. Fase 5: farsi trovare

1. **Profilo dell'attività su Google** (Google Business Profile):
   - crealo come attività **senza sede visibile**, che serve una zona;
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

**Benvenuto**
> Ciao! Sono [Nome], tecnico informatico da remoto. Raccontami in breve il problema e che dispositivo usi (PC Windows, Mac, telefono): ti dico subito se posso risolverlo a distanza e quanto costa.

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

**Esempio:** con AnyDesk e la SIM spendi circa 35–40 € al mese. Bastano un intervento Completo e un Rapido al mese per coprirli, prima di tasse e contributi. Ogni abbonamento Famiglia o Professionisti rende l'entrata più stabile.

---

## 10. Prossimi passi che posso fare io

1. Aprire la pull request per portare il sito su `main`, necessaria per l'Opzione B di Netlify.
2. Inserire i tuoi dati veri: nome, numero, P.IVA, foto, nome dell'attività.
3. Creare la pagina **Condizioni di servizio** e un'immagine di anteprima per le condivisioni su WhatsApp e social.
4. Creare una pagina per ogni servizio, per posizionarti meglio su Google.
5. Aggiungere la sezione recensioni quando avrai le prime recensioni vere.

---

## Fonti della ricerca

- Tendenze di design 2026 (Liquid Glass, bento grid, 3D): [theplusaddons.com](https://theplusaddons.com/blog/web-design-trends-2026/), [gezar.dk](https://gezar.dk/en/blog/web-design-trends-2026), [studiomeyer.io](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check), [rajeshrnair.com](https://rajeshrnair.com/blog/design/ui-ux/ui-design-trends-2026-bento-grids-glassmorphism.html)
- Prezzi e servizi dell'assistenza remota in Italia: [Computer Wizard](https://www.computerwizard.it/modalita-assistenza/assistenza-remota-privati/), [ALE.A.](https://www.assistenzaconsulenzainformatica.it/richiesta-di-assistenza-remota/), [Amico Informatico](https://www.amicoinformatico.it/assistenza-remota/), [Webbo.eu](https://www.webbo.eu/assistenza-da-remoto/), [Bulltech: contratti IT 2026](https://bulltech.it/blog/costo-contratto-assistenza-it-2026), [Cronoshare](https://www.cronoshare.it/quanto-costa/manutenzione-informatica-aziende)
- Licenze e prezzi AnyDesk: [anydesk.com/pricing](https://anydesk.com/en/pricing), [costbench.com](https://costbench.com/software/remote-desktop/anydesk/), [realvnc.com](https://www.realvnc.com/en/blog/anydesk-pricing/)
- Truffe del finto supporto tecnico: [Polizia di Stato](https://www.poliziadistato.it/articolo/la-polizia-postale-informa--attenzione-alle-truffe-tramite-spoofing), [Itaca Notizie, giugno 2026](https://itacanotizie.it/2026/06/28/falsa-assistenza-denaro-truffe-polizia-postale/), [HelpWire](https://www.helpwire.app/blog/avoid-anydesk-scams/)
- Fine del supporto a Windows 10 ed ESU: [Microsoft](https://www.microsoft.com/en-us/windows/end-of-support), [Microsoft ESU](https://www.microsoft.com/en-us/windows/extended-security-updates)
