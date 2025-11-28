# AHA Stack Demo - Kanban Board

Eine Demo-Anwendung, die das Zusammenspiel von **Astro**, **HTMX** und **Alpine.js** (AHA Stack) zeigt.

**Live Demo:** https://aha-stack.casoon.dev

Basierend auf dem AHA Stack Konzept: https://ahastack.dev

## Features

- **Kanban Board** mit drei Spalten (Offen, In Bearbeitung, Erledigt)
- **Drag & Drop** zum Verschieben von Aufgaben zwischen Spalten
- **CRUD-Operationen** für Aufgaben (Erstellen, Bearbeiten, Löschen)
- **Prioritäten** (Hoch, Mittel, Niedrig) mit farbigen Badges
- **Fälligkeitsdatum** optional pro Aufgabe
- **Dark Mode** mit LocalStorage-Persistenz
- **Loading States** während Server-Requests
- **Responsive Design**

## Technologien

| Technologie | Verwendung |
|-------------|------------|
| **Astro 5** | Server-Side Rendering, API-Endpoints, Container API |
| **HTMX** | Server-Kommunikation ohne JavaScript |
| **Alpine.js** | Client-Side Interaktivität |
| **Cloudflare Workers** | Serverless Deployment |

## HTMX-Patterns

```html
<!-- Formular Submit -->
<form hx-post="/api/tasks" hx-target="#kanban-board" hx-swap="outerHTML">

<!-- Drag & Drop Status Update -->
htmx.ajax('PATCH', '/api/tasks/1/status', { values: { status: 'done' } })

<!-- Delete mit Bestätigung -->
<button hx-delete="/api/tasks/1" hx-target="#kanban-board">
```

## Alpine.js-Patterns

```html
<!-- State Management -->
<div x-data="{ darkMode: false, editingId: null }">

<!-- Conditional Rendering -->
<div x-show="showModal" x-transition>

<!-- Two-Way Binding -->
<input x-model="editText">

<!-- Event Handling -->
<button @click="toggleDarkMode()">
```

## Installation

```bash
pnpm install
```

## Entwicklung

```bash
pnpm run dev
```

Öffne http://localhost:4321

## Build

```bash
pnpm run build
pnpm run preview
```

## Projektstruktur

```
src/
├── components/
│   └── KanbanBoard.astro    # Kanban-Board Komponente
├── layouts/
│   └── Base.astro           # Layout mit Styles
├── lib/
│   ├── db.ts                # In-Memory Datenspeicher
│   └── render.ts            # Astro Container API Rendering
└── pages/
    ├── api/
    │   └── tasks/           # REST API Endpoints
    └── index.astro          # Hauptseite
```

## API Endpoints

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| POST | `/api/tasks` | Neue Aufgabe erstellen |
| PUT | `/api/tasks/:id` | Aufgabe aktualisieren |
| PATCH | `/api/tasks/:id/status` | Status ändern (Drag & Drop) |
| DELETE | `/api/tasks/:id` | Aufgabe löschen |

## Astro Container API

Die API-Endpoints nutzen die experimentelle [Astro Container API](https://docs.astro.build/en/reference/container-reference/), um Astro-Komponenten serverseitig zu rendern. Dies ermöglicht es, `.astro`-Komponenten in API-Endpoints zu verwenden, anstatt HTML-Strings manuell zu erstellen.

### Warum Container API?

| Ansatz | Nachteil |
|--------|----------|
| Template-Strings | Kein Syntax-Highlighting, fehleranfällig, kein Komponenten-Reuse |
| Partial Pages | Erfordert separate `.astro`-Dateien pro Fragment |
| **Container API** | Volle Astro-Komponenten in API-Endpoints |

### Verwendung

```typescript
// src/lib/render.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import KanbanBoard from "../components/KanbanBoard.astro";

export async function renderKanbanBoard(request: Request): Promise<string> {
  const container = await AstroContainer.create({ request });
  return await container.renderToString(KanbanBoard, {
    props: { tasks, stats }
  });
}
```

```typescript
// src/pages/api/tasks.ts
import { renderKanbanBoard } from "../../lib/render";

export const POST: APIRoute = async ({ request }) => {
  // ... Task erstellen
  return new Response(await renderKanbanBoard(request), {
    headers: { "Content-Type": "text/html" }
  });
};
```

### Container API auf Cloudflare Workers

Die Container API verwendet intern `import.meta.url` für Pfadauflösungen, was auf Cloudflare Workers nicht funktioniert. Dieses Projekt enthält einen **Post-Build Patch** in `astro.config.mjs`, der automatisch:

1. `hrefRoot: import.meta.url` durch die Site-URL ersetzt
2. Alle `file:///`-Pfade durch die Site-URL ersetzt

Zusätzlich ist in `wrangler.toml` das `nodejs_compat` Flag aktiviert, das mit Compatibility Date `2025-09-01+` automatisch `node:fs` und andere Node.js-Module unterstützt.

```toml
# wrangler.toml
compatibility_date = "2025-11-28"
compatibility_flags = ["nodejs_compat"]
```

Weitere Infos: [Cloudflare Node.js Compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)

## Deployment

Das Projekt wird auf Cloudflare Workers deployed:

```bash
pnpm run build
pnpm exec wrangler deploy
```

## Lizenz

MIT
