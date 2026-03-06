"use client";

import { AppShell } from "@/components/app/app-shell";
import { CompanyStrip } from "@/components/app/company-strip";
import { DocumentStack } from "@/components/app/document-stack";
import { SessionGate, useWorkspaceBundle } from "@/components/app/workspace-client";

export function DocumentsScreen({
  companySlug,
}: {
  companySlug?: string;
}) {
  const { loading, error, session, companies, company, documents, analytics } =
    useWorkspaceBundle(companySlug);

  return (
    <AppShell
      activePath="/documents"
      companySlug={company?.slug ?? companySlug}
      kicker="Library"
      header="Document vault"
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
            path="/documents"
          />
        </div>
      ) : null}

      {loading ? <p className="text-sm text-black/55">Loading documents...</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <DocumentStack documents={documents} />

      <section className="mt-6 rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          Active experiments
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {analytics.experiments.map((experiment) => (
            <article
              key={experiment.id}
              className="rounded-2xl border border-black/10 bg-white/80 p-4"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                {experiment.status}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{experiment.name}</h3>
              <p className="mt-2 text-sm leading-6 text-black/65">
                {experiment.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
