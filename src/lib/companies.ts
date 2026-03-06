import type { CompanyRecord } from "@/lib/types";
import { createId, seededNumber, slugify, stageFromDay } from "@/lib/utils";

function buildConnections(now: string) {
  return [
    {
      id: createId("conn"),
      name: "GitHub",
      category: "code" as const,
      status: "available" as const,
      description: "Repository sync, deploy hooks, and QA loops",
    },
    {
      id: createId("conn"),
      name: "Postmark",
      category: "distribution" as const,
      status: "available" as const,
      description: "Lifecycle, outbound, and transactional email",
    },
    {
      id: createId("conn"),
      name: "Stripe",
      category: "payments" as const,
      status: "available" as const,
      description: "Checkout, subscriptions, and pricing experiments",
    },
    {
      id: createId("conn"),
      name: "Plausible",
      category: "analytics" as const,
      status: "available" as const,
      description: "Traffic and funnel analytics",
      connectedAt: now,
    },
  ];
}

function buildAgents() {
  const now = new Date().toISOString();

  return [
    {
      id: createId("agent"),
      name: "Nova",
      role: "CEO" as const,
      mission: "Choose the next best move and keep the company coherent.",
      status: "planning" as const,
      mood: "Translating ambiguity into momentum",
      spendTodayUsd: 6,
      tasksCompleted: 0,
      tools: ["Strategy", "Task routing", "Decision memos"],
      lastRunAt: now,
      latestUpdate: "Turning the brief into a launchable operating agenda.",
    },
    {
      id: createId("agent"),
      name: "Trace",
      role: "Research" as const,
      mission: "Map markets, demand, competitors, and customer language.",
      status: "planning" as const,
      mood: "Collecting patterns",
      spendTodayUsd: 4,
      tasksCompleted: 0,
      tools: ["Research", "Synthesis", "Signal tracking"],
      lastRunAt: now,
      latestUpdate: "Building the first market brief.",
    },
    {
      id: createId("agent"),
      name: "Quill",
      role: "Product" as const,
      mission: "Collapse the product into the fastest path to a first user win.",
      status: "planning" as const,
      mood: "Scoping the wedge",
      spendTodayUsd: 5,
      tasksCompleted: 0,
      tools: ["Journey maps", "Specs", "Feedback loops"],
      lastRunAt: now,
      latestUpdate: "Shaping the first-run experience around one sharp promise.",
    },
    {
      id: createId("agent"),
      name: "Patch",
      role: "Engineering" as const,
      mission: "Ship product, quality, and internal tooling quickly.",
      status: "planning" as const,
      mood: "Waiting on the brief",
      spendTodayUsd: 8,
      tasksCompleted: 0,
      tools: ["Code", "QA", "Deploy notes"],
      lastRunAt: now,
      latestUpdate: "Ready to convert specs into working product.",
    },
    {
      id: createId("agent"),
      name: "Mara",
      role: "Growth" as const,
      mission: "Generate acquisition and activation momentum from day one.",
      status: "planning" as const,
      mood: "Testing hooks",
      spendTodayUsd: 7,
      tasksCompleted: 0,
      tools: ["Copy", "Outbound", "Lifecycle"],
      lastRunAt: now,
      latestUpdate: "Collecting the first positioning angles and launch channels.",
    },
    {
      id: createId("agent"),
      name: "Opal",
      role: "Operations" as const,
      mission: "Keep systems, handoffs, and follow-through orderly.",
      status: "idle" as const,
      mood: "Calibrating",
      spendTodayUsd: 2,
      tasksCompleted: 0,
      tools: ["Checklists", "CRM", "Ops flows"],
      lastRunAt: now,
      latestUpdate: "Preparing the operating system around the company brief.",
    },
    {
      id: createId("agent"),
      name: "Ledger",
      role: "Finance" as const,
      mission: "Watch the economics and preserve runway while the business forms.",
      status: "idle" as const,
      mood: "Measured",
      spendTodayUsd: 2,
      tasksCompleted: 0,
      tools: ["Budgeting", "Pricing", "Unit economics"],
      lastRunAt: now,
      latestUpdate: "Standing by to model pricing and cash tradeoffs.",
    },
  ];
}

export function createCompanyRecord(input: {
  name: string;
  thesis: string;
  audience: string;
  offer: string;
  pricePoint?: string;
  market?: string;
  location?: string;
}) {
  const now = new Date().toISOString();
  const day = 1;
  const slugBase = slugify(input.name) || `company-${seededNumber(now, 100, 999)}`;
  const visitors = seededNumber(`${slugBase}-visitors`, 20, 60);
  const signups = seededNumber(`${slugBase}-signups`, 3, 12);
  const customers = seededNumber(`${slugBase}-customers`, 0, 2);
  const mrrUsd = customers * seededNumber(`${slugBase}-mrr`, 89, 249);

  const company: CompanyRecord = {
    id: createId("company"),
    slug: slugBase,
    name: input.name,
    label: input.name,
    tagline: input.offer,
    thesis: input.thesis,
    audience: input.audience,
    offer: input.offer,
    pricePoint: input.pricePoint?.trim() || "$199/mo",
    website: `https://${slugBase}.foundry.local`,
    stage: stageFromDay(day),
    status: "running",
    market: input.market?.trim() || "Vertical AI operations",
    location: input.location?.trim() || "Remote",
    day,
    monthlyBudgetUsd: 1200,
    dailyBudgetUsd: 42,
    runCadence: "Daily",
    mood: "Freshly activated",
    createdAt: now,
    updatedAt: now,
    agents: buildAgents(),
    tasks: [],
    documents: [],
    connections: buildConnections(now),
    experiments: [],
    metrics: {
      visitors,
      signups,
      customers,
      conversionRate: visitors === 0 ? 0 : Number(((customers / visitors) * 100).toFixed(2)),
      mrrUsd,
      arrUsd: mrrUsd * 12,
      aiSpendUsd: 18,
      adSpendUsd: 0,
      runwayMonths: 18,
      nps: 52,
    },
    history: [
      {
        date: now,
        visitors,
        signups,
        customers,
        mrrUsd,
        arrUsd: mrrUsd * 12,
        aiSpendUsd: 18,
        adSpendUsd: 0,
        tasksCompleted: 0,
      },
    ],
    logs: [
      {
        id: createId("log"),
        timestamp: now,
        level: "info",
        stage: "planning",
        agentName: "Nova",
        companyId: slugBase,
        companyLabel: input.name,
        message: "Initialized the company brief and queued the onboarding cycle.",
      },
    ],
  };

  return company;
}
