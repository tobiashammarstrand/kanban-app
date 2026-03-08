import { useState, useEffect } from "react";
import type { Task } from "../types/task";

interface TaskFormProps {
  editingTask: Task | null;
  onSubmit: (title: string, description: string) => void;
  onUpdate: (id: string, updates: { title?: string; description?: string }) => void;
  onCancel: () => void;
}

export function TaskForm({ editingTask, onSubmit, onUpdate, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdate(editingTask.id, { title: title.trim(), description: description.trim() });
    } else {
      onSubmit(title.trim(), description.trim());
    }
    setTitle("");
    setDescription("");
  }

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <form
        className="task-form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{editingTask ? "Edit Task" : "New Task"}</h2>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">
            {editingTask ? "Update" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
