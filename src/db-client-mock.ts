import { SQLiteWorkerAPI, SQLiteWorkerMessage } from "./types";

// Mock implementation for testing
export class MockSQLiteWorkerAPI {
  private tables: Map<string, any[]> = new Map();
  private nextId = 1;

  async exec(message: SQLiteWorkerMessage): Promise<any> {
    const { type, args } = message;

    switch (type) {
      case "open":
        // Initialize tables
        if (!this.tables.has("tasks")) {
          this.tables.set("tasks", []);
        }
        return { type: "open" };

      case "exec":
        return this.handleExec(args?.sql || "", args?.bind || []);

      case "close":
        this.tables.clear();
        return { type: "close" };

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  private handleExec(sql: string, bind: any[] = []): any {
    const trimmedSql = sql.trim().toLowerCase();

    // CREATE TABLE
    if (trimmedSql.includes("create table")) {
      return { resultRows: [] };
    }

    // INSERT
    if (trimmedSql.includes("insert into tasks")) {
      const tasks = this.tables.get("tasks") || [];
      const newTask = {
        id: this.nextId++,
        name: bind[0],
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      tasks.push(newTask);
      this.tables.set("tasks", tasks);
      return { resultRows: [newTask] };
    }

    // SELECT ALL
    if (
      trimmedSql.includes("select * from tasks") &&
      !trimmedSql.includes("where")
    ) {
      const tasks = this.tables.get("tasks") || [];
      return { resultRows: tasks.slice().reverse() }; // DESC order
    }

    // SELECT BY ID
    if (trimmedSql.includes("select * from tasks where id")) {
      const tasks = this.tables.get("tasks") || [];
      const task = tasks.find((t) => t.id === bind[0]);
      return { resultRows: task ? [task] : [] };
    }

    // COUNT
    if (trimmedSql.includes("select count(*) as count from tasks")) {
      const tasks = this.tables.get("tasks") || [];
      return { resultRows: [{ count: tasks.length }] };
    }

    // UPDATE
    if (trimmedSql.includes("update tasks")) {
      const tasks = this.tables.get("tasks") || [];
      const taskId = bind[bind.length - 1]; // ID is last parameter
      const taskIndex = tasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) {
        return { resultRows: [] };
      }

      const task = { ...tasks[taskIndex] };

      // Parse SET clause
      if (trimmedSql.includes("name = ?")) {
        task.name = bind[0];
      }
      if (trimmedSql.includes("completed = ?")) {
        const completedIndex = bind.length === 2 ? 0 : 1;
        task.completed = bind[completedIndex];
      }

      task.updated_at = new Date().toISOString();
      tasks[taskIndex] = task;
      this.tables.set("tasks", tasks);

      return { resultRows: [task] };
    }

    // DELETE
    if (trimmedSql.includes("delete from tasks")) {
      const tasks = this.tables.get("tasks") || [];
      const taskId = bind[0];
      const initialLength = tasks.length;
      const filteredTasks = tasks.filter((t) => t.id !== taskId);
      this.tables.set("tasks", filteredTasks);

      return { changes: initialLength - filteredTasks.length };
    }

    // CLEAR TABLE (for testing)
    if (trimmedSql.includes("delete from tasks") && bind.length === 0) {
      this.tables.set("tasks", []);
      return { changes: 0 };
    }

    return { resultRows: [] };
  }
}

// Mock function for testing
export function createMockSQLiteWorkerAPI(): SQLiteWorkerAPI {
  const mock = new MockSQLiteWorkerAPI();
  return mock.exec.bind(mock);
}
