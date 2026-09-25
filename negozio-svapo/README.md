# Nebbia Vape Atelier — sito del negozio di sigarette elettroniche

Sito di una pagina, veloce e senza dipendenze: catalogo dei liquidi con filtri e ricerca,
scheda prodotto (formato, nicotina, quantità) e **prenotazione con ritiro in negozio**.

## Cosa fa

- **Verifica dell'età** all'ingresso (ricordata sul dispositivo) e avvertenza sulla nicotina nel piè di pagina.
- **Catalogo**: 12 liquidi in 4 famiglie (tabaccosi, fruttati, freschi, cremosi), flaconi disegnati in CSS con il colore del gusto.
- **Prenotazione**: il cliente sceglie giorno e fascia oraria (calcolati dagli orari del negozio, con 2 ore di preavviso),
  lascia nome e cellulare e riceve un codice tipo `NB-7KQ2`. Paga al ritiro.
- **Arrivo della prenotazione**:
  - pubblicato su Netlify, il modulo usa **Netlify Forms**: trovi ogni prenotazione in *Forms → prenotazione*
    e puoi attivare le notifiche via email;
  - su qualsiasi altro hosting il cliente la invia con un tocco su **WhatsApp**, già scritta.
- Tema scuro e chiaro automatico, pensato prima per il telefono.

## Da personalizzare (tutto in `app.js`, in alto)

- `NEGOZIO`: nome, indirizzo, telefono, numero WhatsApp, link di Google Maps, P.IVA e licenza ADM, orari.
- `LIQUIDI`: nome, famiglia, note, descrizione, due colori del flacone, formati disponibili,
  `badge` (es. «Novità») e `scorte` per mostrare «Ultimi N».
- `FORMATI`: prezzi e livelli di nicotina.

Il nome «Nebbia» e il logo sono segnaposto: cambiali in `index.html` (logo, titolo, gusto del mese).

## Metterlo online

Trascina la cartella `negozio-svapo` su <https://app.netlify.com/drop>, oppure crea un nuovo sito Netlify
da questo repository con *Base directory* `negozio-svapo`.

Per provarlo in locale: `python3 -m http.server` dentro la cartella e apri <http://localhost:8000>.

## Nota legale

In Italia la vendita a distanza dei liquidi con nicotina è limitata: per questo il sito prenota e non vende.
Verifica con il tuo consulente testi, avvertenze e informativa privacy prima di pubblicare.
