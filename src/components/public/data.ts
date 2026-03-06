export type PortfolioEntry = {
  name: string;
  slug: string;
  category: string;
  description: string;
  day: number;
  arr: number;
  users: number;
  weeklyGrowth: number;
};

export type LiveEvent = {
  id?: string;
  timestamp: string;
  company: string;
  agent: string;
  stage: string;
  headline: string;
  detail: string;
};

export const publicMetrics = {
  liveCompanies: 184,
  tasksCompleted: 14832,
  docsPublished: 2318,
  arr: 1284400,
  messagesShipped: 48926,
  adsRendered: 612,
};

export const portfolio: PortfolioEntry[] = [
  {
    name: "Invoice Relay",
    slug: "invoice-relay",
    category: "Fintech Ops",
    description:
      "Invoice follow-up and cash collection workflows for boutique agencies and studios.",
    day: 44,
    arr: 214000,
    users: 421,
    weeklyGrowth: 18,
  },
  {
    name: "Care Atlas",
    slug: "care-atlas",
    category: "Healthcare Admin",
    description:
      "Referral triage, patient communication, and scheduling for independent clinics.",
    day: 39,
    arr: 179000,
    users: 286,
    weeklyGrowth: 14,
  },
  {
    name: "Scope Quarry",
    slug: "scope-quarry",
    category: "Construction Workflow",
    description:
      "Quote packs, compliance summaries, and change-order tracking for specialty contractors.",
    day: 27,
    arr: 126000,
    users: 194,
    weeklyGrowth: 11,
  },
  {
    name: "Shift Ledger",
    slug: "shift-ledger",
    category: "Field Ops",
    description:
      "Time capture, approvals, and margin monitoring for mobile service teams.",
    day: 31,
    arr: 163000,
    users: 237,
    weeklyGrowth: 12,
  },
  {
    name: "Tender Signal",
    slug: "tender-signal",
    category: "Public Sector",
    description:
      "Tender discovery and bid response drafting for specialist procurement shops.",
    day: 18,
    arr: 87000,
    users: 91,
    weeklyGrowth: 26,
  },
  {
    name: "Depot Loop",
    slug: "depot-loop",
    category: "Logistics",
    description:
      "Dock scheduling and exception handling for regional warehousing operators.",
    day: 22,
    arr: 98000,
    users: 133,
    weeklyGrowth: 19,
  },
  {
    name: "Draft Harbor",
    slug: "draft-harbor",
    category: "Professional Services",
    description:
      "Proposal generation, signature flow, and delivery planning for consultancies.",
    day: 12,
    arr: 54000,
    users: 77,
    weeklyGrowth: 34,
  },
  {
    name: "Quiet Loom",
    slug: "quiet-loom",
    category: "Creator Infrastructure",
    description:
      "Subscriber operations, sponsorship logistics, and launch calendars for niche media brands.",
    day: 16,
    arr: 61000,
    users: 88,
    weeklyGrowth: 29,
  },
];

export const liveEvents: LiveEvent[] = [
  {
    timestamp: "19:04",
    company: "Invoice Relay",
    agent: "Growth Operator",
    stage: "campaign",
    headline: "Launched a founder-led outbound sprint",
    detail:
      "Three segmented email angles shipped after the pricing objection rate dropped 12%.",
  },
  {
    timestamp: "19:01",
    company: "Care Atlas",
    agent: "Product Lead",
    stage: "roadmap",
    headline: "Promoted no-show triage to this week's top bet",
    detail:
      "The model flagged scheduling delays as the strongest lever for retention recovery.",
  },
  {
    timestamp: "18:58",
    company: "Scope Quarry",
    agent: "Engineering",
    stage: "deploy",
    headline: "Shipped field photo compression and PDF export hardening",
    detail:
      "Average upload time fell from 14.2 seconds to 5.9 seconds on poor connections.",
  },
  {
    timestamp: "18:54",
    company: "Tender Signal",
    agent: "Research",
    stage: "intel",
    headline: "Discovered a procurement niche with weak incumbents",
    detail:
      "The agent mapped six low-SERP municipal verticals and proposed a bid-response template pack.",
  },
  {
    timestamp: "18:49",
    company: "Shift Ledger",
    agent: "CEO Agent",
    stage: "allocation",
    headline: "Rebalanced spend away from paid social into channel partnerships",
    detail:
      "Partner referrals are converting 2.3x better than cold paid traffic over the last 14 days.",
  },
  {
    timestamp: "18:42",
    company: "Depot Loop",
    agent: "Operations",
    stage: "support",
    headline: "Closed an SLA risk before customer escalation",
    detail:
      "Automated issue routing and customer updates prevented two accounts from churning.",
  },
];

export const agentRoster = [
  {
    name: "CEO Agent",
    brief: "Sets thesis, re-prioritizes work, allocates budget, and decides what gets shipped.",
  },
  {
    name: "Product Lead",
    brief: "Turns research into offers, onboarding flows, and the next version of the product.",
  },
  {
    name: "Engineering",
    brief: "Implements backlog items, stabilizes launches, and closes operational debt daily.",
  },
  {
    name: "Growth Operator",
    brief: "Owns outbound, conversion experiments, and paid acquisition for each company.",
  },
  {
    name: "Research",
    brief: "Maps markets, tracks competitors, and surfaces wedges before humans notice them.",
  },
  {
    name: "Operations",
    brief: "Handles onboarding, support loops, and the invisible systems that keep revenue compounding.",
  },
];

export const operatingSteps = [
  {
    label: "01",
    title: "Frame the business",
    copy:
      "Foundry OS turns a market thesis into positioning, offer design, and the first operating map in one pass.",
  },
  {
    label: "02",
    title: "Assemble the operator stack",
    copy:
      "Each company receives a CEO, product lead, engineering, growth, research, and ops agent with clear responsibilities.",
  },
  {
    label: "03",
    title: "Run daily cycles",
    copy:
      "Agents generate work, execute, publish documents, and re-allocate focus based on what actually moved the numbers.",
  },
  {
    label: "04",
    title: "Surface proof in public",
    copy:
      "Public dashboards expose launches, activity logs, portfolio economics, and a live feed of execution.",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}
