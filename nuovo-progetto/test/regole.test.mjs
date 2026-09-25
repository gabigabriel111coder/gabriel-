// Regole senza rete: ora italiana, date dei messaggi, soglie del monitoraggio.
import assert from "node:assert/strict";
import { test } from "node:test";
import { quandoPromemoria, quandoRecensione, daModulo } from "../netlify/lib/gestione.mjs";
import { nuoviProblemi, pulisciReport, valuta } from "../netlify/lib/monitor.mjs";
import { dataDaId, formatRome, idValido, newId, romeParts, romeToUtc, waNumber } from "../netlify/lib/utili.mjs";

test("ora italiana: estate, inverno e cambio dell'ora", () => {
  assert.equal(romeToUtc("2026-07-10T15:30").toISOString(), "2026-07-10T13:30:00.000Z");
  assert.equal(romeToUtc("2026-12-10T15:30").toISOString(), "2026-12-10T14:30:00.000Z");
  assert.equal(romeToUtc("2026-10-25T12:00").toISOString(), "2026-10-25T11:00:00.000Z"); // giorno del ritorno all'ora solare
  assert.equal(romeToUtc("non una data"), null);
  assert.deepEqual(romeParts(new Date("2026-07-10T22:30:00Z")), { anno: 2026, mese: 7, giorno: 11, ora: 0, minuto: 30 });
  assert.match(formatRome(new Date("2026-10-06T13:30:00Z"), "it"), /^martedì 6 ottobre alle 15:30$/);
  assert.match(formatRome(new Date("2026-10-06T13:30:00Z"), "en"), /^Tuesday,? 6 October at 15:30$/);
});

test("numeri WhatsApp e codici", () => {
  assert.equal(waNumber("333 123 4567"), "393331234567");
  assert.equal(waNumber("+39 333-1234567"), "393331234567");
  assert.equal(waNumber("0044 7700 900123"), "447700900123");
  const id = newId();
  assert.ok(idValido(id));
  assert.ok(Math.abs(dataDaId(id) - Date.now()) < 5000);
  assert.ok(!idValido("../../etc"));
});

test("promemoria: 3 ore prima, mai di notte, mai se l'appuntamento è troppo vicino", () => {
  const adesso = new Date("2026-10-05T08:00:00Z"); // lunedì 10:00 in Italia
  // martedì 15:30 → martedì 12:30
  assert.equal(quandoPromemoria(romeToUtc("2026-10-06T15:30"), adesso).toISOString(), romeToUtc("2026-10-06T12:30").toISOString());
  // martedì 10:00 → martedì 8:00 (non alle 7)
  assert.equal(quandoPromemoria(romeToUtc("2026-10-06T10:00"), adesso).toISOString(), romeToUtc("2026-10-06T08:00").toISOString());
  // martedì 8:30 → lunedì sera alle 19
  assert.equal(quandoPromemoria(romeToUtc("2026-10-06T08:30"), adesso).toISOString(), romeToUtc("2026-10-05T19:00").toISOString());
  // tra 2 ore: nessun promemoria
  assert.equal(quandoPromemoria(new Date(adesso.getTime() + 2 * 3600e3), adesso), null);
});

test("recensione: il giorno dopo, tra le 10 e le 19", () => {
  // fatto lunedì alle 16 → martedì alle 12
  assert.equal(quandoRecensione(romeToUtc("2026-10-05T16:00")).toISOString(), romeToUtc("2026-10-06T12:00").toISOString());
  // fatto lunedì alle 9 → martedì alle 5 → martedì alle 10
  assert.equal(quandoRecensione(romeToUtc("2026-10-05T09:00")).toISOString(), romeToUtc("2026-10-06T10:00").toISOString());
  // fatto lunedì alle 11 → martedì alle 7 → martedì alle 10
  assert.equal(quandoRecensione(romeToUtc("2026-10-05T11:00")).toISOString(), romeToUtc("2026-10-06T10:00").toISOString());
});

