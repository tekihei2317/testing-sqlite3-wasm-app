// TypeScript definitions for sqlite3Worker1Promiser
// Based on sqlite-wasm GitHub issue #53

export interface SQLiteWorkerAPI {
  (message: SQLiteWorkerMessage): Promise<any>;
  exec?: (sql: string, params?: any[]) => Promise<any>;
  export?: () => Promise<Uint8Array>;
  close?: () => Promise<void>;
}

export interface SQLiteWorkerMessage {
  type: string;
  messageId?: string;
  dbId?: string;
  args?: {
    filename?: string;
    sql?: string;
    bind?: any[];
    saveSql?: string[];
    returnValue?: any;
    result?: any;
    error?: any;
  };
}

export interface SQLiteWorkerConfig {
  onready?: () => void;
  onunhandled?: (message: SQLiteWorkerMessage) => void;
  onerror?: (error: Error) => void;
  debug?: boolean;
}

declare global {
  function sqlite3Worker1Promiser(
    config?: SQLiteWorkerConfig,
  ): Promise<SQLiteWorkerAPI>;
}

declare module "@sqlite.org/sqlite-wasm" {
  function sqlite3Worker1Promiser(
    config?: SQLiteWorkerConfig,
  ): Promise<SQLiteWorkerAPI>;
}

export interface Task {
  id: number;
  name: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  name: string;
}

export interface UpdateTaskInput {
  id: number;
  name?: string;
  completed?: boolean;
}
