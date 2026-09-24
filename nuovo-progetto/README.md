# Gabriel Tech: sito per l'assistenza informatica da remoto

Sito per offrire assistenza informatica solo da remoto, con AnyDesk:

- stile «Liquid Glass» ispirato ad Apple;
- tema 3D interattivo: la G del logo in 3D segue il mouse, si trascina col dito e gira quando scorri;
- 32 pagine in italiano e 26 in inglese: home, 12 servizi, 4 guide, prenotazione, guida AnyDesk, buono regalo, aziende, condizioni, privacy e pannello del tecnico;
- gestionale delle richieste con conferme, promemoria e richieste di recensione automatiche via email e WhatsApp;
- monitoraggio in sola lettura dei PC degli abbonati (Windows e Mac), con avvisi su Telegram.

**Leggi prima [PIANO-DI-AZIONE.md](PIANO-DI-AZIONE.md):** spiega le scelte, cosa personalizzare, come metterlo online e come attivare ogni funzione. Il logo, i colori e i file del brand sono in [BRAND.md](BRAND.md).

## Cartelle

| Cartella o file | Contenuto |
|---|---|
| `sito/` | Il sito: è l'unica cartella che va online |
| `sito/assets/config.js` | **Impostazioni**: numero, WhatsApp, orari, prezzi, dati dell'attività, dominio, link di pagamento, recensioni, video, offerte |
| `sito/en/` | Versione inglese, creata dal generatore |
| `sito/assets/main.js` | Funzioni del sito: disponibilità, diagnosi, prenotazione, moduli, tema, effetti |
| `sito/assets/scene3d.js` | Scena 3D: la G del logo e le forme fluttuanti (Three.js, in `sito/assets/vendor/`) |
| `sito/assets/assistente.js` | Finestra dell'assistente virtuale (si attiva da `config.js`) |
| `sito/assets/strumenti.js` | Pannello del tecnico: codici QR, messaggi pronti, stampe |
| `sito/assets/gestionale.js` | Pannello del tecnico: accesso, richieste, appuntamenti e PC monitorati |
| `sito/agent/` | Programmi di monitoraggio per Windows (PowerShell) e Mac |
| `sito/tecnico/` | Pannello del tecnico e materiali da stampare (non indicizzati) |
| `strumenti/` | Generatore di tutte le pagine, modello della home, testi di servizi e guide, dizionario inglese |
| `netlify/functions/` | Automazioni: richieste dai moduli, gestionale, promemoria ogni ora, monitoraggio, assistente virtuale |
| `netlify/lib/` | Parti comuni: archivio (Netlify Blobs), messaggi (Telegram, Brevo o Resend, WhatsApp), regole |
| `test/` | Prove automatiche delle automazioni |
| `netlify.toml` | Impostazioni di Netlify: rigenera le pagine e pubblica solo `sito/` |

## Comandi

```bash
npm run genera      # rigenera tutte le pagine (italiano e inglese) da config.js, modelli e testi
npm run anteprima   # apre il sito su http://localhost:8080 (serve Python)
npm test            # prova le automazioni con un archivio locale, senza inviare messaggi veri
```

Aprendo `sito/index.html` con un doppio clic il sito si vede, ma il 3D funziona solo con `npm run anteprima` o una volta online. I moduli inviano davvero le richieste solo su Netlify; negli altri casi propongono di mandare il messaggio su WhatsApp.
