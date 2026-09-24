// Funzioni di Netlify con un archivio Blobs locale e servizi esterni simulati
// (Telegram, Brevo, WhatsApp, Anthropic): nessun messaggio parte davvero.
import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BlobsServer } from "@netlify/blobs/server";
import { agenda, apri, pulisciLimiti, richieste } from "../netlify/lib/archivio.mjs";
import { romeToUtc, giornoRoma, spostaGiorno } from "../netlify/lib/utili.mjs";
import gestionale from "../netlify/functions/gestionale.mjs";
import monitor from "../netlify/functions/monitor.mjs";
import { handler as nuovaDalSito } from "../netlify/functions/submission-created.mjs";
import { messaggiProgrammati, pcSilenziosi } from "../netlify/functions/automazioni.mjs";

const TOKEN_BLOBS = "token-blobs";
const ADMIN = "chiave-segreta-lunga-almeno-24-caratteri";
let server, cartella, porta;
const inviati = [];
const fetchVero = globalThis.fetch;
const RISPOSTA_CLAUDE = {
  id: "msg_prova", type: "message", role: "assistant", model: "claude-opus-5",
  content: [{ type: "text", text: "L'intervento Rapido costa 25 €: guarda prenota.html." }],
  stop_reason: "end_turn", stop_sequence: null, usage: { input_tokens: 10, output_tokens: 12 }
};

const contesto = () => {
  const url = `http://127.0.0.1:${porta}`;
  process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ edgeURL: url, uncachedEdgeURL: url, token: TOKEN_BLOBS, siteID: "sito-prova" })).toString("base64");
};
const verso = (servizio) => inviati.filter((x) => x.url.includes(servizio));

