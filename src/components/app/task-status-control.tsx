"use client";

import { useState } from "react";

export function TaskStatusControl({
  companySlug,
  taskId,
  currentStatus,
  onDone,
}: {
  companySlug: string;
  taskId: string;
  currentStatus: string;
  onDone?: () => void;
}) {
  const [value, setValue] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(nextStatus: string) {
    setValue(nextStatus);
    setLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companySlug,
          id: taskId,
          updates: {
            status: nextStatus,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update task status.");
      }

      onDone?.();
    } catch {
      setValue(currentStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-black/45">
      <span>Status</span>
      <select
        value={value}
        onChange={(event) => void updateStatus(event.target.value)}
        disabled={loading}
        className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-black/70 outline-none"
      >
        <option value="backlog">Backlog</option>
        <option value="todo">Queued</option>
        <option value="in_progress">In flight</option>
        <option value="review">Review</option>
        <option value="done">Completed</option>
      </select>
    </label>
  );
}
