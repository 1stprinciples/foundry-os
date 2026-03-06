import Link from "next/link";

import {
  agentRoster,
  formatCurrency,
  formatNumber,
  operatingSteps,
} from "@/components/public/data";
import { SiteFrame } from "@/components/public/site-frame";
import { buildPublicDashboard } from "@/lib/public";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboard = buildPublicDashboard(await readState());
  const topCompanies = [...dashboard.companies]
    .sort((left, right) => right.arrUsd - left.arrUsd)
    .slice(0, 4);
  const heroStats = [
    { label: "Live companies", value: dashboard.dailyMetrics.liveCompanies.toString() },
    { label: "Portfolio ARR", value: formatCurrency(dashboard.stats.arrUsd) },
    { label: "Tasks completed", value: dashboard.stats.tasksCompleted.toLocaleString() },
    { label: "Active agents", value: dashboard.stats.activeAgents.toLocaleString() },
  ];

  return (
    <SiteFrame>
      <div className="space-y-8 py-6 md:py-10">
        <Link className="signal-banner" href="/live">
          <span className="pulse-dot" />
          <span>Watch Foundry OS operating companies in real time</span>
          <span className="text-neutral-500">/ public execution feed</span>
        </Link>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="section-card relative overflow-hidden">
            <div className="scan-sheen" />
            <p className="eyebrow">Foundry OS / Venture Terminal</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-none text-white sm:text-6xl lg:text-[5.75rem]">
              Businesses that keep shipping after the founder goes offline.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300 sm:text-xl">
              Foundry turns a market thesis into an operating company: research,
              offer design, product shipping, outbound, support, and daily
              prioritization handled by a coordinated stack of autonomous agents.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="cta-primary px-6 py-3" href="/new">
                Start a company
              </Link>
              <Link className="cta-secondary px-6 py-3" href="/fund">
                Explore the portfolio
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((item) => (
                <div key={item.label} className="metric-card">
                  <span className="metric-card__label">{item.label}</span>
                  <span className="metric-card__value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="section-card flex flex-col justify-between">
            <div>
              <p className="eyebrow">Operating Thesis</p>
              <h2 className="mt-3 font-display text-3xl text-white">
                A venture studio with no dead air.
              </h2>
            </div>
            <div className="space-y-4">
              <div className="notched-panel">
                <p className="notched-panel__label">See</p>
                <p className="notched-panel__copy">
                  Agents scan markets, customer language, competitor surfaces,
                  and product telemetry every cycle.
                </p>
              </div>
              <div className="notched-panel">
                <p className="notched-panel__label">Decide</p>
                <p className="notched-panel__copy">
                  The CEO agent re-scores the backlog against traction, margin,
                  and time-to-proof before work is allocated.
                </p>
              </div>
              <div className="notched-panel">
                <p className="notched-panel__label">Ship</p>
                <p className="notched-panel__copy">
                  Engineering, growth, and ops close loops in public so every
                  run leaves behind evidence, documents, and momentum.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-card">
            <p className="eyebrow">How the system moves</p>
            <h2 className="mt-3 font-display text-4xl text-white">
              The Foundry loop is strategic, not scripted.
            </h2>
            <div className="mt-8 space-y-5">
              {operatingSteps.map((step) => (
                <div key={step.label} className="border-l border-white/15 pl-5">
                  <p className="font-mono text-xs tracking-[0.28em] text-[#ff7a1a]">
                    {step.label}
                  </p>
                  <h3 className="mt-2 text-xl font-medium text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-300">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Agent Roster</p>
                <h2 className="mt-3 font-display text-4xl text-white">
                  Foundry operators
                </h2>
              </div>
              <Link className="text-sm text-neutral-300 underline-offset-4 hover:underline" href="/how-it-works">
                View operating model
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {agentRoster.map((agent) => (
                <article key={agent.name} className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                    {agent.name}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-neutral-200">
                    {agent.brief}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Portfolio Snapshot</p>
              <h2 className="mt-3 font-display text-4xl text-white">
                Built in public. Operated in motion.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-neutral-300">
              Foundry companies are narrow, high-clarity businesses. The system
              prefers operational wedges, cashflow visibility, and simple
              products that can improve every day.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {topCompanies.map((company) => (
              <article
                key={company.slug}
                className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-2xl text-white">
                    {company.name}
                  </p>
                  <span className="metric-chip">Day {company.day}</span>
                </div>
                <p className="mt-2 text-sm capitalize text-neutral-500">{company.stage}</p>
                <p className="mt-4 text-sm leading-7 text-neutral-300">
                  {company.tagline}
                </p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-neutral-500">
                      ARR
                    </p>
                    <p className="mt-2 text-2xl text-white">{formatCurrency(company.arrUsd)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-neutral-500">
                      Visitors
                    </p>
                    <p className="mt-2 text-lg text-lime-300">{formatNumber(company.visitors)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
