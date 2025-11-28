// API-Endpoint für Aufgaben
// POST: Neue Aufgabe erstellen

import type { APIRoute } from "astro";
import {
  addTask,
  validateTask,
  isValidPriority,
  type TaskPriority,
} from "../../lib/db";
import { renderKanbanBoard } from "../../lib/render";

// POST: Neue Aufgabe erstellen
export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  const priority = (formData.get("priority") as string) || "medium";

  const error = validateTask(text);
  if (error) {
    return new Response(`<div class="error-message">${error}</div>`, {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const validPriority: TaskPriority = isValidPriority(priority)
    ? priority
    : "medium";
  addTask(text, validPriority);

  return new Response(await renderKanbanBoard(request), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
};
