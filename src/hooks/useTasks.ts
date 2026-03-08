import { useState, useEffect, useCallback } from "react";
import type { Task, TaskStatus } from "../types/task";

const STORAGE_KEY = "kanban-tasks";

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, description: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "todo",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, "title" | "description">>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  return { tasks, addTask, updateTask, deleteTask, moveTask };
}
