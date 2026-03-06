import { runOperatingCycle } from "@/lib/agents";
import { badRequest, notFound, ok, readJson } from "@/lib/http";

export const dynamic = "force-dynamic";

type RunCycleBody = {
  companySlug?: string;
  mode?: "cycle" | "onboarding";
};

export async function POST(request: Request) {
  const body = await readJson<RunCycleBody>(request);

  if (!body?.companySlug) {
    return badRequest("companySlug is required.");
  }

  const result = await runOperatingCycle(body.companySlug, body.mode ?? "cycle");

  if (!result) {
    return notFound("Company not found.");
  }

  return ok({
    ok: true,
    brand: "Foundry OS",
    company: result.company,
    createdTasks: result.createdTasks,
    createdDocuments: result.createdDocuments,
    logs: result.logs,
  });
}
