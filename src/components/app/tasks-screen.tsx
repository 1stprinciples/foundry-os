"use client";

import { AppShell } from "@/components/app/app-shell";
import { CompanyStrip } from "@/components/app/company-strip";
import { TaskBoard } from "@/components/app/task-board";
import { TaskStatusControl } from "@/components/app/task-status-control";
import { SessionGate, useWorkspaceBundle } from "@/components/app/workspace-client";

export function TasksScreen({
  companySlug,
}: {
  companySlug?: string;
}) {
  const { loading, error, refresh, session, companies, company, tasks } =
    useWorkspaceBundle(companySlug);

  return (
    <AppShell
      activePath="/tasks"
      companySlug={company?.slug ?? companySlug}
      kicker="Execution"
      header="Task ledger"
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
            path="/tasks"
          />
        </div>
      ) : null}

      {loading ? <p className="text-sm text-black/55">Loading tasks...</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <TaskBoard tasks={tasks} />

      <section className="mt-6 rounded-[1.75rem] border border-black/10 bg-white/80 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
          Status controls
        </p>
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#fffaf5] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="mt-1 text-sm text-black/60">{task.description}</p>
              </div>
              <TaskStatusControl
                companySlug={company?.slug ?? ""}
                taskId={task.id}
                currentStatus={task.status}
                onDone={refresh}
              />
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
