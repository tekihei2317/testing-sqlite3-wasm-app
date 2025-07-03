import { getDbClient } from "./db-client";
import { Task, CreateTaskInput } from "./types";

export async function addTask(input: CreateTaskInput): Promise<Task> {
  const dbClient = await getDbClient();

  const result = await dbClient({
    type: "exec",
    args: {
      sql: "INSERT INTO tasks (name) VALUES (?) RETURNING *",
      bind: [input.name],
      returnValue: "resultRows",
      rowMode: "object",
    },
  });

  return result.result.resultRows[0] as Task;
}

export async function getTasks(): Promise<Task[]> {
  const dbClient = await getDbClient();

  const result = await dbClient({
    type: "exec",
    args: {
      sql: "SELECT * FROM tasks ORDER BY id DESC",
      returnValue: "resultRows",
      rowMode: "object",
    },
  });

  return result.result.resultRows;
}

export async function deleteTask(id: number): Promise<boolean> {
  const dbClient = await getDbClient();

  const result = await dbClient({
    type: "exec",
    args: {
      sql: "DELETE FROM tasks WHERE id = ? RETURNING id",
      bind: [id],
      returnValue: "resultRows",
    },
  });

  return result.result.resultRows.length > 0;
}

export async function toggleTask(id: number): Promise<Task | null> {
  const dbClient = await getDbClient();

  const result = await dbClient({
    type: "exec",
    args: {
      sql: "UPDATE tasks SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *",
      bind: [id],
      returnValue: "resultRows",
      rowMode: "object",
    },
  });

  return (result.result.resultRows[0] as Task) || null;
}

export async function getTaskCount(): Promise<number> {
  const dbClient = await getDbClient();

  const result = await dbClient({
    type: "exec",
    args: {
      sql: "SELECT COUNT(*) as count FROM tasks",
      returnValue: "resultRows",
      rowMode: "object",
    },
  });

  return result.result.resultRows[0].count;
}
