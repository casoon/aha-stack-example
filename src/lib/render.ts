// Render-Funktionen für API-Endpoints
// Nutzt Astro Container API (experimental) für echte Komponenten-Rendering

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getTasksByStatus, getStats } from "@lib/db";
import KanbanBoard from "@components/KanbanBoard.astro";

export async function renderKanbanBoard(request: Request): Promise<string> {
  try {
    const tasks = getTasksByStatus();
    const stats = getStats();

    const container = await AstroContainer.create({
      request,
    });
    const html = await container.renderToString(KanbanBoard, {
      props: { tasks, stats },
    });

    return html;
  } catch (error) {
    console.error("Container API Error:", error);
    throw error;
  }
}
