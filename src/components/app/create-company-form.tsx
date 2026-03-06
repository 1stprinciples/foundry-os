"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CreateCompanyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to create the company.");
      }

      const data = (await response.json()) as {
        company?: { slug?: string };
        summary?: string;
      };

      setMessage(data.summary ?? "Company created.");

      if (data.company?.slug) {
        router.push(`/dashboard/${data.company.slug}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Company creation failed."
      );
    } finally {
      setLoading(false);
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
            required
            placeholder="Signal Harbor"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/40"
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Stage
          </span>
          <select
            name="stage"
            defaultValue="idea"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/40"
          >
            <option value="idea">Idea</option>
            <option value="build">Build</option>
            <option value="launch">Launch</option>
            <option value="scale">Scale</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          Thesis
        </span>
        <textarea
          name="thesis"
          required
          rows={4}
          placeholder="AI compliance copilot for fragmented local-service businesses."
          className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-black/40"
        />
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Offer
          </span>
          <input
            name="offer"
            placeholder="$79/mo + usage"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/40"
          />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Audience
          </span>
          <input
            name="audience"
            placeholder="Independent operators with 2-20 staff"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/40"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {loading ? "Creating..." : "Create company"}
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
