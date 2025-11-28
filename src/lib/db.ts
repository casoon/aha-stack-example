// Einfacher In-Memory Datenspeicher für Aufgaben mit Kanban-Status

export type TaskStatus = "open" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  text: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: Date;
}

// In-Memory Speicher (Array)
const tasks: Task[] = [];

// ID-Counter
let nextId = 1;

// Alle Aufgaben abrufen
export function getTasks(): Task[] {
  return [...tasks];
}

// Aufgaben nach Status gruppiert
export function getTasksByStatus(): Record<TaskStatus, Task[]> {
  return {
    open: tasks.filter((t) => t.status === "open"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

// Statistiken
export function getStats() {
  return {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "open").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
}

// Aufgabe nach ID finden
export function getTaskById(id: number): Task | undefined {
  return tasks.find((t) => t.id === id);
}

// Neue Aufgabe hinzufügen
export function addTask(text: string, priority: TaskPriority = "medium"): Task {
  const task: Task = {
    id: nextId++,
    text: text.trim(),
    description: "",
    priority,
    status: "open",
    dueDate: null,
    createdAt: new Date(),
  };
  tasks.push(task);
  return task;
}

// Aufgaben-Status ändern
export function updateTaskStatus(id: number, status: TaskStatus): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    return task;
  }
  return null;
}

// Aufgabe komplett aktualisieren
export function updateTask(
  id: number,
  updates: {
    text?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string | null;
  },
): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    if (updates.text !== undefined) task.text = updates.text.trim();
    if (updates.description !== undefined)
      task.description = updates.description.trim();
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
    return task;
  }
  return null;
}

// Aufgabe löschen
export function deleteTask(id: number): boolean {
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  }
  return false;
}

// Validierung
export function validateTask(text: string): string | null {
  if (!text || text.trim().length === 0) {
    return "Aufgabentext ist erforderlich";
  }
  if (text.trim().length < 2) {
    return "Aufgabe muss mindestens 2 Zeichen haben";
  }
  return null;
}

// Status validieren
export function isValidStatus(status: string): status is TaskStatus {
  return ["open", "in_progress", "done"].includes(status);
}

// Priorität validieren
export function isValidPriority(priority: string): priority is TaskPriority {
  return ["low", "medium", "high"].includes(priority);
}

// Priorität Label
export function getPriorityLabel(priority: TaskPriority): string {
  const labels: Record<TaskPriority, string> = {
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
  };
  return labels[priority];
}

// Priorität Farbe
export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    low: "#48bb78",
    medium: "#ed8936",
    high: "#e53e3e",
  };
  return colors[priority];
}
