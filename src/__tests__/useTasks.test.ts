import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useTasks } from "../hooks/useTasks";

beforeEach(() => {
  localStorage.clear();
});

describe("useTasks", () => {
  it("starts with empty tasks", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  it("adds a task with todo status", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Test task", "A description");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Test task");
    expect(result.current.tasks[0].description).toBe("A description");
    expect(result.current.tasks[0].status).toBe("todo");
    expect(result.current.tasks[0].id).toBeDefined();
    expect(result.current.tasks[0].createdAt).toBeDefined();
  });

  it("updates a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Original", "Desc");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { title: "Updated" });
    });

    expect(result.current.tasks[0].title).toBe("Updated");
    expect(result.current.tasks[0].description).toBe("Desc");
  });

  it("deletes a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("To delete", "");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("moves a task to a different status", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Move me", "");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.moveTask(taskId, "in-progress");
    });

    expect(result.current.tasks[0].status).toBe("in-progress");

    act(() => {
      result.current.moveTask(taskId, "done");
    });

    expect(result.current.tasks[0].status).toBe("done");
  });

  it("persists tasks to localStorage", () => {
    const { result, unmount } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Persisted", "data");
    });

    unmount();

    const { result: result2 } = renderHook(() => useTasks());
    expect(result2.current.tasks).toHaveLength(1);
    expect(result2.current.tasks[0].title).toBe("Persisted");
  });

  it("handles multiple tasks", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Task 1", "");
      result.current.addTask("Task 2", "");
      result.current.addTask("Task 3", "");
    });

    expect(result.current.tasks).toHaveLength(3);
  });

  it("adds a task with a color", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Colored task", "Desc", "#E5484D");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Colored task");
    expect(result.current.tasks[0].color).toBe("#E5484D");
  });

  it("adds a task without a color", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("No color task", "Desc");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].color).toBeUndefined();
  });

  it("adds a task with null color and omits the color field", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Null color task", "Desc", null);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].color).toBeUndefined();
  });

  it("updates a task to add a color", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Task", "Desc");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { color: "#3B82F6" });
    });

    expect(result.current.tasks[0].color).toBe("#3B82F6");
    expect(result.current.tasks[0].title).toBe("Task");
  });

  it("updates a task to remove a color", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Task", "Desc", "#E5484D");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { color: null });
    });

    expect(result.current.tasks[0].color).toBeNull();
  });

  it("preserves color when moving a task between columns", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Colored move", "Desc", "#30A46C");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.moveTask(taskId, "in-progress");
    });

    expect(result.current.tasks[0].status).toBe("in-progress");
    expect(result.current.tasks[0].color).toBe("#30A46C");

    act(() => {
      result.current.moveTask(taskId, "done");
    });

    expect(result.current.tasks[0].status).toBe("done");
    expect(result.current.tasks[0].color).toBe("#30A46C");
  });

  it("persists color to localStorage across reloads", () => {
    const { result, unmount } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Colored persist", "data", "#8E4EC6");
    });

    unmount();

    const { result: result2 } = renderHook(() => useTasks());
    expect(result2.current.tasks).toHaveLength(1);
    expect(result2.current.tasks[0].title).toBe("Colored persist");
    expect(result2.current.tasks[0].color).toBe("#8E4EC6");
  });

  it("handles pre-existing tasks in localStorage without a color field", () => {
    const oldTasks = [
      {
        id: "old-1",
        title: "Old task",
        description: "No color field",
        status: "todo",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ];
    localStorage.setItem("kanban-tasks", JSON.stringify(oldTasks));

    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Old task");
    expect(result.current.tasks[0].color).toBeUndefined();
  });

  it("updates title and color simultaneously", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Task", "Desc");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { title: "Updated", color: "#FB6846" });
    });

    expect(result.current.tasks[0].title).toBe("Updated");
    expect(result.current.tasks[0].color).toBe("#FB6846");
    expect(result.current.tasks[0].description).toBe("Desc");
  });
});
