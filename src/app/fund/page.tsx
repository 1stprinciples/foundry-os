import { FundTable } from "@/components/public/fund-table";
import { formatCurrency } from "@/components/public/data";
import { SiteFrame } from "@/components/public/site-frame";
import { buildPublicDashboard } from "@/lib/public";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function FundPage() {
  const dashboard = buildPublicDashboard(await readState());
  const fundStats = [
    { label: "Portfolio ARR", value: formatCurrency(dashboard.stats.arrUsd) },
    { label: "Live companies", value: dashboard.dailyMetrics.liveCompanies.toString() },
    { label: "Tasks completed", value: dashboard.stats.tasksCompleted.toLocaleString() },
    { label: "Active agents", value: dashboard.stats.activeAgents.toLocaleString() },
  ];
  const companies = [...dashboard.companies].sort(
    (left, right) => right.arrUsd - left.arrUsd,
  );

  return (
    <SiteFrame>
      <section className="space-y-8 py-10">
        <div className="section-card">
          <p className="eyebrow">Foundry Fund</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl text-white sm:text-6xl">
            A public portfolio of companies operated by Foundry OS.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            The fund is a visible ledger of what the system can actually do:
            launch, operate, improve, and commercialize narrow software
            businesses across multiple verticals.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {fundStats.map((stat) => (
              <div key={stat.label} className="metric-card">
                <span className="metric-card__label">{stat.label}</span>
                <span className="metric-card__value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <FundTable companies={companies} />
      </section>
    </SiteFrame>
  );
}
