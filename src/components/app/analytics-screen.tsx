"use client";

import { CSSProperties } from "react";

import { AppShell } from "@/components/app/app-shell";
import { CompanyStrip } from "@/components/app/company-strip";
import { MetricCard } from "@/components/app/metric-card";
import {
  SessionGate,
  useCompanyMetrics,
  useWorkspaceBundle,
} from "@/components/app/workspace-client";

function metricValue(value: number | string | undefined) {
  return Number(value ?? 0);
}

export function AnalyticsScreen({
  companySlug,
}: {
  companySlug?: string;
}) {
  const { loading, error, session, companies, company, analytics } =
    useWorkspaceBundle(companySlug);
  const metrics = useCompanyMetrics(company);
  const peakArr = Math.max(...analytics.history.map((point) => point.arr ?? 0), 1);
  const latestTasksCompleted = analytics.history.at(-1)?.tasksCompleted ?? 0;

  return (
    <AppShell
      activePath="/analytics"
      companySlug={company?.slug ?? companySlug}
      kicker="Metrics"
      header="Growth telemetry"
    >
      <SessionGate session={session} />

      {companies.length ? (
        <div className="mb-6">
          <CompanyStrip
            companies={companies.map((item) => ({
              slug: item.slug,
              name: item.name,
              day: item.day,
              stage: item.stage,
            }))}
            activeSlug={company?.slug}
            path="/analytics"
          />
        </div>
      ) : null}

      {loading ? <p className="text-sm text-black/55">Loading analytics...</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="ARR"
          value={`$${metricValue(metrics.arr ?? metrics.mrr).toLocaleString()}`}
        />
        <MetricCard
          label="MRR"
          value={`$${metricValue(metrics.mrr).toLocaleString()}`}
        />
        <MetricCard
          label="Customers"
          value={metricValue(metrics.customers).toLocaleString()}
        />
        <MetricCard
          label="Tasks completed"
          value={metricValue(latestTasksCompleted).toLocaleString()}
        />
      </section>

      <section className="mt-6 rounded-[1.75rem] border border-black/10 bg-white/80 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          ARR curve
        </p>
        <div className="mt-5 grid grid-cols-12 items-end gap-3">
          {analytics.history.slice(-12).map((point) => (
            <div key={point.date} className="flex flex-col items-center gap-3">
              <div className="h-48 w-full rounded-full bg-black/5 p-1">
                <div
                  className="w-full rounded-full bg-[#ff6a00]"
                  style={
                    {
                      height: `${Math.max(
                        ((point.arr ?? 0) / peakArr) * 100,
                        8
                      )}%`,
                      marginTop: "auto",
                    } as CSSProperties
                  }
                />
              </div>
              <div className="text-center text-[10px] uppercase tracking-[0.22em] text-black/40">
                {point.date.slice(5, 10)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          Recent feed
        </p>
        <div className="mt-4 space-y-3">
          {analytics.feed.slice(0, 8).map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold">{item.agentName}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  {item.stage} · {item.timestamp}
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-black/65">{item.message}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
