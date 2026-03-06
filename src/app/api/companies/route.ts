import { createCompanyRecord } from "@/lib/companies";
import { runOperatingCycle } from "@/lib/agents";
import { badRequest, notFound, ok, readJson } from "@/lib/http";
import { readState, updateState } from "@/lib/store";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CreateCompanyBody = {
  name?: string;
  thesis?: string;
  audience?: string;
  offer?: string;
  pricePoint?: string;
  market?: string;
  location?: string;
};

type PatchCompanyBody = {
  slug?: string;
  updates?: Partial<{
    name: string;
    tagline: string;
    thesis: string;
    audience: string;
    offer: string;
    pricePoint: string;
    market: string;
    location: string;
    mood: string;
    stage: "idea" | "building" | "launching" | "scaling";
    monthlyBudgetUsd: number;
    runCadence: string;
    status: "draft" | "running" | "paused";
    defaultCompany: boolean;
  }>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companySlug = searchParams.get("companySlug");
  const state = await readState();

  if (companySlug) {
    const company = state.companies.find((item) => item.slug === companySlug);

    if (!company) {
      return notFound("Company not found.");
    }

    return ok({
      ok: true,
      brand: "Foundry OS",
      company,
    });
  }

  return ok({
    ok: true,
    brand: "Foundry OS",
    companies: state.companies,
    defaultCompanySlug: state.user.defaultCompanySlug,
  });
}

export async function POST(request: Request) {
  const body = await readJson<CreateCompanyBody>(request);

  if (!body?.name || !body?.thesis || !body?.audience || !body?.offer) {
    return badRequest("name, thesis, audience, and offer are required.");
  }

  const company = await updateState((state) => {
    const draft = createCompanyRecord({
      name: body.name!,
      thesis: body.thesis!,
      audience: body.audience!,
      offer: body.offer!,
      pricePoint: body.pricePoint,
      market: body.market,
      location: body.location,
    });

    const existingSlugs = new Set(state.companies.map((item) => item.slug));
    let uniqueSlug = draft.slug;
    let suffix = 2;

    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slugify(body.name!)}-${suffix}`;
      suffix += 1;
    }

    draft.slug = uniqueSlug;
    draft.website = `https://${uniqueSlug}.foundry.local`;
    state.companies.unshift(draft);
    state.user.defaultCompanySlug = draft.slug;
    return draft;
  });

  const onboarding = await runOperatingCycle(company.slug, "onboarding");

  return ok({
    ok: true,
    brand: "Foundry OS",
    company: onboarding?.company ?? company,
    createdTasks: onboarding?.createdTasks ?? [],
    createdDocuments: onboarding?.createdDocuments ?? [],
  });
}

export async function PATCH(request: Request) {
  const body = await readJson<PatchCompanyBody>(request);

  if (!body?.slug || !body?.updates) {
    return badRequest("slug and updates are required.");
  }

  const updates = body.updates ?? {};

  const updated = await updateState((state) => {
    const company = state.companies.find((item) => item.slug === body.slug);

    if (!company) {
      return null;
    }

    if (updates.name) {
      company.name = updates.name;
      company.label = updates.name;
    }
    if (updates.tagline) company.tagline = updates.tagline;
    if (updates.thesis) company.thesis = updates.thesis;
    if (updates.audience) company.audience = updates.audience;
    if (updates.offer) company.offer = updates.offer;
    if (updates.pricePoint) company.pricePoint = updates.pricePoint;
    if (updates.market) company.market = updates.market;
    if (updates.location) company.location = updates.location;
    if (updates.mood) company.mood = updates.mood;
    if (updates.stage) company.stage = updates.stage;
    if (typeof updates.monthlyBudgetUsd === "number") {
      company.monthlyBudgetUsd = updates.monthlyBudgetUsd;
      company.dailyBudgetUsd = Number((updates.monthlyBudgetUsd / 30).toFixed(2));
    }
    if (updates.runCadence) company.runCadence = updates.runCadence;
    if (updates.status) company.status = updates.status;
    company.updatedAt = new Date().toISOString();

    if (updates.defaultCompany) {
      state.user.defaultCompanySlug = company.slug;
    }

    return company;
  });

  if (!updated) {
    return notFound("Company not found.");
  }

  return ok({
    ok: true,
    brand: "Foundry OS",
    company: updated,
  });
}
