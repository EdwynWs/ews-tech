import { build } from "esbuild";
import { fileURLToPath } from "node:url";

await build({
  entryPoints: [fileURLToPath(new URL("./scene.mjs", import.meta.url))],
  outfile: fileURLToPath(new URL("../scene.js", import.meta.url)),
  bundle: true,
  minify: true,
  format: "iife",
  legalComments: "eof",
  target: ["es2020"],
});
console.log("Escultura EWS atualizada em scene.js.");
