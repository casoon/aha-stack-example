// Gemeinsame Render-Funktionen für API-Endpoints

import { getTasksByStatus, getStats, getPriorityLabel, getPriorityColor, type Task } from './db';

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function renderTaskCard(task: Task): string {
  const priorityColor = getPriorityColor(task.priority);
  const priorityLabel = getPriorityLabel(task.priority);
  const hasDueDate = task.dueDate ? true : false;
  const hasDescription = task.description.length > 0;

  return `
    <div
      class="kanban-task"
      draggable="true"
      data-id="${task.id}"
      x-on:dragstart="handleDragStart($event, $el.dataset.id)"
      x-on:dragend="handleDragEnd()"
    >
      <div class="task-header">
        <span class="priority-badge" style="background: ${priorityColor}">${priorityLabel}</span>
        ${hasDueDate ? `<span class="due-date">📅 ${task.dueDate}</span>` : ''}
      </div>
      <span class="task-text">${escapeHtml(task.text)}</span>
      ${hasDescription ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
      <div class="task-actions">
        <button
          class="task-edit-btn"
          @click="openEditModal(${task.id}, '${escapeHtml(task.text).replace(/'/g, "\\'")}', '${escapeHtml(task.description).replace(/'/g, "\\'")}', '${task.priority}', '${task.dueDate || ''}')"
          title="Bearbeiten"
        >
          ✏️
        </button>
        <button
          class="task-delete-btn"
          @click="deleteId = ${task.id}; showDeleteModal = true"
          title="Löschen"
        >
          🗑️
        </button>
      </div>
    </div>
  `;
}

export function renderKanbanBoard(): string {
  const tasks = getTasksByStatus();
  const stats = getStats();

  const columns = [
    { id: 'open', title: 'Offen', icon: '📋', color: '#ed8936', tasks: tasks.open },
    { id: 'in_progress', title: 'In Bearbeitung', icon: '🔄', color: '#4299e1', tasks: tasks.in_progress },
    { id: 'done', title: 'Erledigt', icon: '✅', color: '#48bb78', tasks: tasks.done }
  ];

  const columnsHtml = columns.map(column => `
    <div
      class="kanban-column"
      data-status="${column.id}"
      x-on:dragover.prevent="dragOver = true"
      x-on:dragleave="dragOver = false"
      x-on:drop="handleDrop($event, $el.dataset.status)"
      :class="{ 'drag-over': dragOver && dragStatus !== $el.dataset.status }"
      x-data="{ dragOver: false }"
    >
      <div class="column-header" style="border-color: ${column.color}">
        <span class="column-icon">${column.icon}</span>
        <h3>${column.title}</h3>
        <span class="column-count" style="background: ${column.color}">
          ${column.tasks.length}
        </span>
      </div>

      <div class="column-tasks">
        ${column.tasks.length === 0
          ? '<div class="empty-column">Keine Aufgaben</div>'
          : column.tasks.map(task => renderTaskCard(task)).join('')
        }
      </div>
    </div>
  `).join('');

  return `
    <div
      id="kanban-board"
      class="kanban-board"
      data-total="${stats.total}"
      data-open="${stats.open}"
      data-in-progress="${stats.inProgress}"
      data-done="${stats.done}"
    >
      ${columnsHtml}
    </div>
  `;
}
