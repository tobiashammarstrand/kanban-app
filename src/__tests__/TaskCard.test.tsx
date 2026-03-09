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

  it("renders a color strip when task has a color", () => {
    const taskWithColor = { ...mockTask, color: "#E5484D" };
    render(
      <TaskCard task={taskWithColor} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    const strip = screen.getByTestId("color-strip");
    expect(strip).toBeInTheDocument();
    expect(strip).toHaveStyle({ backgroundColor: "#E5484D" });
  });

  it("does not render a color strip when task has no color field", () => {
    render(
      <TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.queryByTestId("color-strip")).not.toBeInTheDocument();
  });

  it("does not render a color strip when task color is null", () => {
    const taskNullColor = { ...mockTask, color: null };
    render(
      <TaskCard task={taskNullColor} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.queryByTestId("color-strip")).not.toBeInTheDocument();
  });

  it("does not render a color strip when task color is undefined", () => {
    const taskUndefinedColor = { ...mockTask, color: undefined };
    render(
      <TaskCard task={taskUndefinedColor} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.queryByTestId("color-strip")).not.toBeInTheDocument();
  });

  it("renders title, description, and actions correctly alongside a color strip", () => {
    const taskWithColor = { ...mockTask, color: "#3B82F6" };
    render(
      <TaskCard task={taskWithColor} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByTestId("color-strip")).toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("A test description")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit task")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete task")).toBeInTheDocument();
  });

  it("renders each of the 8 predefined colors correctly", () => {
    const colors = ["#E5484D", "#FB6846", "#F5B041", "#30A46C", "#3B82F6", "#8E4EC6", "#E13C72", "#94A3B8"];

    colors.forEach((hex) => {
      const taskWithColor = { ...mockTask, id: `test-${hex}`, color: hex };
      const { unmount } = render(
        <TaskCard task={taskWithColor} onEdit={vi.fn()} onDelete={vi.fn()} />
      );

      const strip = screen.getByTestId("color-strip");
      expect(strip).toHaveStyle({ backgroundColor: hex });
      unmount();
    });
  });
});
