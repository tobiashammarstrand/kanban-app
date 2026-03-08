import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      data-testid={`task-${task.id}`}
    >
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-actions">
        <button onClick={() => onEdit(task)} aria-label="Edit task">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)} aria-label="Delete task">
          Delete
        </button>
      </div>
    </div>
  );
}
