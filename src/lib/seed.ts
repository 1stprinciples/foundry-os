import type {
  ActivityLog,
  AgentProfile,
  AppState,
  CompanyMetrics,
  CompanyRecord,
  ConnectionRecord,
  DocumentRecord,
  GrowthExperiment,
  MetricPoint,
  TaskItem,
} from "@/lib/types";
import {
  createId,
  isoDaysAgo,
  isoDaysAhead,
  seededNumber,
  stageFromDay,
} from "@/lib/utils";

type Blueprint = {
  slug: string;
  name: string;
  tagline: string;
  thesis: string;
  audience: string;
  offer: string;
  pricePoint: string;
  website: string;
  market: string;
  location: string;
  day: number;
  mood: string;
  monthlyBudgetUsd: number;
  dailyBudgetUsd: number;
};

const blueprints: Blueprint[] = [
  {
    slug: "signal-desk",
    name: "SignalDesk",
    tagline: "Autonomous retention and upsell ops for boutique B2B SaaS.",
    thesis:
      "Run product marketing, lifecycle messaging, and launch analysis without spinning up a full GTM team.",
    audience: "Bootstrapped B2B SaaS teams with 2-20 employees",
    offer: "Retention briefs, launch pages, onboarding flows, and expansion campaigns",
    pricePoint: "$299/mo",
    website: "https://signaldesk.foundry.local",
    market: "B2B SaaS operations",
    location: "Berlin",
    day: 36,
    mood: "Focused and compounding",
    monthlyBudgetUsd: 3200,
    dailyBudgetUsd: 95,
  },
  {
    slug: "grant-forge",
    name: "GrantForge",
    tagline: "Proposal intelligence for climate and public funding teams.",
    thesis:
      "Compress grant research, proposal drafts, and compliance checklists into one autonomous operating loop.",
    audience: "Climate startups and civic innovation consultancies",
    offer: "Opportunity research, bid writing, review decks, and follow-up operations",
    pricePoint: "$490/mo",
    website: "https://grantforge.foundry.local",
    market: "Government funding operations",
    location: "Amsterdam",
    day: 18,
    mood: "Investigative and hungry",
    monthlyBudgetUsd: 2700,
    dailyBudgetUsd: 82,
  },
  {
    slug: "trailmail",
    name: "Trailmail",
    tagline: "Lifecycle email and referral loops for outdoor hospitality brands.",
    thesis:
      "Automate guest communications, upsells, and repeat bookings for modern campgrounds and adventure stays.",
    audience: "Independent campgrounds, glamping brands, and tour operators",
    offer: "Email automations, referral campaigns, guest funnels, and reporting",
    pricePoint: "$189/mo",
    website: "https://trailmail.foundry.local",
    market: "Hospitality growth ops",
    location: "Denver",
    day: 24,
    mood: "Warm, active, and shipping",
    monthlyBudgetUsd: 1800,
    dailyBudgetUsd: 55,
  },
  {
    slug: "ledgerlane",
    name: "LedgerLane",
    tagline: "Back-office intelligence for fractional finance teams.",
    thesis:
      "Deploy autonomous agents that reconcile workflows, draft cash updates, and package client-ready finance ops.",
    audience: "Fractional CFOs and accounting boutiques",
    offer: "Cash summaries, month-end tasking, ops runbooks, and reporting packets",
    pricePoint: "$350/mo",
    website: "https://ledgerlane.foundry.local",
    market: "Finance operations",
    location: "London",
    day: 52,
    mood: "Calm and methodical",
    monthlyBudgetUsd: 3600,
    dailyBudgetUsd: 110,
  },
];

function historyForCompany(blueprint: Blueprint): MetricPoint[] {
  return Array.from({ length: 14 }).map((_, index) => {
    const dayOffset = 13 - index;
    const visitors = seededNumber(`${blueprint.slug}-v-${index}`, 160, 980) +
      blueprint.day * 9;
    const signups = seededNumber(`${blueprint.slug}-s-${index}`, 8, 58);
    const customers = seededNumber(`${blueprint.slug}-c-${index}`, 2, 21);
    const mrrUsd = seededNumber(`${blueprint.slug}-mrr-${index}`, 1800, 14800) +
      blueprint.day * 110;
    const aiSpendUsd = seededNumber(`${blueprint.slug}-ai-${index}`, 16, 63);
    const adSpendUsd = seededNumber(`${blueprint.slug}-ad-${index}`, 0, 120);
    const tasksCompleted = seededNumber(`${blueprint.slug}-tasks-${index}`, 4, 19);

    return {
      date: isoDaysAgo(dayOffset),
      visitors,
      signups,
      customers,
      mrrUsd,
      arrUsd: mrrUsd * 12,
      aiSpendUsd,
      adSpendUsd,
      tasksCompleted,
    };
  });
}

