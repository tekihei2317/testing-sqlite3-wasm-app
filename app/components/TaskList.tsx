import React from "react";
import { Task } from "../../src/types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  totalCount: number;
  completedCount: number;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  totalCount,
  completedCount,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="task-list-header">
          <h2>Tasks</h2>
          <span>{totalCount} total</span>
        </div>
        <div className="empty-state">
          <h3>No tasks yet</h3>
          <p>Add your first task above to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <span>
          {completedCount} of {totalCount} completed
        </span>
      </div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
