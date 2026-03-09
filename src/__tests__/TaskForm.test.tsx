import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskForm } from "../components/TaskForm";
import type { Task } from "../types/task";

describe("TaskForm", () => {
  it("renders all 8 color swatches", () => {
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByTestId("color-swatch-red")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-orange")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-yellow")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-green")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-blue")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-purple")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-pink")).toBeInTheDocument();
    expect(screen.getByTestId("color-swatch-gray")).toBeInTheDocument();
  });

  it("renders exactly 8 color swatches", () => {
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const swatches = screen.getAllByRole("button").filter((btn) =>
      btn.classList.contains("color-swatch")
    );
    expect(swatches).toHaveLength(8);
  });

  it("selects a color swatch and visually distinguishes it", async () => {
    const user = userEvent.setup();
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const redSwatch = screen.getByTestId("color-swatch-red");
    expect(redSwatch).not.toHaveClass("selected");

    await user.click(redSwatch);
    expect(redSwatch).toHaveClass("selected");
  });

  it("deselects a color swatch when clicked again (toggle off)", async () => {
    const user = userEvent.setup();
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const redSwatch = screen.getByTestId("color-swatch-red");
    await user.click(redSwatch);
    expect(redSwatch).toHaveClass("selected");

    await user.click(redSwatch);
    expect(redSwatch).not.toHaveClass("selected");
  });

  it("only selects one color at a time", async () => {
    const user = userEvent.setup();
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const redSwatch = screen.getByTestId("color-swatch-red");
    const blueSwatch = screen.getByTestId("color-swatch-blue");

    await user.click(redSwatch);
    expect(redSwatch).toHaveClass("selected");
    expect(blueSwatch).not.toHaveClass("selected");

    await user.click(blueSwatch);
    expect(redSwatch).not.toHaveClass("selected");
    expect(blueSwatch).toHaveClass("selected");
  });

  it("submits with selected color for new task", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskForm
        editingTask={null}
        onSubmit={onSubmit}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText("Task title"), "Test task");
    await user.click(screen.getByTestId("color-swatch-blue"));
    await user.click(screen.getByText("Add Task"));

    expect(onSubmit).toHaveBeenCalledWith("Test task", "", "#3B82F6");
  });

  it("submits with null color when no color is selected", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskForm
        editingTask={null}
        onSubmit={onSubmit}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText("Task title"), "No color task");
    await user.click(screen.getByText("Add Task"));

    expect(onSubmit).toHaveBeenCalledWith("No color task", "", null);
  });

  it("submits with null color after selecting and deselecting", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TaskForm
        editingTask={null}
        onSubmit={onSubmit}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText("Task title"), "Toggled task");
    await user.click(screen.getByTestId("color-swatch-red"));
    await user.click(screen.getByTestId("color-swatch-red")); // deselect
    await user.click(screen.getByText("Add Task"));

    expect(onSubmit).toHaveBeenCalledWith("Toggled task", "", null);
  });

  it("pre-selects color when editing a task with a color", () => {
    const editingTask: Task = {
      id: "edit-1",
      title: "Existing",
      description: "Desc",
      status: "todo",
      createdAt: "2025-01-01T00:00:00.000Z",
      color: "#E5484D",
    };

    render(
      <TaskForm
        editingTask={editingTask}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByTestId("color-swatch-red")).toHaveClass("selected");
    expect(screen.getByTestId("color-swatch-blue")).not.toHaveClass("selected");
  });

  it("has no pre-selected color when editing a task without a color", () => {
    const editingTask: Task = {
      id: "edit-1",
      title: "Existing",
      description: "Desc",
      status: "todo",
      createdAt: "2025-01-01T00:00:00.000Z",
    };

    render(
      <TaskForm
        editingTask={editingTask}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const swatches = screen.getAllByRole("button").filter((btn) =>
      btn.classList.contains("color-swatch")
    );
    swatches.forEach((swatch) => {
      expect(swatch).not.toHaveClass("selected");
    });
  });

  it("updates with color when editing an existing task", async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    const editingTask: Task = {
      id: "edit-1",
      title: "Existing",
      description: "Desc",
      status: "todo",
      createdAt: "2025-01-01T00:00:00.000Z",
    };

    render(
      <TaskForm
        editingTask={editingTask}
        onSubmit={vi.fn()}
        onUpdate={onUpdate}
        onCancel={vi.fn()}
      />
    );

    await user.click(screen.getByTestId("color-swatch-green"));
    await user.click(screen.getByText("Update"));

    expect(onUpdate).toHaveBeenCalledWith("edit-1", {
      title: "Existing",
      description: "Desc",
      color: "#30A46C",
    });
  });

  it("updates to remove color from existing task by deselecting", async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    const editingTask: Task = {
      id: "edit-1",
      title: "Existing",
      description: "Desc",
      status: "todo",
      createdAt: "2025-01-01T00:00:00.000Z",
      color: "#E5484D",
    };

    render(
      <TaskForm
        editingTask={editingTask}
        onSubmit={vi.fn()}
        onUpdate={onUpdate}
        onCancel={vi.fn()}
      />
    );

    // Deselect the red swatch by clicking it again
    await user.click(screen.getByTestId("color-swatch-red"));
    expect(screen.getByTestId("color-swatch-red")).not.toHaveClass("selected");

    await user.click(screen.getByText("Update"));

    expect(onUpdate).toHaveBeenCalledWith("edit-1", {
      title: "Existing",
      description: "Desc",
      color: null,
    });
  });

  it("each swatch has an accessible aria-label", () => {
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Red color")).toBeInTheDocument();
    expect(screen.getByLabelText("Orange color")).toBeInTheDocument();
    expect(screen.getByLabelText("Yellow color")).toBeInTheDocument();
    expect(screen.getByLabelText("Green color")).toBeInTheDocument();
    expect(screen.getByLabelText("Blue color")).toBeInTheDocument();
    expect(screen.getByLabelText("Purple color")).toBeInTheDocument();
    expect(screen.getByLabelText("Pink color")).toBeInTheDocument();
    expect(screen.getByLabelText("Gray color")).toBeInTheDocument();
  });

  it("renders color picker below the description field", () => {
    render(
      <TaskForm
        editingTask={null}
        onSubmit={vi.fn()}
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const colorPicker = screen.getByTestId("color-picker");
    expect(colorPicker).toBeInTheDocument();
    expect(screen.getByText("Color label (optional)")).toBeInTheDocument();
  });
});
