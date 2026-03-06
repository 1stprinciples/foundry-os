import { LiveFeed } from "@/components/public/live-feed";
import { formatCurrency } from "@/components/public/data";
import { SiteFrame } from "@/components/public/site-frame";
import { buildPublicDashboard } from "@/lib/public";
import { readState } from "@/lib/store";
import type { ActivityLog } from "@/lib/types";

export const dynamic = "force-dynamic";

function eventTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function toLiveEvent(log: ActivityLog) {
  return {
    id: log.id,
    timestamp: eventTimestamp(log.timestamp),
    company: log.companyLabel,
    agent: log.agentName,
    stage: log.stage,
    headline: log.message,
    detail: `${log.companyLabel} logged a ${log.stage.replaceAll(
      "_",
      " ",
    )} update from ${log.agentName}. The next cycle will use this signal to re-score work and publish the next artifact set.`,
  };
}

export default async function LivePage() {
  const dashboard = buildPublicDashboard(await readState());
  const liveStats = [
    { label: "Tasks completed", value: dashboard.stats.tasksCompleted.toLocaleString() },
    { label: "Docs published", value: dashboard.stats.docsCreated24h.toLocaleString() },
    { label: "Live companies", value: dashboard.dailyMetrics.liveCompanies.toString() },
    { label: "Portfolio ARR", value: formatCurrency(dashboard.stats.arrUsd) },
  ];
  const initialEvents = dashboard.logs.slice(0, 12).map(toLiveEvent);

  return (
    <SiteFrame>
      <section className="space-y-8 py-10">
        <div className="section-card">
          <p className="eyebrow">Public Activity Feed</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl text-white sm:text-6xl">
            Foundry OS leaves the engine room lights on.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            What you see here is the public edge of the operating system: work
            being queued, executed, and re-scored across a live portfolio of
            businesses.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {liveStats.map((stat) => (
              <div key={stat.label} className="metric-card">
                <span className="metric-card__label">{stat.label}</span>
                <span className="metric-card__value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <LiveFeed initialEvents={initialEvents} />
      </section>
    </SiteFrame>
  );
}
