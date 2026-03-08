import { useState } from "react";
import type { Task, TaskStatus } from "../types/task";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onMoveTask: (id: string, status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onMoveTask(taskId, id);
    }
  }

  return (
    <div
      className={`kanban-column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`column-${id}`}
    >
      <h2 className="column-title">
        {title} <span className="task-count">({tasks.length})</span>
      </h2>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}
