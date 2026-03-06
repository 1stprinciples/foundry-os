"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RunCycleButton({
  companySlug,
  label = "Run cycle now",
}: {
  companySlug: string;
  label?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleRunCycle() {
    setMessage(null);

    try {
      const response = await fetch("/api/run-cycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companySlug }),
      });

      if (!response.ok) {
        throw new Error("Unable to trigger a new operating cycle.");
      }

      const payload = (await response.json()) as { summary?: string };
      setMessage(payload.summary ?? "Cycle completed.");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Cycle request failed."
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleRunCycle}
        disabled={isPending}
        className="rounded-full bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e45f00] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Running..." : label}
      </button>
      {message ? (
        <p className="text-xs uppercase tracking-[0.18em] text-black/45">
          {message}
        </p>
      ) : null}
    </div>
  );
}
