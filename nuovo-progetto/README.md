# Tecnico Remoto: sito per l'assistenza informatica da remoto

Sito di una pagina per offrire assistenza informatica solo da remoto, con AnyDesk. Contiene:

- servizi, prezzi e pacchetti;
- orari con lo stato «Disponibile ora» aggiornato in tempo reale;
- pulsanti WhatsApp;
- modulo «Ti richiamo io».

Lo stile è «Liquid Glass» ispirato ad Apple, con un Mac in 3D fatto solo in CSS. La modalità scura è automatica.

**Leggi prima [PIANO-DI-AZIONE.md](PIANO-DI-AZIONE.md):** spiega le scelte, cosa personalizzare e come metterlo online.

## File

| File | Contenuto |
|---|---|
| `index.html` | La pagina del sito |
| `privacy.html` | Informativa privacy (modello da completare) |
| `assets/style.css` | Grafica. I colori sono in cima al file |
| `assets/main.js` | Numero, WhatsApp, email e orari nel blocco `CONFIG` in cima al file |
| `assets/favicon.svg` | Icona della scheda del browser |

## Vederlo sul computer

Apri `index.html` con un doppio clic. Il modulo di contatto invia davvero le richieste solo una volta pubblicato su Netlify. Negli altri casi propone di mandare il messaggio su WhatsApp.
