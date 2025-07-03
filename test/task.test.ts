import { describe, test, expect, beforeEach } from "vitest";
import {
  addTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTaskCount,
} from "../src/task";
import { getDbClient } from "../src/db-client";

describe("Task Management", () => {
  beforeEach(async () => {
    // Clean up tasks table before each test
    const dbClient = await getDbClient();
    await dbClient({
      type: "exec",
      args: {
        sql: "DELETE FROM tasks",
      },
    });
  });

  describe("addTask", () => {
    test("should add a task successfully", async () => {
      const task = await addTask({ name: "Test Task" });

      expect(task).toBeDefined();
      expect(task.name).toBe("Test Task");
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
      expect(task.created_at).toBeDefined();
    });

    test("should increment task count after adding", async () => {
      const initialCount = await getTaskCount();

      await addTask({ name: "Task 1" });
      await addTask({ name: "Task 2" });

      const finalCount = await getTaskCount();
      expect(finalCount).toBe(initialCount + 2);
    });
  });

  describe("getTasks", () => {
    test("should return empty array when no tasks exist", async () => {
      const tasks = await getTasks();
      expect(tasks).toEqual([]);
    });

    test("should return all tasks ordered by created_at DESC", async () => {
      await addTask({ name: "First Task" });
      await addTask({ name: "Second Task" });

      const tasks = await getTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks[0].name).toBe("Second Task"); // Most recent first
      expect(tasks[1].name).toBe("First Task");
    });
  });

  describe("getTask", () => {
    test("should return specific task by id", async () => {
      const createdTask = await addTask({ name: "Specific Task" });
      const retrievedTask = await getTask(createdTask.id);

      expect(retrievedTask).toBeDefined();
      expect(retrievedTask?.name).toBe("Specific Task");
      expect(retrievedTask?.id).toBe(createdTask.id);
    });

    test("should return null for non-existent task", async () => {
      const task = await getTask(999);
      expect(task).toBeNull();
    });
  });

  describe("updateTask", () => {
    test("should update task name", async () => {
      const task = await addTask({ name: "Original Name" });
      const updatedTask = await updateTask({
        id: task.id,
        name: "Updated Name",
      });

      expect(updatedTask?.name).toBe("Updated Name");
      expect(updatedTask?.id).toBe(task.id);
    });

    test("should update task completion status", async () => {
      const task = await addTask({ name: "Task to Complete" });
      const updatedTask = await updateTask({ id: task.id, completed: true });

      expect(updatedTask?.completed).toBe(true);
      expect(updatedTask?.id).toBe(task.id);
    });

    test("should return null for non-existent task", async () => {
      const updatedTask = await updateTask({ id: 999, name: "New Name" });
      expect(updatedTask).toBeNull();
    });
  });

  describe("deleteTask", () => {
    test("should delete existing task", async () => {
      const task = await addTask({ name: "Task to Delete" });
      const deleted = await deleteTask(task.id);

      expect(deleted).toBe(true);

      const retrievedTask = await getTask(task.id);
      expect(retrievedTask).toBeNull();
    });

    test("should return false for non-existent task", async () => {
      const deleted = await deleteTask(999);
      expect(deleted).toBe(false);
    });
  });

  describe("toggleTask", () => {
    test("should toggle task completion status", async () => {
      const task = await addTask({ name: "Task to Toggle" });
      expect(task.completed).toBe(false);

      const toggledTask = await toggleTask(task.id);
      expect(toggledTask?.completed).toBe(true);

      const toggledAgain = await toggleTask(task.id);
      expect(toggledAgain?.completed).toBe(false);
    });

    test("should return null for non-existent task", async () => {
      const result = await toggleTask(999);
      expect(result).toBeNull();
    });
  });

  describe("getTaskCount", () => {
    test("should return correct task count", async () => {
      expect(await getTaskCount()).toBe(0);

      await addTask({ name: "Task 1" });
      expect(await getTaskCount()).toBe(1);

      await addTask({ name: "Task 2" });
      expect(await getTaskCount()).toBe(2);

      const tasks = await getTasks();
      await deleteTask(tasks[0].id);
      expect(await getTaskCount()).toBe(1);
    });
  });
});
