/* ==========================================================================
   GABRIEL TECH · IMPOSTAZIONI DEL SITO
   Questo è l'unico file da modificare per i tuoi dati.
   Tutto quello che lasci vuoto ("") resta nascosto sul sito finché non lo compili.
   ========================================================================== */
window.CONFIG = {
  /* ---------- Contatti ---------- */
  phoneDisplay: "+39 000 000 0000", // come appare sul sito
  phoneLink: "+390000000000",       // per il tasto "Chiama": + prefisso e numero, senza spazi
  whatsapp: "390000000000",         // per WhatsApp: 39 e numero, senza + né spazi
  email: "info@example.com",
  sito: "https://www.example.com",  // il tuo dominio, senza barra finale (serve per codici QR e messaggi)

  /* ---------- Orari (ora italiana) ----------
     1 = lunedì … 6 = sabato, 0 = domenica. Più fasce per giorno. */
  hours: {
    1: [["09:00", "13:00"], ["14:30", "19:30"]],
    2: [["09:00", "13:00"], ["14:30", "19:30"]],
    3: [["09:00", "13:00"], ["14:30", "19:30"]],
    4: [["09:00", "13:00"], ["14:30", "19:30"]],
    5: [["09:00", "13:00"], ["14:30", "19:30"]],
    6: [["09:00", "13:00"]],
    0: []
  },
  whatsappText: "Ciao! Ho bisogno di assistenza informatica da remoto.",

  /* ---------- Prenotazioni ----------
     Vuoto = il sito mostra il suo calendario e ti manda la richiesta (modulo + WhatsApp).
     Se usi Cal.com o Calendly, incolla qui il link della tua pagina di prenotazione. */
  prenotazioneEsterna: "",

  /* ---------- Pagamenti online ----------
     Link di pagamento di Stripe, PayPal, SumUp o Satispay. I pulsanti compaiono solo se c'è il link. */
  pagamenti: {
    pacchetto5: "",     // Pacchetto 5 ore (179 €)
    famiglia: "",       // abbonamento Famiglia (14,90 €/mese)
    professionisti: "", // abbonamento Professionisti (39 €/mese)
    buono25: "",        // buono regalo Rapido
    buono45: "",        // buono regalo Completo
    buono179: "",       // buono regalo 5 ore
    areaAbbonati: ""    // portale clienti di Stripe: gli abbonati gestiscono pagamenti e fatture
  },

  /* ---------- Recensioni vere (sempre con il permesso del cliente) ----------
     Esempio: { nome: "Maria", luogo: "Torino", problema: "PC lento", testo: "Veloce e gentilissimo..." } */
  recensioni: [],
  linkRecensioneGoogle: "", // il link "Chiedi recensioni" del tuo profilo Google

  /* ---------- Video di presentazione (30 secondi) ----------
     Un file messo in assets/video/ (es. "assets/video/presentazione.mp4") oppure un link YouTube. */
  video: "",

  /* ---------- Canale WhatsApp con consigli e allerta truffe ---------- */
  canaleWhatsApp: "",

  /* ---------- Offerte stagionali ----------
     Compaiono da sole in alto nella home tra le date indicate (AAAA-MM-GG). */
  offerte: [
    { dal: "2026-09-01", al: "2026-09-30", testo: "Settembre: preparo il PC per la scuola, da remoto", link: "#contatti" },
    { dal: "2026-12-01", al: "2026-12-24", testo: "Natale: regala assistenza a chi ami", link: "regalo.html" }
    // Esempio da attivare togliendo le due barre:
    // , { dal: "2026-11-23", al: "2026-11-30", testo: "Black Friday: −20% sul Pacchetto 5 ore", link: "#prezzi" }
  ],

  /* ---------- Statistiche senza cookie ----------
     Il "token" di Cloudflare Web Analytics (gratis). Vuoto = nessuna statistica. */
  cloudflareAnalytics: "",

  /* ---------- Assistente virtuale ----------
     Metti true solo dopo aver inserito la chiave su Netlify (vedi PIANO-DI-AZIONE.md). */
  assistente: false
};
