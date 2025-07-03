import React from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";

function App() {
  const {
    tasks,
    totalCount,
    completedCount,
    pendingCount,
    loading,
    error,
    createTask,
    updateTaskStatus,
    removeTask,
    refresh,
  } = useTasks();

  return (
    <div className="container">
      <header className="header">
        <h1>SQLite WASM Task Manager</h1>
        <p>
          A demo application using sqlite-wasm with the wrapped worker pattern
        </p>
      </header>

      {error && (
        <div className="error">
          Error: {error}
          <button onClick={refresh} style={{ marginLeft: "1rem" }}>
            Try Again
          </button>
        </div>
      )}

      <TaskForm onSubmit={createTask} loading={loading} />

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <>
          <TaskStats
            totalCount={totalCount}
            completedCount={completedCount}
            pendingCount={pendingCount}
          />

          <TaskList
            tasks={tasks}
            onToggle={updateTaskStatus}
            onDelete={removeTask}
            totalCount={totalCount}
            completedCount={completedCount}
          />
        </>
      )}
    </div>
  );
}

export default App;
