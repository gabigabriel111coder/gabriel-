# Gabriel Tech: sito per l'assistenza informatica da remoto

Sito per offrire assistenza informatica solo da remoto, con AnyDesk:

- stile «Liquid Glass» ispirato ad Apple;
- tema 3D interattivo: la G del logo in 3D segue il mouse, si trascina col dito e gira quando scorri;
- 30 pagine: home, 12 servizi, 4 guide, prenotazione, guida AnyDesk, buono regalo, aziende, condizioni, privacy e pannello del tecnico.

**Leggi prima [PIANO-DI-AZIONE.md](PIANO-DI-AZIONE.md):** spiega le scelte, cosa personalizzare, come metterlo online e come attivare ogni funzione. Il logo, i colori e i file del brand sono in [BRAND.md](BRAND.md).

## Cartelle

| Cartella o file | Contenuto |
|---|---|
| `sito/` | Il sito: è l'unica cartella che va online |
| `sito/assets/config.js` | **Impostazioni**: numero, WhatsApp, orari, link di pagamento, recensioni, video, offerte |
| `sito/assets/main.js` | Funzioni del sito: disponibilità, diagnosi, prenotazione, moduli, tema, effetti |
| `sito/assets/scene3d.js` | Scena 3D: la G del logo e le forme fluttuanti (Three.js, in `sito/assets/vendor/`) |
| `sito/assets/assistente.js` | Finestra dell'assistente virtuale (si attiva da `config.js`) |
| `sito/assets/strumenti.js` | Pannello del tecnico: codici QR, messaggi pronti, stampe |
| `sito/tecnico/` | Pannello del tecnico e materiali da stampare (non indicizzati) |
| `strumenti/` | Generatore delle pagine interne e testi di servizi e guide |
| `netlify/functions/` | Notifica Telegram e assistente virtuale |
| `netlify.toml` | Impostazioni di Netlify: pubblica solo `sito/` |

## Comandi

```bash
npm run genera      # rigenera le pagine interne dopo aver cambiato testi o layout
npm run anteprima   # apre il sito su http://localhost:8080 (serve Python)
```

Aprendo `sito/index.html` con un doppio clic il sito si vede, ma il 3D funziona solo con `npm run anteprima` o una volta online. I moduli inviano davvero le richieste solo su Netlify; negli altri casi propongono di mandare il messaggio su WhatsApp.
