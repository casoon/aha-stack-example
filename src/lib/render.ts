// Render-Funktionen für API-Endpoints
// Nutzt Astro Container API (experimental) für echte Komponenten-Rendering

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getTasksByStatus, getStats } from "./db";
import KanbanBoard from "../components/KanbanBoard.astro";

let container: AstroContainer | null = null;

async function getContainer(): Promise<AstroContainer> {
  if (!container) {
    container = await AstroContainer.create();
  }
  return container;
}

export async function renderKanbanBoard(): Promise<string> {
  const tasks = getTasksByStatus();
  const stats = getStats();

  const astro = await getContainer();
  return await astro.renderToString(KanbanBoard, {
    props: { tasks, stats },
  });
}
