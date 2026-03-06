"use client";

import { AppShell } from "@/components/app/app-shell";
import { CompanySettingsForm } from "@/components/app/company-settings-form";
import { CompanyStrip } from "@/components/app/company-strip";
import { SessionGate, useWorkspaceBundle } from "@/components/app/workspace-client";

export function SettingsScreen({
  companySlug,
}: {
  companySlug?: string;
}) {
  const { loading, error, refresh, session, companies, company } =
    useWorkspaceBundle(companySlug);

  return (
    <AppShell
      activePath="/company-settings"
      companySlug={company?.slug ?? companySlug}
      kicker="Configuration"
      header="Company settings"
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
            path="/company-settings"
          />
        </div>
      ) : null}

      {loading ? <p className="text-sm text-black/55">Loading settings...</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      {company ? (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <CompanySettingsForm company={company} onDone={refresh} />

          <section className="rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
              Operating defaults
            </p>
            <dl className="mt-4 space-y-4 text-sm text-black/65">
              <div>
                <dt className="font-semibold text-black">Monthly budget</dt>
                <dd className="mt-1">${company.monthlyBudget ?? 0}</dd>
              </div>
              <div>
                <dt className="font-semibold text-black">Cadence</dt>
                <dd className="mt-1">{company.runCadence ?? "Daily"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-black">Website</dt>
                <dd className="mt-1">{company.links?.website ?? "Not connected"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-black">Repository</dt>
                <dd className="mt-1">{company.links?.repo ?? "Not connected"}</dd>
              </div>
            </dl>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