function latestMetrics(history: MetricPoint[]): CompanyMetrics {
  const latest = history.at(-1)!;

  return {
    visitors: latest.visitors,
    signups: latest.signups,
    customers: latest.customers,
    conversionRate: Number(((latest.customers / latest.visitors) * 100).toFixed(2)),
    mrrUsd: latest.mrrUsd,
    arrUsd: latest.arrUsd,
    aiSpendUsd: latest.aiSpendUsd,
    adSpendUsd: latest.adSpendUsd,
    runwayMonths: seededNumber(`runway-${latest.date}`, 9, 24),
    nps: seededNumber(`nps-${latest.date}`, 41, 72),
  };
}

function connectionsForCompany(blueprint: Blueprint): ConnectionRecord[] {
  return [
    {
      id: createId("conn"),
      name: "GitHub",
      category: "code",
      status: "connected",
      description: `Source control and deploy hooks for ${blueprint.name}`,
      connectedAt: isoDaysAgo(blueprint.day % 10),
    },
    {
      id: createId("conn"),
      name: "Postmark",
      category: "distribution",
      status: "connected",
      description: "Outbound lifecycle and onboarding messages",
      connectedAt: isoDaysAgo((blueprint.day + 2) % 9),
    },
    {
      id: createId("conn"),
      name: "Stripe",
      category: "payments",
      status: blueprint.day > 20 ? "connected" : "available",
      description: "Checkout and subscription tracking",
      connectedAt: blueprint.day > 20 ? isoDaysAgo(8) : undefined,
    },
    {
      id: createId("conn"),
      name: "Plausible",
      category: "analytics",
      status: "connected",
      description: "Traffic and conversion events",
      connectedAt: isoDaysAgo(6),
    },
    {
      id: createId("conn"),
      name: "Clay",
      category: "operations",
      status: blueprint.day > 30 ? "connected" : "attention",
      description: "Lead enrichment and outreach lists",
      connectedAt: blueprint.day > 30 ? isoDaysAgo(4) : undefined,
    },
  ];
}

function agentsForCompany(blueprint: Blueprint): AgentProfile[] {
  return [
    {
      id: createId("agent"),
      name: "Nova",
      role: "CEO",
      mission: "Translate company context into a daily operating agenda.",
      status: "planning",
      mood: blueprint.mood,
      spendTodayUsd: seededNumber(`${blueprint.slug}-ceo`, 7, 24),
      tasksCompleted: seededNumber(`${blueprint.slug}-ceo-tasks`, 2, 9),
      tools: ["Roadmaps", "Experiment scoring", "Task routing"],
      lastRunAt: isoDaysAgo(0),
      latestUpdate: "Rebalanced the week around the highest-leverage path to revenue.",
    },
    {
      id: createId("agent"),
      name: "Trace",
      role: "Research",
      mission: "Map markets, competitors, and customer language before each cycle.",
      status: "executing",
      mood: "Curious",
      spendTodayUsd: seededNumber(`${blueprint.slug}-research`, 4, 17),
      tasksCompleted: seededNumber(`${blueprint.slug}-research-tasks`, 1, 6),
      tools: ["Web research", "Pattern mapping", "Insight synthesis"],
      lastRunAt: isoDaysAgo(0),
      latestUpdate: "Pulled new market signals and buyer objections into the workspace.",
    },
    {
      id: createId("agent"),
      name: "Quill",
      role: "Product",
      mission: "Shape the minimum lovable workflow and keep the value loop obvious.",
      status: "planning",
      mood: "Condensing scope",
      spendTodayUsd: seededNumber(`${blueprint.slug}-product`, 5, 18),
      tasksCompleted: seededNumber(`${blueprint.slug}-product-tasks`, 1, 7),
      tools: ["Journey mapping", "Spec writing", "Feedback synthesis"],
      lastRunAt: isoDaysAgo(0),
      latestUpdate: "Tightened the first-run journey around one clear outcome.",
    },
    {
      id: createId("agent"),
      name: "Patch",
      role: "Engineering",
      mission: "Ship product fixes, internal tooling, and quality improvements.",
      status: "executing",
      mood: "Locked in",
      spendTodayUsd: seededNumber(`${blueprint.slug}-eng`, 10, 38),
      tasksCompleted: seededNumber(`${blueprint.slug}-eng-tasks`, 2, 12),
      tools: ["Code generation", "QA", "Deploy notes"],
      lastRunAt: isoDaysAgo(0),
      latestUpdate: "Moved new work into review and refreshed the release checklist.",
    },
    {
      id: createId("agent"),
      name: "Mara",
      role: "Growth",
      mission: "Drive acquisition, referral loops, and conversion experiments.",
      status: "planning",
      mood: "Testing angles",
      spendTodayUsd: seededNumber(`${blueprint.slug}-growth`, 8, 33),
      tasksCompleted: seededNumber(`${blueprint.slug}-growth-tasks`, 1, 8),
      tools: ["Campaign drafting", "Ad hooks", "Email flows"],
      lastRunAt: isoDaysAgo(0),
      latestUpdate: "Queued two acquisition experiments and refreshed landing page hooks.",
    },
    {
      id: createId("agent"),
      name: "Opal",
      role: "Operations",
      mission: "Keep every follow-up, handoff, and internal checklist moving.",
      status: "idle",
      mood: "Orderly",
      spendTodayUsd: seededNumber(`${blueprint.slug}-ops`, 3, 12),
      tasksCompleted: seededNumber(`${blueprint.slug}-ops-tasks`, 1, 5),
      tools: ["Inbox triage", "CRM hygiene", "Playbooks"],
      lastRunAt: isoDaysAgo(1),
      latestUpdate: "Closed loops on internal checklists and billing ops.",
    },
    {
      id: createId("agent"),
      name: "Ledger",
      role: "Finance",
      mission: "Track cash, pricing pressure, and unit economics.",
      status: "idle",
      mood: "Measured",
      spendTodayUsd: seededNumber(`${blueprint.slug}-finance`, 2, 9),
      tasksCompleted: seededNumber(`${blueprint.slug}-finance-tasks`, 1, 4),
      tools: ["Cohort math", "Cash tracking", "Pricing scenarios"],
      lastRunAt: isoDaysAgo(1),
      latestUpdate: "Updated runway view and highlighted spend guardrails.",
    },
  ];
}

