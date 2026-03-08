export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];
