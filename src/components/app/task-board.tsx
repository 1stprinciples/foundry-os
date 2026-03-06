import { StatusPill } from "@/components/app/status-pill";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tag: string;
  owner: string;
  createdAt?: string;
};

const columns = [
  { key: "backlog", title: "Backlog" },
  { key: "todo", title: "Queued" },
  { key: "in_progress", title: "In flight" },
  { key: "review", title: "Review" },
  { key: "done", title: "Completed" },
];

function priorityTone(priority: string) {
  switch (priority) {
    case "critical":
      return "danger" as const;
    case "high":
      return "warning" as const;
    case "medium":
      return "info" as const;
    default:
      return "default" as const;
  }
}

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map((column) => {
        const items = tasks.filter((task) => task.status === column.key);

        return (
          <section
            key={column.key}
            className="rounded-[1.75rem] border border-black/10 bg-white/75 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{column.title}</h3>
              <span className="text-xs uppercase tracking-[0.24em] text-black/45">
                {items.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-black/45">
                  No tasks in this column yet.
                </div>
              ) : null}

              {items.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      label={task.priority}
                      tone={priorityTone(task.priority)}
                    />
                    <span className="text-[11px] uppercase tracking-[0.24em] text-black/40">
                      {task.tag}
                    </span>
                  </div>
                  <h4 className="mt-3 text-base font-semibold">{task.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-black/65">
                    {task.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-black/40">
                    <span>{task.owner}</span>
                    <span>{task.createdAt ?? "Fresh"}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