function tasksForCompany(blueprint: Blueprint): TaskItem[] {
  return [
    {
      id: createId("task"),
      title: `Tighten positioning for ${blueprint.audience}`,
      description:
        "Refine homepage and outbound copy so the primary outcome is obvious inside the first screen.",
      status: "review",
      priority: "high",
      owner: "CEO",
      tag: "positioning",
      createdAt: isoDaysAgo(4),
      updatedAt: isoDaysAgo(0),
      dueAt: isoDaysAhead(1),
    },
    {
      id: createId("task"),
      title: "Ship onboarding friction fixes",
      description:
        "Instrument the first-run journey, remove any dead ends, and rewrite unclear field labels.",
      status: "in_progress",
      priority: "critical",
      owner: "Engineering",
      tag: "product",
      createdAt: isoDaysAgo(2),
      updatedAt: isoDaysAgo(0),
      dueAt: isoDaysAhead(2),
    },
    {
      id: createId("task"),
      title: "Draft 3 outbound hooks from live customer language",
      description:
        "Use support and demo notes to build a fresh outbound sequence with sharper problem framing.",
      status: "todo",
      priority: "high",
      owner: "Growth",
      tag: "growth",
      createdAt: isoDaysAgo(1),
      updatedAt: isoDaysAgo(1),
      dueAt: isoDaysAhead(1),
    },
    {
      id: createId("task"),
      title: "Package a weekly founder update",
      description:
        "Summarize metric deltas, active experiments, and blockers in one investor-ready memo.",
      status: "backlog",
      priority: "medium",
      owner: "Finance",
      tag: "reporting",
      createdAt: isoDaysAgo(3),
      updatedAt: isoDaysAgo(2),
    },
    {
      id: createId("task"),
      title: "Expand the customer objection library",
      description:
        "Capture objections from demos and lost deals so future messaging gets stronger every cycle.",
      status: "done",
      priority: "medium",
      owner: "Research",
      tag: "research",
      createdAt: isoDaysAgo(6),
      updatedAt: isoDaysAgo(1),
      outcome: "14 fresh objections tagged and linked to supporting notes.",
    },
  ];
}

function documentsForCompany(blueprint: Blueprint): DocumentRecord[] {
  return [
    {
      id: createId("doc"),
      title: `${blueprint.name} Market Map`,
      type: "market_brief",
      summary: "TAM framing, competitive clusters, and language pulled from buyers.",
      author: "Research",
      createdAt: isoDaysAgo(7),
      body: `Thesis\n${blueprint.thesis}\n\nAudience\n${blueprint.audience}\n\nEdge\n${blueprint.offer}\n\nNext move\nOwn the “done-for-you ops” angle instead of another dashboard story.`,
    },
    {
      id: createId("doc"),
      title: "Launch plan",
      type: "launch_plan",
      summary: "Four-step route from shipping to repeatable acquisition.",
      author: "CEO",
      createdAt: isoDaysAgo(4),
      body: `1. Clarify promise on the homepage.\n2. Ship one proof point for the core use case.\n3. Run narrow outbound into a single ICP.\n4. Publish a weekly operating memo so the story compounds.`,
    },
    {
      id: createId("doc"),
      title: "Growth experiments board",
      type: "experiment_report",
      summary: "Live experiment inventory with hypotheses and outcomes.",
      author: "Growth",
      createdAt: isoDaysAgo(2),
      body: `Experiment A: founder-led teardown offer.\nExperiment B: proof-driven email bump.\nExperiment C: referral loop post-purchase.\n\nWinning pattern so far: sharper before/after language beats feature lists.`,
    },
  ];
}

