/* Legge le impostazioni del sito (sito/assets/config.js) anche da Node, per il generatore. */
import { readFileSync } from "node:fs";
import vm from "node:vm";

export function caricaConfig(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(readFileSync(file, "utf8"), sandbox, { filename: file });
  if (!sandbox.window.CONFIG) throw new Error(`${file} non definisce window.CONFIG`);
  return sandbox.window.CONFIG;
}
