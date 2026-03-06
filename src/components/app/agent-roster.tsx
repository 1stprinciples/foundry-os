import { StatusPill } from "@/components/app/status-pill";

type Agent = {
  id: string;
  name: string;
  role: string;
  mission: string;
  mood: string;
  status: string;
  lastRunAt?: string;
  spendToday?: number;
  tasksCompleted?: number;
};

function statusTone(status: string) {
  switch (status) {
    case "executing":
    case "active":
      return "success" as const;
    case "thinking":
      return "info" as const;
    case "blocked":
      return "danger" as const;
    default:
      return "default" as const;
  }
}

export function AgentRoster({ agents }: { agents: Agent[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <article
          key={agent.id}
          className="rounded-[1.75rem] border border-black/10 bg-[#fffaf5] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                {agent.role}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{agent.name}</h3>
            </div>
            <StatusPill label={agent.status} tone={statusTone(agent.status)} />
          </div>

          <p className="mt-4 text-sm leading-6 text-black/65">{agent.mission}</p>

          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm text-black/60">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                Mood
              </dt>
              <dd className="mt-1 font-medium text-black/80">{agent.mood}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                Tasks closed
              </dt>
              <dd className="mt-1 font-medium text-black/80">
                {agent.tasksCompleted ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                Spend today
              </dt>
              <dd className="mt-1 font-medium text-black/80">
                ${(agent.spendToday ?? 0).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                Last run
              </dt>
              <dd className="mt-1 font-medium text-black/80">
                {agent.lastRunAt ?? "Pending"}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