test("richiesta dal modulo: solo i campi utili", () => {
  const r = daModulo({
    form_name: "prenotazione",
    data: {
      nome: "  Mario   Rossi ", telefono: "333 1234567", email: "Mario@Example.it", lingua: "en", aggiornamenti: "si",
      servizio: "Quick fix", giorno: "Tuesday 6 October", orario: "15:30", data: "2026-10-06", messaggio: "PC lento\r\n\r\n\r\nmolto",
      ip: "1.2.3.4", user_agent: "Mozilla", "bot-field": ""
    }
  });
  assert.equal(r.nome, "Mario Rossi");
  assert.equal(r.email, "mario@example.it");
  assert.equal(r.lingua, "en");
  assert.equal(r.consenso, true);
  assert.equal(r.richiesto, romeToUtc("2026-10-06T15:30").toISOString());
  assert.equal(r.messaggio, "PC lento\n\nmolto");
  assert.deepEqual(r.dettagli, { Servizio: "Quick fix", Giorno: "Tuesday 6 October", Orario: "15:30" });
  assert.ok(!JSON.stringify(r).includes("1.2.3.4"));
  assert.equal(daModulo({ form_name: "x", data: { lingua: "fr" } }).lingua, "it");
});

test("monitoraggio: soglie di Windows", () => {
  const report = pulisciReport({
    sistema: { nome: "Microsoft Windows 10 Pro", versione: "10.0.19045" },
    avvioGiorni: 41.2,
    dischi: [{ unita: "C:", totaleGB: 237.5, liberoGB: 4.2 }, { unita: "D:", totaleGB: 931, liberoGB: 60 }, { unita: "E:", totaleGB: 120, liberoGB: 9 }],
    saluteDischi: [{ nome: "SSD", stato: "Warning" }, { nome: "HDD", stato: "Healthy" }],
    antivirus: [{ nome: "Windows Defender", attivo: true, aggiornato: true }],
    defender: { attivo: true, tempoReale: false, firmeGiorni: 12 },
    firewall: { attivo: false },
    aggiornamenti: { ultimoGiorni: 60, riavvioInSospeso: true },
    backup: { tipo: "Cartella", percorso: "F:\\Backup", trovato: false, ultimoGiorni: 3 },
    extra: "<script>"
  });
  assert.equal(report.extra, undefined);
  const codici = Object.fromEntries(valuta(report).map((p) => [p.codice, p.livello]));
  assert.deepEqual(codici, {
    "disco:C:": "critico", "disco:E:": "attenzione", "salute:SSD": "critico", "defender:temporeale": "critico",
    "defender:firme": "attenzione", firewall: "attenzione", aggiornamenti: "attenzione", riavvio: "info", acceso: "info", windows10: "info"
  });
  // backup su disco scollegato ma recente: nessun avviso; vecchio: avviso
  assert.ok(!("backup:vecchio" in codici));
  const vecchio = valuta(pulisciReport({ backup: { tipo: "Cartella", percorso: "F:\\Backup", trovato: false, ultimoGiorni: 9 } }));
  assert.match(vecchio[0].testo, /9 giorni fa \(disco del backup non collegato\)/);
});

test("monitoraggio: antivirus spento, Mac e avvisi solo per i problemi nuovi", () => {
  const spento = valuta(pulisciReport({ antivirus: [{ nome: "Avast", attivo: false, aggiornato: true }] }));
  assert.equal(spento[0].codice, "antivirus:spento");
  const mac = valuta(pulisciReport({
    sistema: { nome: "macOS" }, firewall: { attivo: false }, mac: { filevault: false, gatekeeper: true, sip: false },
    backup: { tipo: "Time Machine", percorso: "", trovato: null, ultimoGiorni: null }
  }));
  assert.deepEqual(mac.map((p) => `${p.codice}:${p.livello}`), ["firewall:info", "mac:sip:attenzione", "mac:filevault:info"]);
  const prima = [{ codice: "disco:C:", livello: "attenzione" }];
  const adesso = [{ codice: "disco:C:", livello: "critico" }, { codice: "firewall", livello: "attenzione" }, { codice: "riavvio", livello: "info" }];
  assert.deepEqual(nuoviProblemi(prima, adesso).map((p) => p.codice), ["firewall"]);
});
