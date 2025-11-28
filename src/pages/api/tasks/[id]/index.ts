// API-Endpoint: Aufgabe bearbeiten oder löschen
// PUT /api/tasks/:id - Aufgabe aktualisieren
// DELETE /api/tasks/:id - Aufgabe löschen

import type { APIRoute } from "astro";
import {
  updateTask,
  deleteTask,
  validateTask,
  isValidPriority,
  type TaskPriority,
} from "../../../../lib/db";
import { renderKanbanBoard } from "../../../../lib/render";

// PUT: Aufgabe aktualisieren
export const PUT: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id || "0");
  const formData = await request.formData();

  const text = formData.get("text") as string;
  const description = (formData.get("description") as string) || "";
  const priority = (formData.get("priority") as string) || "medium";
  const dueDate = (formData.get("dueDate") as string) || null;

  const error = validateTask(text);
  if (error) {
    return new Response(error, { status: 400 });
  }

  const validPriority: TaskPriority = isValidPriority(priority)
    ? priority
    : "medium";

  const task = updateTask(id, {
    text,
    description,
    priority: validPriority,
    dueDate: dueDate || null,
  });

  if (!task) {
    return new Response("Aufgabe nicht gefunden", { status: 404 });
  }

  return new Response(renderKanbanBoard(), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
};

// DELETE: Aufgabe löschen
export const DELETE: APIRoute = async ({ params }) => {
  const id = parseInt(params.id || "0");
  const success = deleteTask(id);

  if (!success) {
    return new Response("Aufgabe nicht gefunden", { status: 404 });
  }

  return new Response(renderKanbanBoard(), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
};
