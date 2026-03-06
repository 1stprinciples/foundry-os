"use client";

import { AppShell } from "@/components/app/app-shell";
import { CompanyStrip } from "@/components/app/company-strip";
import { SessionGate, useWorkspaceBundle } from "@/components/app/workspace-client";

export function ConnectionsScreen({
  companySlug,
}: {
  companySlug?: string;
}) {
  const { loading, error, session, companies, company } =
    useWorkspaceBundle(companySlug);
  const connectors = company?.connectors ?? [];

  return (
    <AppShell
      activePath="/connections"
      companySlug={company?.slug ?? companySlug}
      kicker="Tools"
      header="Connections"
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
            path="/connections"
          />
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-black/55">Loading connection health...</p>
      ) : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {connectors.map((connector) => (
          <article
            key={connector.id}
            className="rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
              {connector.status}
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{connector.name}</h3>
            <p className="mt-3 text-sm leading-6 text-black/65">
              {connector.detail ?? "Connector metadata unavailable."}
            </p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
