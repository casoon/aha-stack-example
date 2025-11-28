import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  output: "server",
  site: "https://aha-stack.casoon.dev",
  adapter: cloudflare({
    sessions: false,
  }),
  integrations: [
    {
      name: "patch-container-file-urls",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          const workerDir = path.join(dir.pathname, "_worker.js");

          if (!fs.existsSync(workerDir)) {
            console.log("[patch-container] Worker-Verzeichnis nicht gefunden");
            return;
          }

          // Alle .js und .mjs Dateien im Worker-Verzeichnis durchsuchen
          const patchFiles = (directory) => {
            const entries = fs.readdirSync(directory, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = path.join(directory, entry.name);
              if (entry.isDirectory()) {
                patchFiles(fullPath);
              } else if (
                entry.name.endsWith(".js") ||
                entry.name.endsWith(".mjs")
              ) {
                let code = fs.readFileSync(fullPath, "utf8");
                if (!code.includes("file:///")) continue;

                // 1) new URL("file:///...") -> new URL("https://aha-stack.casoon.dev/")
                code = code.replace(
                  /new URL\("file:[^"]*"\)/g,
                  'new URL("https://aha-stack.casoon.dev/")',
                );

                // 2) hrefRoot: "file:///..." -> vollständige URL
                code = code.replace(
                  /"hrefRoot":\s*"file:\/\/\/[^"]*"/g,
                  '"hrefRoot":"https://aha-stack.casoon.dev/"',
                );

                // 3) Andere dir-Pfade mit file:/// -> site URL
                code = code.replace(
                  /"(cacheDir|outDir|srcDir|publicDir|buildClientDir|buildServerDir)":\s*"file:\/\/\/[^"]*"/g,
                  (_, key) => `"${key}":"https://aha-stack.casoon.dev/"`,
                );

                // 4) Fallback: nackte "file:///..."-Strings durch site URL ersetzen
                code = code.replace(
                  /"file:\/\/\/[^"]*"/g,
                  '"https://aha-stack.casoon.dev/"',
                );

                fs.writeFileSync(fullPath, code, "utf8");
                console.log(
                  "[patch-container] Gepatcht:",
                  path.relative(dir.pathname, fullPath),
                );
              }
            }
          };

          patchFiles(workerDir);
        },
      },
    },
  ],
});