before(async () => {
  cartella = await mkdtemp(join(tmpdir(), "gt-blobs-"));
  server = new BlobsServer({ directory: cartella, token: TOKEN_BLOBS });
  ({ port: porta } = await server.start());
  globalThis.fetch = async (url, opzioni = {}) => {
    const indirizzo = String(url instanceof Request ? url.url : url);
    if (/api\.telegram\.org|api\.brevo\.com|api\.resend\.com|graph\.facebook\.com|api\.anthropic\.com/.test(indirizzo)) {
      const corpo = url instanceof Request ? await url.text() : opzioni.body;
      inviati.push({ url: indirizzo, body: JSON.parse(corpo) });
      const risposta = indirizzo.includes("anthropic") ? RISPOSTA_CLAUDE : { ok: true };
      return new Response(JSON.stringify(risposta), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return fetchVero(url, opzioni);
  };
  Object.assign(process.env, {
    ADMIN_TOKEN: ADMIN,
    TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "42",
    BREVO_API_KEY: "chiave-brevo", EMAIL_MITTENTE: "Gabriel Tech <assistenza@esempio.it>",
    WHATSAPP_TOKEN: "token-wa", WHATSAPP_PHONE_ID: "1234567890"
  });
});
after(async () => {
  globalThis.fetch = fetchVero;
  await server.stop();
  await rm(cartella, { recursive: true, force: true });
});
beforeEach(() => {
  inviati.length = 0;
  contesto();
});

async function chiama(azione, dati = {}, chiave = ADMIN) {
  const res = await gestionale(new Request("https://sito.test/.netlify/functions/gestionale", {
    method: "POST",
    headers: { Authorization: `Bearer ${chiave}`, "Content-Type": "application/json" },
    body: JSON.stringify({ azione, ...dati })
  }));
  return { status: res.status, body: await res.json() };
}
const traDueGiorni = (ora) => `${spostaGiorno(giornoRoma(new Date()), 2)}T${ora}`;

test("gestionale: serve la chiave giusta", async () => {
  assert.equal((await chiama("stato", {}, "chiave-sbagliata-ma-lunga-abbastanza")).status, 401);
  const salvata = process.env.ADMIN_TOKEN;
  process.env.ADMIN_TOKEN = "corta";
  assert.equal((await chiama("stato", {}, "corta")).status, 503);
  process.env.ADMIN_TOKEN = salvata;
  const res = await chiama("stato");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.canali, { telegram: true, email: true, emailServizio: "Brevo", whatsapp: true });
  assert.equal((await chiama("azione-inventata")).status, 400);
  assert.equal((await chiama("toString")).status, 400);
});

test("modulo del sito: finisce nel gestionale, avvisa su Telegram e manda la ricevuta", async () => {
  const evento = {
    body: JSON.stringify({ payload: { form_name: "prenotazione", data: {
      nome: "Anna Bianchi", telefono: "347 1234567", email: "anna@esempio.it", lingua: "en", aggiornamenti: "si",
      servizio: "Quick fix · €25", giorno: "Tuesday 6 October", orario: "15:30", data: "2026-10-06", messaggio: "Printer offline", ip: "1.2.3.4"
    } } }),
    blobs: Buffer.from(JSON.stringify({ url: `http://127.0.0.1:${porta}`, token: TOKEN_BLOBS })).toString("base64"),
    headers: { "x-nf-site-id": "sito-prova", "x-nf-deploy-id": "prova" }
  };
  assert.equal((await nuovaDalSito(evento)).statusCode, 200);
  contesto();
  const [tg] = verso("telegram");
  assert.match(tg.body.text, /Nuova prenotazione[\s\S]*Anna Bianchi[\s\S]*Lingua: inglese · Messaggi WhatsApp: sì[\s\S]*tecnico\/richieste\.html/);
  const [mail] = verso("brevo");
  assert.equal(mail.body.to[0].email, "anna@esempio.it");
  assert.equal(mail.body.subject, "I've received your request · Gabriel Tech");
  assert.match(mail.body.textContent, /^Hi Anna,[\s\S]*for Tuesday 6 October at 15:30[\s\S]*\/en\/collegati\.html/);
  assert.equal(verso("graph.facebook").length, 0, "la ricevuta non passa da WhatsApp");

  const { body } = await chiama("richieste");
  const r = body.richieste.find((x) => x.nome === "Anna Bianchi");
  assert.equal(r.stato, "nuova");
  assert.equal(r.richiesto, romeToUtc("2026-10-06T15:30").toISOString());
  assert.deepEqual(r.messaggi.map((m) => `${m.tipo}:${m.canale}:${m.ok}`), ["ricevuta:email:true"]);
  assert.ok(!JSON.stringify(r).includes("1.2.3.4"));
});

test("appuntamento: conferma subito, promemoria e recensione programmati", async () => {
  const nuova = await chiama("nuova", { nome: "Luca Verdi", telefono: "+39 333 7654321", email: "luca@esempio.it", lingua: "it", consenso: true });
  assert.equal(nuova.status, 200);
  const id = nuova.body.richiesta.id;

  const conferma = await chiama("conferma", { id, appuntamento: traDueGiorni("15:30") });
  assert.equal(conferma.status, 200);
  const r = conferma.body.richiesta;
  assert.equal(r.stato, "confermata");
  assert.equal(r.appuntamento, romeToUtc(traDueGiorni("15:30")).toISOString());
  assert.equal(r.lavori.length, 1);
  const [mail] = verso("brevo");
  assert.equal(mail.body.subject, "Appuntamento confermato · Gabriel Tech");
  assert.match(mail.body.textContent, /^Ciao Luca,\n\nconfermo il nostro appuntamento di \S+ \d+ \S+ alle 15:30 \(ora italiana\)/);
  const [wa] = verso("graph.facebook");
  assert.match(wa.url, /\/v23\.0\/1234567890\/messages$/);
  assert.equal(wa.body.to, "393337654321");
  assert.equal(wa.body.template.name, "gt_conferma");
  assert.equal(wa.body.template.language.code, "it");
  assert.equal(wa.body.template.components[0].parameters[0].text, "Luca");
  assert.match(wa.body.template.components[0].parameters[1].text, /alle 15:30$/);

  // Il promemoria parte quando arriva la sua ora, una volta sola
  inviati.length = 0;
  const quando = new Date(Number(r.lavori[0].split("_")[0]));
  assert.equal(quando.toISOString(), romeToUtc(traDueGiorni("12:30")).toISOString());
  assert.deepEqual(await messaggiProgrammati(new Date(quando.getTime() - 60e3)), []);
  const fatti = await messaggiProgrammati(new Date(quando.getTime() + 60e3));
  assert.deepEqual(fatti, [{ tipo: "promemoria", id, inviati: 2 }]);
  assert.equal(verso("graph.facebook")[0].body.template.name, "gt_promemoria");
  assert.deepEqual(await messaggiProgrammati(new Date(quando.getTime() + 120e3)), []);

  // Fatto: la richiesta di recensione è programmata per il giorno dopo
  const completa = await chiama("completa", { id });
  assert.equal(completa.body.richiesta.stato, "completata");
  assert.equal(completa.body.richiesta.lavori.length, 1);
  inviati.length = 0;
  const dopo = new Date(Number(completa.body.richiesta.lavori[0].split("_")[0]) + 60e3);
  assert.deepEqual((await messaggiProgrammati(dopo)).map((x) => x.inviati), [2]);
  const [waRec] = verso("graph.facebook");
  assert.equal(waRec.body.template.name, "gt_recensione");
  assert.equal(waRec.body.template.components[0].parameters[1].text, "https://www.example.com/recensione.html");
  const storico = (await chiama("richieste")).body.richieste.find((x) => x.id === id).messaggi.map((m) => `${m.tipo}:${m.canale}`);
  assert.deepEqual(storico, ["conferma:email", "conferma:whatsapp", "promemoria:email", "promemoria:whatsapp", "recensione:email", "recensione:whatsapp"]);
});

test("senza consenso: niente WhatsApp e niente richiesta di recensione", async () => {
  const { body } = await chiama("nuova", { nome: "Pia", telefono: "333 1111111", email: "pia@esempio.it", appuntamento: traDueGiorni("10:00") });
  assert.equal(body.richiesta.stato, "confermata");
  assert.deepEqual(inviati.map((x) => new URL(x.url).hostname), ["api.brevo.com"]);
  const completa = await chiama("completa", { id: body.richiesta.id });
  assert.deepEqual(completa.body.richiesta.lavori, []);
  assert.equal((await chiama("invia", { id: body.richiesta.id, tipo: "recensione" })).status, 400);
});

test("annullare o eliminare toglie i messaggi programmati", async () => {
  const { body } = await chiama("nuova", { nome: "Ugo", telefono: "333 2222222", consenso: true, appuntamento: traDueGiorni("16:00") });
  const id = body.richiesta.id;
  const lontano = new Date(Date.now() + 30 * 864e5);
  assert.ok((await agenda.scaduti(lontano)).some((l) => l.id === id));
  await chiama("annulla", { id });
  assert.ok(!(await agenda.scaduti(lontano)).some((l) => l.id === id));
  assert.equal((await chiama("conferma", { id, appuntamento: "2020-01-01T10:00" })).status, 400);
  assert.equal((await chiama("elimina", { id })).status, 200);
  assert.equal(await richieste.get(id), null);
  assert.equal((await chiama("completa", { id })).status, 404);
});

test("monitoraggio: chiave, avvisi solo per i problemi nuovi, rimozione", async () => {
  const creato = await chiama("nuovo-dispositivo", { nome: "Studio Rossi · PC reception", backup: 'E:\\Backup "$x"' });
  assert.equal(creato.status, 200);
  const { id, chiave, endpoint, backup } = creato.body.installa;
  assert.equal(endpoint, "https://sito.test/.netlify/functions/monitor"); // senza SITE_URL vale l'indirizzo del pannello
  assert.equal(backup, "E:\\Backup x");
  assert.equal(creato.body.dispositivo.chiave, undefined);

  const invia = (corpo, k = chiave) => monitor(new Request(endpoint, {
    method: "POST", headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, body: JSON.stringify(corpo)
  }));
  const report = {
    dispositivo: id, versione: 1, sistema: { nome: "Microsoft Windows 11 Pro" },
    dischi: [{ unita: "C:", totaleGB: 237, liberoGB: 3.1 }], firewall: { attivo: true }
  };
  assert.equal((await invia(report, "chiave-sbagliata")).status, 401);
  assert.equal((await invia({ ...report, dispositivo: "../x" })).status, 401);
  assert.equal(inviati.length, 0);

  assert.equal((await invia(report)).status, 200);
  assert.match(verso("telegram")[0].body.text, /Studio Rossi · PC reception\n🔴 Disco C: quasi pieno: 3 GB liberi su 237 GB/);
  inviati.length = 0;
  assert.equal((await invia(report)).status, 200);
  assert.equal(inviati.length, 0, "stesso problema: nessun nuovo avviso");

  const lista = (await chiama("dispositivi")).body.dispositivi;
  const d = lista.find((x) => x.id === id);
  assert.equal(d.problemi[0].codice, "disco:C:");
  assert.ok(d.ultimoContatto);

  // PC silenzioso da più di 3 giorni: un solo avviso
  assert.deepEqual(await pcSilenziosi(new Date(Date.now() + 4 * 864e5)), [id]);
  assert.deepEqual(await pcSilenziosi(new Date(Date.now() + 5 * 864e5)), []);
  inviati.length = 0;
  assert.equal((await invia(report)).status, 200);
  assert.match(verso("telegram")[0].body.text, /ripreso a inviare/);

  // Nuova chiave: la vecchia non vale più
  const nuova = await chiama("chiave-dispositivo", { id });
  assert.equal((await invia(report)).status, 401);
  assert.equal((await invia(report, nuova.body.installa.chiave)).status, 200);

  await chiama("revoca-dispositivo", { id });
  const revocato = await invia(report, nuova.body.installa.chiave);
  assert.equal(revocato.status, 410);
  assert.equal((await revocato.json()).disinstalla, true);
  await chiama("elimina-dispositivo", { id });
  assert.equal((await invia(report, nuova.body.installa.chiave)).status, 410);
  assert.ok(!(await chiama("dispositivi")).body.dispositivi.some((x) => x.id === id));
});

test("pulizia: richieste vecchie di un anno e contatori scaduti", async () => {
  const vecchio = (Date.now() - 400 * 864e5).toString(36).padStart(9, "0") + "abcdef12";
  await richieste.salva({ id: vecchio, nome: "Vecchio", stato: "completata" });
  assert.equal(await richieste.pulisci(365), 1);
  assert.equal(await richieste.get(vecchio), null);
  const limiti = apri("limiti");
  await limiti.setJSON("1/assistente/abc", { n: 3 });
  assert.ok((await pulisciLimiti()) >= 1);
  assert.equal(await limiti.get("1/assistente/abc"), null);
});

test("assistente: prezzi da config.js, lingua e limite di domande", async () => {
  process.env.ANTHROPIC_API_KEY = "chiave-di-prova";
  const { default: assistente, ISTRUZIONI } = await import("../netlify/functions/assistente.mjs");
  assert.match(ISTRUZIONI, /Intervento Rapido: 25 €/);
  assert.match(ISTRUZIONI, /Abbonamento Famiglia: 14,90 € al mese/);
  assert.match(ISTRUZIONI, /Monitoraggio \(solo abbonati/);
  const domanda = (ip, lingua = "it") => assistente(new Request("https://sito.test/.netlify/functions/assistente", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "Quanto costa?" }], lingua })
  }), { ip });
  const res = await domanda("203.0.113.7");
  assert.equal(res.status, 200);
  assert.equal((await res.json()).reply, RISPOSTA_CLAUDE.content[0].text);
  const chiamata = verso("anthropic")[0].body;
  assert.equal(chiamata.system[0].text, ISTRUZIONI);
  assert.deepEqual(chiamata.system[0].cache_control, { type: "ephemeral" });
  for (let i = 0; i < 29; i++) assert.equal((await domanda("203.0.113.7")).status, 200);
  const troppe = await domanda("203.0.113.7", "en");
  assert.equal(troppe.status, 429);
  assert.equal((await troppe.json()).error, "Too many questions right now: please try again shortly.");
  assert.equal((await domanda("198.51.100.9")).status, 200, "un altro visitatore non è bloccato");
  delete process.env.ANTHROPIC_API_KEY;
  assert.equal((await domanda("198.51.100.9")).status, 503);
});
