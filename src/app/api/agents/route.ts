import { notFound, ok } from "@/lib/http";
import { findCompanyBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get("companySlug");

  if (!companySlug) {
    return notFound("companySlug is required.");
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
      stage: company.stage,
      mood: company.mood,
    },
    agents: company.agents,
    spendTodayUsd: company.agents.reduce((total, agent) => total + agent.spendTodayUsd, 0),
  });
}
