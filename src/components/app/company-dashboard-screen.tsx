"use client";

import { AgentRoster } from "@/components/app/agent-roster";
import { AppShell } from "@/components/app/app-shell";
import { CompanyStrip } from "@/components/app/company-strip";
import { DocumentStack } from "@/components/app/document-stack";
import { MetricCard } from "@/components/app/metric-card";
import { RunCycleButton } from "@/components/app/run-cycle-button";
import { StatusPill } from "@/components/app/status-pill";
import { TaskBoard } from "@/components/app/task-board";
import {
  SessionGate,
  useCompanyMetrics,
  useWorkspaceBundle,
} from "@/components/app/workspace-client";

export function CompanyDashboardScreen({
  companySlug,
}: {
  companySlug: string;
}) {
  const { loading, error, session, companies, company, agents, tasks, documents } =
    useWorkspaceBundle(companySlug);
  const metrics = useCompanyMetrics(company);

  return (
    <AppShell
      activePath="/dashboard"
      companySlug={company?.slug ?? companySlug}
      kicker="Operating company"
      header={company?.name ?? "Company"}
      actions={
        company ? (
          <>
            <StatusPill label={company.status ?? "active"} tone="success" />
            <RunCycleButton companySlug={company.slug} />
          </>
        ) : null
      }
    >
      <SessionGate session={session} />

      {loading ? <p className="text-sm text-black/55">Loading dashboard...</p> : null}
      {error ? (
        <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

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
            path="/dashboard"
          />
        </div>
      ) : null}

      {company ? (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Thesis
              </p>
              <h3 className="mt-4 font-serif text-4xl leading-tight">
                {company.thesis ?? "This company has no strategy saved yet."}
              </h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                    Offer
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/65">
                    {company.offer ?? "Offer still being refined by the CEO agent."}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                    Audience
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/65">
                    {company.audience ?? "Target segment still being mapped."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <MetricCard
                label="ARR"
                value={`$${Number(metrics.arr ?? metrics.mrr ?? 0).toLocaleString()}`}
                detail="Annualized from current revenue"
              />
              <MetricCard
                label="Visitors"
                value={Number(metrics.visitors ?? 0).toLocaleString()}
                detail="Tracked in the latest cycle"
              />
              <MetricCard
                label="AI spend"
                value={`$${Number(metrics.aiSpend ?? 0).toLocaleString()}`}
                detail="Spend budgeted this month"
              />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                  Agents
                </p>
                <h3 className="mt-2 text-3xl font-semibold">Operating bench</h3>
              </div>
            </div>
            <AgentRoster agents={agents} />
          </section>

          <section className="mt-6">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Execution
              </p>
              <h3 className="mt-2 text-3xl font-semibold">Task board</h3>
            </div>
            <TaskBoard tasks={tasks} />
          </section>

          <section className="mt-6">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                Artifacts
              </p>
              <h3 className="mt-2 text-3xl font-semibold">Fresh documents</h3>
            </div>
            <DocumentStack documents={documents.slice(0, 4)} />
          </section>
        </>
      ) : null}
    </AppShell>
  );
}
