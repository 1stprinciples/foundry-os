"use client";

import { AgentRoster } from "@/components/app/agent-roster";
import { AppShell } from "@/components/app/app-shell";
import { CompanyStrip } from "@/components/app/company-strip";
import { RunCycleButton } from "@/components/app/run-cycle-button";
import { SessionGate, useWorkspaceBundle } from "@/components/app/workspace-client";

export function AgentsScreen({
  companySlug,
}: {
  companySlug?: string;
}) {
  const { loading, error, session, companies, company, agents } =
    useWorkspaceBundle(companySlug);

  return (
    <AppShell
      activePath="/agents"
      companySlug={company?.slug ?? companySlug}
      kicker="Capability map"
      header="Agent roster"
      actions={company ? <RunCycleButton companySlug={company.slug} /> : null}
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
            path="/agents"
          />
        </div>
      ) : null}

      {loading ? <p className="text-sm text-black/55">Loading agents...</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <AgentRoster agents={agents} />
    </AppShell>
  );
}