function experimentsForCompany(): GrowthExperiment[] {
  return [
    {
      id: createId("exp"),
      name: "Founder teardown offer",
      channel: "Cold email",
      hypothesis:
        "A personalized teardown hook will outperform generic feature outreach for first meetings.",
      status: "running",
      resultSummary: "Open rate improving; still tuning CTA friction.",
    },
    {
      id: createId("exp"),
      name: "Proof-first homepage hero",
      channel: "Website",
      hypothesis:
        "Replacing abstract AI language with concrete operational outcomes will lift conversions.",
      status: "won",
      resultSummary: "Signups per 100 sessions up 18% week-over-week.",
    },
    {
      id: createId("exp"),
      name: "Referral nudge after activation",
      channel: "Lifecycle email",
      hypothesis: "Customers with a first-week win will refer peers when prompted immediately.",
      status: "queued",
      resultSummary: "Queued behind onboarding cleanup work.",
    },
  ];
}

function logsForCompany(blueprint: Blueprint): ActivityLog[] {
  return [
    {
      id: createId("log"),
      timestamp: isoDaysAgo(0),
      level: "info",
      stage: "planning",
      agentName: "Nova",
      companyId: blueprint.slug,
      companyLabel: blueprint.name,
      message: "Reframed today around the shortest path to new revenue.",
    },
    {
      id: createId("log"),
      timestamp: isoDaysAgo(0),
      level: "info",
      stage: "tool_use",
      agentName: "Trace",
      companyId: blueprint.slug,
      companyLabel: blueprint.name,
      message: "Collecting fresh competitor proof points and objection language.",
    },
    {
      id: createId("log"),
      timestamp: isoDaysAgo(0),
      level: "info",
      stage: "tool_result",
      agentName: "Patch",
      companyId: blueprint.slug,
      companyLabel: blueprint.name,
      message: "Released onboarding instrumentation and cleaned up error handling.",
    },
    {
      id: createId("log"),
      timestamp: isoDaysAgo(0),
      level: "info",
      stage: "execution",
      agentName: "Mara",
      companyId: blueprint.slug,
      companyLabel: blueprint.name,
      message: "Queued a tighter outbound sequence from fresh customer language.",
    },
  ];
}

function buildCompany(blueprint: Blueprint): CompanyRecord {
  const history = historyForCompany(blueprint);

  return {
    id: createId("company"),
    slug: blueprint.slug,
    name: blueprint.name,
    label: blueprint.name,
    tagline: blueprint.tagline,
    thesis: blueprint.thesis,
    audience: blueprint.audience,
    offer: blueprint.offer,
    pricePoint: blueprint.pricePoint,
    website: blueprint.website,
    stage: stageFromDay(blueprint.day),
    status: "running",
    market: blueprint.market,
    location: blueprint.location,
    day: blueprint.day,
    monthlyBudgetUsd: blueprint.monthlyBudgetUsd,
    dailyBudgetUsd: blueprint.dailyBudgetUsd,
    runCadence: "Daily",
    mood: blueprint.mood,
    createdAt: isoDaysAgo(blueprint.day + 10),
    updatedAt: new Date().toISOString(),
    agents: agentsForCompany(blueprint),
    tasks: tasksForCompany(blueprint),
    documents: documentsForCompany(blueprint),
    connections: connectionsForCompany(blueprint),
    experiments: experimentsForCompany(),
    metrics: latestMetrics(history),
    history,
    logs: logsForCompany(blueprint),
  };
}

export function createSeedState(): AppState {
  const companies = blueprints.map(buildCompany);

  return {
    brand: {
      name: "Foundry",
      descriptor: "Autonomous venture operating system",
      supportEmail: "operators@foundry.local",
    },
    user: {
      email: "operator@foundry.local",
      name: "Foundry Operator",
      timezone: "Europe/Berlin",
      defaultCompanySlug: companies[0]?.slug ?? "signal-desk",
    },
    magicLinks: [],
    sessions: [],
    companies,
  };
}
