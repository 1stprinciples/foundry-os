"use client";

import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { CreateCompanyForm } from "@/components/app/create-company-form";
import { MetricCard } from "@/components/app/metric-card";
import { StatusPill } from "@/components/app/status-pill";
import {
  SessionGate,
  useWorkspaceBundle,
} from "@/components/app/workspace-client";

export function DashboardHomeScreen() {
  const { loading, error, session, companies } = useWorkspaceBundle();

  const totalArr = companies.reduce((sum, company) => {
    return sum + Number(company.metrics?.arr ?? company.metrics?.mrr ?? 0);
  }, 0);
  const totalCustomers = companies.reduce((sum, company) => {
    return sum + Number(company.metrics?.customers ?? 0);
  }, 0);

  return (
    <AppShell
      activePath="/dashboard"
      kicker="Workspace"
      header="Company command deck"
    >
      <SessionGate session={session} />

      {loading ? (
        <p className="text-sm text-black/55">Loading the company deck...</p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Companies"
              value={String(companies.length)}
              detail="Venture programs in motion"
            />
            <MetricCard
              label="ARR tracked"
              value={`$${Math.round(totalArr).toLocaleString()}`}
              detail="Across all operating companies"
            />
            <MetricCard
              label="Customers"
              value={String(totalCustomers)}
              detail="Known active buyers"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {companies.map((company) => (
              <article
                key={company.id}
                className="rounded-[1.75rem] border border-black/10 bg-white/80 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                      Day {company.day} · {company.stage}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">{company.name}</h3>
                  </div>
                  <StatusPill label={company.status ?? "active"} tone="success" />
                </div>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  {company.thesis ?? "No thesis saved yet."}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-black/60">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                      ARR
                    </p>
                    <p className="mt-1 font-medium text-black">
                      ${Number(company.metrics?.arr ?? company.metrics?.mrr ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                      Visitors
                    </p>
                    <p className="mt-1 font-medium text-black">
                      {Number(company.metrics?.visitors ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                      Signups
                    </p>
                    <p className="mt-1 font-medium text-black">
                      {Number(company.metrics?.signups ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href={`/dashboard/${company.slug}`}
                    className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                  >
                    Open company
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <CreateCompanyForm />
        </section>
      </div>
    </AppShell>
  );
}
