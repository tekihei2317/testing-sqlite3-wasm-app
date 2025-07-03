import { SQLiteWorkerAPI } from "./types";
import { createMockSQLiteWorkerAPI } from "./db-client-mock";

let dbClient: SQLiteWorkerAPI | null = null;

export async function initializeDatabase(): Promise<SQLiteWorkerAPI> {
  if (dbClient) {
    return dbClient;
  }

  // Use mock implementation only for test environment
  if (process.env.NODE_ENV === "test") {
    dbClient = createMockSQLiteWorkerAPI();
  } else {
    // Initialize sqlite3Worker1Promiser for browser environment
    const { sqlite3Worker1Promiser } = await import("@sqlite.org/sqlite-wasm");

    // Create database client using wrapped worker pattern
    const promiser = await new Promise<SQLiteWorkerAPI>((resolve) => {
      const _promiser = sqlite3Worker1Promiser({
        onready: () => {
          console.log("SQLite database initialized successfully");
          resolve(_promiser);
        },
        onerror: (error: any) => {
          console.error("SQLite initialization error:", error);
        },
      });
    });

    dbClient = promiser;
  }

  // Open database
  await dbClient({
    type: "open",
    args: {
      filename: "test.db",
    },
  });

  // Create tasks table
  await dbClient({
    type: "exec",
    args: {
      sql: `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
    },
  });

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
    await dbClient({
      type: "close",
    });
    dbClient = null;
  }
}
