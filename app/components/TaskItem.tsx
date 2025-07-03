import React, { useState } from "react";
import { Task } from "../../src/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsUpdating(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const createdAt = new Date(task.created_at).toLocaleDateString();

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={handleToggle}
        disabled={isUpdating}
      />

      <div className="task-content">
        <div className={`task-name ${task.completed ? "completed" : ""}`}>
          {task.name}
        </div>
        <div className="task-meta">
          Created: {createdAt}
          {task.updated_at !== task.created_at && (
            <>
              {" "}
              • Updated: {new Date(task.updated_at).toLocaleDateString()}
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="btn btn-danger"
        disabled={isUpdating}
      >
        Delete
      </button>
    </div>
  );
}
