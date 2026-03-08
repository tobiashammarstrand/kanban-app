import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskCard } from "../components/TaskCard";
import type { Task } from "../types/task";

const mockTask: Task = {
  id: "test-1",
  title: "Test Task",
  description: "A test description",
  status: "todo",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("TaskCard", () => {
  it("renders task title and description", () => {
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("does not render description when empty", () => {
    const taskNoDesc = { ...mockTask, description: "" };
    render(
      <TaskCard task={taskNoDesc} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.queryByText("A test description")).not.toBeInTheDocument();
  });

  it("calls onEdit when edit button clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskCard task={mockTask} onEdit={onEdit} onDelete={vi.fn()} />
    );

    await user.click(screen.getByLabelText("Edit task"));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it("calls onDelete when delete button clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByLabelText("Delete task"));
    expect(onDelete).toHaveBeenCalledWith("test-1");
  });

  it("is draggable", () => {
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    const card = screen.getByTestId("task-test-1");
    expect(card).toHaveAttribute("draggable", "true");
  });
});
