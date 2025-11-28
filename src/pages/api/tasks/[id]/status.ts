// API-Endpoint: Aufgaben-Status ändern (für Drag & Drop)
// PATCH /api/tasks/:id/status

import type { APIRoute } from "astro";
import { updateTaskStatus, isValidStatus } from "@lib/db";
import { renderKanbanBoard } from "@lib/render";

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id || "0");
  const formData = await request.formData();
  const status = formData.get("status") as string;

  if (!isValidStatus(status)) {
    return new Response("Ungültiger Status", { status: 400 });
  }

  const task = updateTaskStatus(id, status);
  if (!task) {
    return new Response("Aufgabe nicht gefunden", { status: 404 });
  }

  return new Response(await renderKanbanBoard(request), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
};
