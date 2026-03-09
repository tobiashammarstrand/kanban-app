import { useState, useEffect } from "react";
import type { Task } from "../types/task";

const COLOR_OPTIONS = [
  { name: "Red", hex: "#E5484D" },
  { name: "Orange", hex: "#FB6846" },
  { name: "Yellow", hex: "#F5B041" },
  { name: "Green", hex: "#30A46C" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Purple", hex: "#8E4EC6" },
  { name: "Pink", hex: "#E13C72" },
  { name: "Gray", hex: "#94A3B8" },
];

interface TaskFormProps {
  editingTask: Task | null;
  onSubmit: (title: string, description: string, color?: string | null) => void;
  onUpdate: (id: string, updates: { title?: string; description?: string; color?: string | null }) => void;
  onCancel: () => void;
}

export function TaskForm({ editingTask, onSubmit, onUpdate, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setColor(editingTask.color ?? null);
    } else {
      setTitle("");
      setDescription("");
      setColor(null);
    }
  }, [editingTask]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdate(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        color: color || null,
      });
    } else {
      onSubmit(title.trim(), description.trim(), color || null);
    }
    setTitle("");
    setDescription("");
    setColor(null);
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
        <div className="color-picker" data-testid="color-picker">
          <label className="color-picker-label">Color label (optional)</label>
          <div className="color-swatches">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.hex}
                type="button"
                className={`color-swatch${color === option.hex ? " selected" : ""}`}
                style={{ backgroundColor: option.hex }}
                onClick={() => setColor(color === option.hex ? null : option.hex)}
                aria-label={`${option.name} color`}
                title={option.name}
                data-testid={`color-swatch-${option.name.toLowerCase()}`}
              />
            ))}
          </div>
        </div>
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
