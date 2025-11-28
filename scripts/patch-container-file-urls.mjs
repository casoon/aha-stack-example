// scripts/patch-container-file-urls.mjs
// Patcht file://-URLs im Worker-Bundle für Cloudflare Workers Kompatibilität

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Alle relevanten Dateien im Worker-Bundle durchsuchen
const workerDir = path.join(rootDir, "dist", "_worker.js");
const filesToPatch = [];

function findFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".mjs")) {
      filesToPatch.push(fullPath);
    }
  }
}

findFiles(workerDir);

if (filesToPatch.length === 0) {
  console.error("[patch-container] Keine Worker-Dateien gefunden in:", workerDir);
  process.exit(1);
}

let totalPatches = 0;

for (const filePath of filesToPatch) {
  let code = fs.readFileSync(filePath, "utf8");
  let patches = 0;

  // 1) hrefRoot im Manifest patchen: "file:///..." -> "https://aha-stack.casoon.dev/"
  const hrefRootRegex = /"hrefRoot":"file:\/\/\/[^"]*"/g;
  if (hrefRootRegex.test(code)) {
    code = code.replace(hrefRootRegex, '"hrefRoot":"https://aha-stack.casoon.dev/"');
    patches++;
  }

  // 2) Andere file:// URLs in Verzeichnis-Pfaden
  const dirPathRegex = /"(cacheDir|outDir|srcDir|publicDir|buildClientDir|buildServerDir)":"file:\/\/\/[^"]*"/g;
  if (dirPathRegex.test(code)) {
    code = code.replace(dirPathRegex, (match, key) => {
      return `"${key}":"/"`;
    });
    patches++;
  }

  // 3) new URL("file:///...") Aufrufe
  const newUrlRegex = /new URL\("file:\/\/\/[^"]*"\)/g;
  if (newUrlRegex.test(code)) {
    code = code.replace(newUrlRegex, 'new URL("https://aha-stack.casoon.dev/")');
    patches++;
  }

  if (patches > 0) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[patch-container] ${path.relative(rootDir, filePath)} - ${patches} Stelle(n) gepatcht`);
    totalPatches += patches;
  }
}

if (totalPatches === 0) {
  console.log("[patch-container] Keine file://-URLs gefunden. Nichts zu tun.");
} else {
  console.log(`[patch-container] Insgesamt ${totalPatches} Stelle(n) in ${filesToPatch.length} Datei(en) gepatcht.`);
}
