import React, { useState } from "react";

interface TaskFormProps {
  onSubmit: (name: string) => Promise<void>;
  loading?: boolean;
}

export function TaskForm({ onSubmit, loading }: TaskFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onSubmit(name.trim());
      setName("");
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a new task..."
          disabled={loading || submitting}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!name.trim() || loading || submitting}
        >
          {submitting ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}
