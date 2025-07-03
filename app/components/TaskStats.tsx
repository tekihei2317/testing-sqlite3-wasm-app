import React from "react";

interface TaskStatsProps {
  totalCount: number;
  completedCount: number;
  pendingCount: number;
}

export function TaskStats({
  totalCount,
  completedCount,
  pendingCount,
}: TaskStatsProps) {
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="stats">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>
    </div>
  );
}
