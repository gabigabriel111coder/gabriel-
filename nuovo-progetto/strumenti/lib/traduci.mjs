/* ==========================================================================
   Traduzione delle pagine.
   Il sito italiano è la fonte: le altre lingue si ottengono traducendo testi e
   attributi con un dizionario (strumenti/traduzioni/<lingua>.mjs) e sistemando
   i collegamenti, così la struttura delle pagine resta una sola.
   ========================================================================== */

// Separa l'HTML in pezzi: commenti, script, stili e tag da una parte, testo dall'altra
const PEZZI = /(<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/gi;
const ATTRIBUTO = /(\s)([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*)"([^"]*)"/g;
const ATTRIBUTI_TESTO = new Set(["title", "alt", "aria-label", "placeholder", "data-wa", "data-wa-intro", "data-success", "data-success-link-text", "data-share", "data-label"]);
const ATTRIBUTI_URL = new Set(["href", "src"]);
const META_TESTO = /\b(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description)"/;
const JSONLD_TESTO = new Set(["description", "headline", "name", "serviceType", "alternateName"]);
const JSONLD_URL = new Set(["url", "@id", "mainEntityOfPage", "logo", "image"]);
// File comuni a tutte le lingue: restano nella radice del sito
const FILE_COMUNI = /^\/(?:assets\/|agent\/|tecnico\/|favicon\.ico|site\.webmanifest|sitemap\.xml|robots\.txt)/;
const CODICE = /^[A-Z0-9]{2,}(?:[-·][A-Z0-9]{2,})+$/;

const decodifica = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const codificaAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const normalizza = (s) => s.replace(/\s+/g, " ").trim();
const haTesto = (s) => /\p{L}/u.test(s.replace(/\{\{[^}]+\}\}/g, "")) && !CODICE.test(s);

/**
 * @param dizionario  { "testo italiano": "traduzione" }
 * @param lingua      codice della lingua di arrivo, per esempio "en"
 * @param sito        prefisso degli indirizzi assoluti del sito (qui il segnaposto {{sito}})
 * @param invariati   testi uguali in tutte le lingue (nomi di marchi e prodotti)
 */
export function creaTraduttore(dizionario, { lingua, sito = "{{sito}}", invariati = [] }) {
  const voci = new Map(Object.entries(dizionario).map(([it, tr]) => [normalizza(it), tr]));
  const uguali = new Set(invariati.map(normalizza));
  const mancanti = new Map(); // testo → prima pagina in cui compare
  const usate = new Set();

  function t(testo, pagina) {
    const chiave = normalizza(testo);
    if (!chiave || !haTesto(chiave) || uguali.has(chiave)) return testo;
    if (voci.has(chiave)) {
      usate.add(chiave);
      return voci.get(chiave);
    }
    if (!mancanti.has(chiave)) mancanti.set(chiave, pagina);
    return testo;
  }

  function traduciPagina(html, path, { assoluta = false } = {}) {
    const profondita = path.split("/").length - 1;
    const allaRadiceIt = "../".repeat(profondita + 1);

    // Collegamenti: le pagine puntano alla stessa pagina nella nuova lingua, i file comuni restano dove sono
    const url = (valore) => {
      if (!valore) return valore;
      if (valore.startsWith(`${sito}/`)) {
        const resto = valore.slice(sito.length);
        if (resto === "/assets/brand/og-image.png") return `${sito}/assets/brand/og-image-${lingua}.png`;
        return FILE_COMUNI.test(resto) ? valore : `${sito}/${lingua}${resto}`;
      }
      if (/^(?:#|[a-z][a-z0-9+.-]*:)/i.test(valore) || valore.startsWith("{{")) return valore;
      if (valore.startsWith("/")) return FILE_COMUNI.test(valore) ? valore : `/${lingua}${valore}`;
      const risolto = new URL(valore, `https://sito.local/${path}`).pathname;
      return FILE_COMUNI.test(risolto) ? `../${valore}` : valore;
    };

    const traduciTag = (tag) => {
      if (/^<html\b/i.test(tag)) return tag.replace(/\blang="[^"]*"/, `lang="${lingua}"`);
      if (/^<a\b[^>]*\bdata-lang-switch\b/i.test(tag)) {
        const verso = assoluta ? "/" : `${allaRadiceIt}${path}`;
        return tag.replace(/href="[^"]*"/, `href="${verso}"`).replace(/hreflang="[^"]*"/, 'hreflang="it"').replace(/\blang="[^"]*"/, 'lang="it"')
          .replace(/aria-label="[^"]*"/, 'aria-label="Versione italiana"');
      }
      const meta = /^<meta\b/i.test(tag);
      if (meta && /property="og:locale"/.test(tag)) return tag.replace(/content="[^"]*"/, `content="${lingua === "en" ? "en_GB" : lingua}"`);
      const metaTesto = meta && META_TESTO.test(tag);
      return tag.replace(ATTRIBUTO, (tutto, spazio, nome, uguale, valore) => {
        const n = nome.toLowerCase();
        if (ATTRIBUTI_TESTO.has(n) || (n === "content" && metaTesto)) {
          return `${spazio}${nome}${uguale}"${codificaAttr(t(decodifica(valore), path))}"`;
        }
        if (ATTRIBUTI_URL.has(n) || (n === "content" && meta && /^\{\{sito\}\}\//.test(valore))) {
          return `${spazio}${nome}${uguale}"${url(valore)}"`;
        }
        return tutto;
      });
    };

    const traduciJson = (valore, chiave) => {
      if (Array.isArray(valore)) return valore.map((v) => traduciJson(v, chiave));
      if (valore && typeof valore === "object") {
        return Object.fromEntries(Object.entries(valore).map(([k, v]) => [k, traduciJson(v, k)]));
      }
      if (typeof valore !== "string") return valore;
      if (chiave === "inLanguage") return lingua;
      if (JSONLD_URL.has(chiave) || valore.startsWith(`${sito}/`)) return url(valore);
      return JSONLD_TESTO.has(chiave) ? t(valore, path) : valore;
    };

    const traduciScript = (blocco) => {
      const [, apertura, contenuto, chiusura] = blocco.match(/^(<script\b[^>]*>)([\s\S]*?)(<\/script>)$/i);
      let corpo = contenuto;
      if (/type="application\/ld\+json"/.test(apertura)) {
        corpo = JSON.stringify(traduciJson(JSON.parse(contenuto)));
      } else if (/type="importmap"/.test(apertura)) {
        corpo = contenuto.replace(/"(\.{0,2}\/[^"]+)"(?=\s*})/g, (m, v) => `"${v.startsWith("./") ? `../${v.slice(2)}` : url(v)}"`);
      }
      return traduciTag(apertura) + corpo + chiusura;
    };

    return html.split(PEZZI).map((pezzo, i) => {
      if (i % 2 === 1) {
        if (pezzo.startsWith("<!--")) return pezzo;
        if (/^<script\b/i.test(pezzo)) return traduciScript(pezzo);
        if (/^<style\b/i.test(pezzo)) return pezzo;
        return traduciTag(pezzo);
      }
      if (!/\S/.test(pezzo)) return pezzo;
      const [, prima, testo, dopo] = pezzo.match(/^(\s*)([\s\S]*?)(\s*)$/);
      return prima + t(testo, path) + dopo;
    }).join("");
  }

  return {
    traduciPagina,
    mancanti,
    vociInutilizzate: () => [...voci.keys()].filter((k) => !usate.has(k))
  };
}
