import React, { useState } from "react";
import { Task } from "../../src/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, name: string) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
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

  const handleEdit = async () => {
    if (!editName.trim() || editName === task.name) {
      setIsEditing(false);
      setEditName(task.name);
      return;
    }

    setIsUpdating(true);
    try {
      await onEdit(task.id, editName.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit task:", error);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditName(task.name);
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
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyPress}
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <>
            <div
              className={`task-name ${task.completed ? "completed" : ""}`}
              onDoubleClick={() => !task.completed && setIsEditing(true)}
            >
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
          </>
        )}
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
