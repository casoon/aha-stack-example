# AHA Stack Demo - Kanban Board

Eine Demo-Anwendung, die das Zusammenspiel von **Astro**, **HTMX** und **Alpine.js** (AHA Stack) zeigt.

**Live Demo:** https://aha-stack.casoon.dev

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
| **Astro** | Server-Side Rendering, API-Endpoints |
| **HTMX** | Server-Kommunikation ohne JavaScript |
| **Alpine.js** | Client-Side Interaktivität |

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
│   └── render.ts            # HTML-Render Funktionen
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

## Lizenz

MIT
