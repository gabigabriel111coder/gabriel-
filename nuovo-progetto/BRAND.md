# Gabriel Tech: guida al brand

## Il logo
Una **G** con il **puntatore del mouse** che clicca dentro: dice subito «assistenza informatica, fatta a distanza». Lo sfondo è un quadrato arrotondato stile app Apple, con uno sfumato dal blu al viola.

| File | Quando usarlo |
|---|---|
| `sito/assets/brand/logo-mark.svg` | Il simbolo in qualità perfetta a qualsiasi dimensione (sito, stampa, grafiche) |
| `sito/assets/brand/logo-horizontal.png` | Simbolo + scritta, su sfondi chiari (documenti, preventivi, firma email) |
| `sito/assets/brand/logo-horizontal-white.png` | Simbolo + scritta, su sfondi scuri o foto |
| `sito/assets/brand/profile-1024.png` | **Foto profilo** di WhatsApp Business, Google e social (regge il ritaglio rotondo) |
| `sito/assets/brand/og-image.png` | Anteprima che compare quando qualcuno condivide il sito su Facebook, WhatsApp o sui social: logo, titolo e la tua foto (`og-image-en.png` per le pagine in inglese) |
| `sito/assets/brand/icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Icona quando si salva il sito sulla schermata Home del telefono |
| `sito/assets/favicon.svg` | Icona nella scheda del browser |
| `sito/favicon.ico` | La stessa icona per i browser e i programmi che non leggono l'SVG |

**Regole:**
- lascia sempre spazio libero intorno al logo, almeno quanto metà del simbolo;
- non deformarlo, non cambiare i colori e non aggiungere ombre o contorni;
- sotto i 24 pixel usa solo il simbolo, senza la scritta.

## Colori

| Nome | Codice | Uso |
|---|---|---|
| Blu Gabriel | `#0A84FF` | Colore principale, inizio dello sfumato |
| Indaco | `#5E5CE6` | Centro dello sfumato |
| Viola | `#9B5CFF` | Fine dello sfumato, accenti |
| Verde acqua | `#2FD2B8` | Accento secondario (forme 3D, dettagli) |
| Verde WhatsApp | `#25D366` | Solo per i pulsanti WhatsApp |
| Grafite | `#1D1D1F` | Testi |
| Grigio chiaro | `#F5F5F7` | Sfondo |

## Caratteri
- **Sul sito:** il font del sistema. Su iPhone e Mac è SF Pro, lo stesso di Apple. Sugli altri dispositivi Windows e Android usano il loro equivalente. Nessun font scaricato: sito più veloce e nessun dato a terzi.
- **Per grafiche e stampa:** [Inter](https://rsms.me/inter/), gratuito, in grassetto per i titoli. È il font usato per le immagini del logo.

## Il tema 3D del sito
- **La G del logo in 3D** nell'hero:
  - segue il mouse;
  - si può trascinare col dito o col mouse;
  - gira quando scorri la pagina.
- **Forme lucide** (anelli, sfere, cubi, capsule e puntatori) fluttuano ai bordi della pagina:
  - si scansano al passaggio del mouse;
  - accelerano quando scorri.
- **Le schede si alzano in 3D** mentre entrano nello schermo, e il **Mac** in «Come funziona» ruota seguendo lo scorrimento.
- **Leggero e sicuro per tutti:**
  - la grafica 3D si carica solo dopo la pagina;
  - se il telefono fatica, abbassa la qualità da sola;
  - se il dispositivo non la supporta, o se l'utente ha chiesto meno animazioni, al suo posto resta il logo statico.
- **Icone in 3D:** le icone dei servizi hanno spessore e luce e ruotano al passaggio del mouse.
- **Cursore del brand:** con il mouse, il puntatore diventa la freccia sfumata del logo (`sito/assets/brand/cursor.svg`).
- **Tema chiaro e scuro:** segue il dispositivo, oppure si sceglie con il pulsante in alto e il sito se lo ricorda.
- La libreria 3D è [Three.js](https://threejs.org) (licenza MIT), inclusa nel sito in `sito/assets/vendor/`: non dipende da servizi esterni.

## Tono di voce
- **Dai del tu,** con frasi brevi e parole semplici, senza gergo tecnico.
- **Trasmetti calma e sicurezza:** «Vedi tutto quello che faccio», «Paghi solo a problema risolto».
- **Slogan:** *Il tuo computer, sistemato a distanza.*
- **Versione breve:** *Il tuo tecnico, a un clic.*
