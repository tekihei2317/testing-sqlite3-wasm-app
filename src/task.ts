import { getDbClient } from './db-client';
import { Task, CreateTaskInput, UpdateTaskInput } from './types';

export async function addTask(input: CreateTaskInput): Promise<Task> {
  const dbClient = await getDbClient();
  
  const result = await dbClient({
    type: 'exec',
    args: {
      sql: 'INSERT INTO tasks (name) VALUES (?) RETURNING *',
      bind: [input.name]
    }
  });
  
  return result.resultRows[0] as Task;
}

export async function getTasks(): Promise<Task[]> {
  const dbClient = await getDbClient();
  
  const result = await dbClient({
    type: 'exec',
    args: {
      sql: 'SELECT * FROM tasks ORDER BY created_at DESC'
    }
  });
  
  return result.resultRows as Task[];
}

export async function getTask(id: number): Promise<Task | null> {
  const dbClient = await getDbClient();
  
  const result = await dbClient({
    type: 'exec',
    args: {
      sql: 'SELECT * FROM tasks WHERE id = ?',
      bind: [id]
    }
  });
  
  return result.resultRows[0] as Task || null;
}

export async function updateTask(input: UpdateTaskInput): Promise<Task | null> {
  const dbClient = await getDbClient();
  
  const updates: string[] = [];
  const params: any[] = [];
  
  if (input.name !== undefined) {
    updates.push('name = ?');
    params.push(input.name);
  }
  
  if (input.completed !== undefined) {
    updates.push('completed = ?');
    params.push(input.completed);
  }
  
  if (updates.length === 0) {
    return await getTask(input.id);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(input.id);
  
  const result = await dbClient({
    type: 'exec',
    args: {
      sql: `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? RETURNING *`,
      bind: params
    }
  });
  
  return result.resultRows[0] as Task || null;
}

export async function deleteTask(id: number): Promise<boolean> {
  const dbClient = await getDbClient();
  
  const result = await dbClient({
    type: 'exec',
    args: {
      sql: 'DELETE FROM tasks WHERE id = ?',
      bind: [id]
    }
  });
  
  return result.changes > 0;
}

export async function toggleTask(id: number): Promise<Task | null> {
  const task = await getTask(id);
  if (!task) {
    return null;
  }
  
  return await updateTask({
    id,
    completed: !task.completed
  });
}

export async function getTaskCount(): Promise<number> {
  const dbClient = await getDbClient();
  
  const result = await dbClient({
    type: 'exec',
    args: {
      sql: 'SELECT COUNT(*) as count FROM tasks'
    }
  });
  
  return result.resultRows[0].count;
}