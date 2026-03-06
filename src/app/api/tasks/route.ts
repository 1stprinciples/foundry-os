import { badRequest, notFound, ok, readJson } from "@/lib/http";
import { findCompanyBySlug, updateState } from "@/lib/store";
import { createId } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PatchTaskBody = {
  companySlug?: string;
  id?: string;
  updates?: Partial<{
    title: string;
    description: string;
    status: "backlog" | "todo" | "in_progress" | "review" | "done";
    priority: "low" | "medium" | "high" | "critical";
    outcome: string;
  }>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get("companySlug");

  if (!companySlug) {
    return badRequest("companySlug is required.");
  }

  const company = await findCompanyBySlug(companySlug);

  if (!company) {
    return notFound("Company not found.");
  }

  return ok({
    ok: true,
    brand: "Foundry OS",
    company: {
      slug: company.slug,
      name: company.name,
    },
    tasks: company.tasks,
  });
}

export async function PATCH(request: Request) {
  const body = await readJson<PatchTaskBody>(request);

  if (!body?.companySlug || !body.id || !body.updates) {
    return badRequest("companySlug, id, and updates are required.");
  }

  const updates = body.updates ?? {};

  const task = await updateState((state) => {
    const company = state.companies.find((item) => item.slug === body.companySlug);
    const task = company?.tasks.find((item) => item.id === body.id);

    if (!company || !task) {
      return null;
    }

    if (updates.title) task.title = updates.title;
    if (updates.description) task.description = updates.description;
    if (updates.status) task.status = updates.status;
    if (updates.priority) task.priority = updates.priority;
    if (updates.outcome) task.outcome = updates.outcome;
    task.updatedAt = new Date().toISOString();
    company.updatedAt = task.updatedAt;

    company.logs.unshift({
      id: createId("log"),
      timestamp: task.updatedAt,
      level: "info",
      stage: "review",
      agentName: task.owner,
      companyId: company.id,
      companyLabel: company.name,
      message: `Task updated: ${task.title} → ${task.status}`,
    });
    company.logs = company.logs.slice(0, 60);

    return task;
  });

  if (!task) {
    return notFound("Task not found.");
  }

  return ok({
    ok: true,
    brand: "Foundry OS",
    task,
  });
}
