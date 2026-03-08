import { useState } from "react";
import type { Task } from "../types/task";
import { COLUMNS } from "../types/task";
import { useTasks } from "../hooks/useTasks";
import { KanbanColumn } from "./KanbanColumn";
import { TaskForm } from "./TaskForm";

export function KanbanBoard() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function handleAddClick() {
    setEditingTask(null);
    setShowForm(true);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleFormSubmit(title: string, description: string) {
    addTask(title, description);
    setShowForm(false);
  }

  function handleFormUpdate(id: string, updates: { title?: string; description?: string }) {
    updateTask(id, updates);
    setShowForm(false);
    setEditingTask(null);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingTask(null);
  }

  return (
    <div className="kanban-board">
      <div className="board-header">
        <h1>Kanban Board</h1>
        <button className="add-task-btn" onClick={handleAddClick}>
          + New Task
        </button>
      </div>
      <div className="columns">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onMoveTask={moveTask}
            onEditTask={handleEdit}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
      {showForm && (
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleFormSubmit}
          onUpdate={handleFormUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
