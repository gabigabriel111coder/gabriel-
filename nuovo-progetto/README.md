# Gabriel Tech: sito per l'assistenza informatica da remoto

Sito di una pagina per offrire assistenza informatica solo da remoto, con AnyDesk. Contiene:

- servizi, prezzi e pacchetti;
- orari con lo stato «Disponibile ora» aggiornato in tempo reale;
- pulsanti WhatsApp;
- modulo «Ti richiamo io».

Lo stile è «Liquid Glass» ispirato ad Apple. C'è un tema 3D interattivo: la G del logo in 3D segue il mouse, si trascina col dito e gira quando scorri; intorno fluttuano forme lucide. La modalità scura è automatica.

**Leggi prima [PIANO-DI-AZIONE.md](PIANO-DI-AZIONE.md):** spiega le scelte, cosa personalizzare e come metterlo online. Il logo, i colori e i file del brand sono in [BRAND.md](BRAND.md).

## File

| File | Contenuto |
|---|---|
| `index.html` | La pagina del sito |
| `privacy.html` | Informativa privacy (modello da completare) |
| `assets/style.css` | Grafica. I colori sono in cima al file |
| `assets/main.js` | Numero, WhatsApp, email e orari nel blocco `CONFIG` in cima al file |
| `assets/scene3d.js` | Scena 3D: la G del logo e le forme fluttuanti |
| `assets/vendor/` | Three.js, la libreria 3D (licenza MIT) |
| `assets/brand/` | Logo, icone, foto profilo e immagine di anteprima |
| `assets/favicon.svg` | Icona della scheda del browser |
| `site.webmanifest` | Icona e nome quando si salva il sito sulla schermata Home |

## Vederlo sul computer

Apri `index.html` con un doppio clic. La scena 3D però funziona solo se il sito è servito da un server, come Netlify o `python3 -m http.server` nella cartella. Il modulo di contatto invia davvero le richieste solo una volta pubblicato su Netlify. Negli altri casi propone di mandare il messaggio su WhatsApp.
