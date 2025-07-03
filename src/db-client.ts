import { SQLiteWorkerAPI } from './types';

let dbClient: SQLiteWorkerAPI | null = null;

export async function initializeDatabase(): Promise<SQLiteWorkerAPI> {
  if (dbClient) {
    return dbClient;
  }

  // Initialize sqlite3Worker1Promiser
  const sqlite3 = await import('@sqlite.org/sqlite-wasm');
  
  // Create database client using wrapped worker pattern
  dbClient = await sqlite3.sqlite3Worker1Promiser({
    onready: () => {
      console.log('SQLite database initialized successfully');
    },
    onerror: (error) => {
      console.error('SQLite initialization error:', error);
    }
  });

  // Create tasks table
  await dbClient.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return dbClient;
}

export async function getDbClient(): Promise<SQLiteWorkerAPI> {
  if (!dbClient) {
    return await initializeDatabase();
  }
  return dbClient;
}

export async function closeDatabase(): Promise<void> {
  if (dbClient) {
    await dbClient.close();
    dbClient = null;
  }
}