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
});
