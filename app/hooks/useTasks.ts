import { useState, useEffect, useCallback } from "react";
import { Task } from "../../src/types";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
  getTaskCount,
} from "../../src/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [taskList, count] = await Promise.all([getTasks(), getTaskCount()]);
      setTasks(taskList);
      setTotalCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (name: string) => {
      try {
        setError(null);
        await addTask({ name });
        await loadTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create task");
      }
    },
    [loadTasks],
  );

  const updateTaskStatus = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await toggleTask(id);
        await loadTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    [loadTasks],
  );

  const removeTask = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await deleteTask(id);
        await loadTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete task");
      }
    },
    [loadTasks],
  );

  const editTask = useCallback(
    async (id: number, name: string) => {
      try {
        setError(null);
        await updateTask({ id, name });
        await loadTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    [loadTasks],
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = totalCount - completedCount;

  return {
    tasks,
    totalCount,
    completedCount,
    pendingCount,
    loading,
    error,
    createTask,
    updateTaskStatus,
    removeTask,
    editTask,
    refresh: loadTasks,
  };
}
