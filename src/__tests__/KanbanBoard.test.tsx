import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { KanbanBoard } from "../components/KanbanBoard";

beforeEach(() => {
  localStorage.clear();
});

describe("KanbanBoard", () => {
  it("renders all three columns", () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-in-progress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();
  });

  it("renders column titles", () => {
    render(<KanbanBoard />);

    expect(screen.getByText(/Todo/)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/)).toBeInTheDocument();
    expect(screen.getByText(/Done/)).toBeInTheDocument();
  });

  it("opens task form when clicking New Task", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await user.click(screen.getByText("+ New Task"));
    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();
  });

  it("adds a task to the todo column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await user.click(screen.getByText("+ New Task"));
    await user.type(screen.getByPlaceholderText("Task title"), "My new task");
    await user.type(
      screen.getByPlaceholderText("Description (optional)"),
      "Task details"
    );
    await user.click(screen.getByText("Add Task"));

    expect(screen.getByText("My new task")).toBeInTheDocument();
    expect(screen.getByText("Task details")).toBeInTheDocument();
  });

  it("closes form on cancel", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await user.click(screen.getByText("+ New Task"));
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();

    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByPlaceholderText("Task title")).not.toBeInTheDocument();
  });

  it("shows correct task count per column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    // Initially all counts are 0
    expect(screen.getAllByText("(0)")).toHaveLength(3);

    // Add a task
    await user.click(screen.getByText("+ New Task"));
    await user.type(screen.getByPlaceholderText("Task title"), "Count test");
    await user.click(screen.getByText("Add Task"));

    // Todo column should show (1)
    const todoColumn = screen.getByTestId("column-todo");
    expect(todoColumn).toHaveTextContent("(1)");
  });
});
