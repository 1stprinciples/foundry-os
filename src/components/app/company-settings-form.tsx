"use client";

import { FormEvent, useState } from "react";

import { CompanyRecord } from "@/components/app/workspace-client";

export function CompanySettingsForm({
  company,
  onDone,
}: {
  company: CompanyRecord;
  onDone?: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/companies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: company.slug,
          updates: {
            name: String(payload.name ?? ""),
            stage: String(payload.stage ?? company.stage),
            thesis: String(payload.thesis ?? ""),
            audience: String(payload.audience ?? ""),
            offer: String(payload.offer ?? ""),
            monthlyBudgetUsd: Number(payload.monthlyBudget ?? company.monthlyBudget ?? 0),
            runCadence: String(payload.runCadence ?? company.runCadence ?? "Daily"),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update company settings.");
      }

      setMessage("Saved.");
      onDone?.();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Settings update failed."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Company name
          </span>
          <input
            name="name"
            defaultValue={company.name}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Stage
          </span>
          <select
            name="stage"
            defaultValue={company.stage}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="idea">Idea</option>
            <option value="building">Building</option>
            <option value="launching">Launching</option>
            <option value="scaling">Scaling</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          Thesis
        </span>
        <textarea
          name="thesis"
          defaultValue={company.thesis}
          rows={4}
          className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none"
        />
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Offer
          </span>
          <input
            name="offer"
            defaultValue={company.offer}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Audience
          </span>
          <input
            name="audience"
            defaultValue={company.audience}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Budget / month
          </span>
          <input
            name="monthlyBudget"
            type="number"
            defaultValue={company.monthlyBudget}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Run cadence
          </span>
          <input
            name="runCadence"
            defaultValue={company.runCadence}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
        {message ? (
          <p className="text-xs uppercase tracking-[0.18em] text-black/45">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
