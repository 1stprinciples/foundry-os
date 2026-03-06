import type {
  ActivityLog,
  CompanyRecord,
  DocumentRecord,
  OperatingCycleResult,
  TaskItem,
  AgentRole,
  DocumentType,
  TaskPriority,
} from "@/lib/types";
import { findCompanyBySlug, updateState } from "@/lib/store";
import {
  clamp,
  createId,
  isoDaysAhead,
  seededNumber,
  stageFromDay,
} from "@/lib/utils";

function focusForStage(company: CompanyRecord) {
  type TaskTemplate = {
    owner: AgentRole;
    title: string;
    description: string;
    tag: string;
    priority: TaskPriority;
  };

  type DocumentTemplate = {
    type: DocumentType;
    title: string;
    author: AgentRole;
    summary: string;
  };

  const createFocus = (headline: string, taskSet: TaskTemplate[], documentSet: DocumentTemplate[]) => ({
    headline,
    taskSet,
    documentSet,
  });

  switch (company.stage) {
    case "idea":
      return createFocus(
        "Find the sharpest wedge and make the offer tangible.",
        [
          {
            owner: "Research",
            title: `Map the top 8 workflow pains in ${company.market}`,
            description:
              "Turn fragmented customer language into one concrete problem stack and a sharper ICP.",
            tag: "research",
            priority: "high",
          },
          {
            owner: "CEO",
            title: "Rewrite the founding memo",
            description:
              "Translate strategy into one market thesis, one buyer, and one before/after promise.",
            tag: "strategy",
            priority: "critical",
          },
          {
            owner: "Product",
            title: "Design the thinnest-possible first run",
            description:
              "Reduce onboarding to the smallest workflow that proves the core outcome.",
            tag: "product",
            priority: "high",
          },
        ],
        [
          {
            type: "market_brief",
            title: `${company.name} wedge brief`,
            author: "Research",
            summary: "A narrowed ICP, problem stack, and proof-backed positioning frame.",
          },
        ],
      );
    case "building":
      return createFocus(
        "Tighten the product loop and remove friction before scaling.",
        [
          {
            owner: "Engineering",
            title: "Ship the highest-friction onboarding fix",
            description:
              "Resolve the one workflow issue most likely to block a first-week win for new customers.",
            tag: "product",
            priority: "critical",
          },
          {
            owner: "Growth",
            title: "Refresh homepage proof and CTA hierarchy",
            description:
              "Make the promise concrete, visible, and supported by one piece of operational proof.",
            tag: "growth",
            priority: "high",
          },
          {
            owner: "Operations",
            title: "Codify follow-up and handoff rules",
            description:
              "Push repeatable ops into a checklist so growth does not create internal chaos.",
            tag: "ops",
            priority: "medium",
          },
        ],
        [
          {
            type: "roadmap",
            title: "Friction kill list",
            author: "Engineering",
            summary: "The smallest fixes most likely to improve activation and customer trust.",
          },
        ],
      );
    case "launching":
      return createFocus(
        "Use proof to convert attention into customers.",
        [
          {
            owner: "Growth",
            title: "Draft a vertical outbound sequence",
            description:
              "Write a proof-led sequence anchored on one painful manual workflow and one measurable win.",
            tag: "growth",
            priority: "critical",
          },
          {
            owner: "CEO",
            title: "Package this week’s launch narrative",
            description:
              "Create a founder update that shows traction, sharpens the story, and aligns the next cycle.",
            tag: "strategy",
            priority: "high",
          },
          {
            owner: "Finance",
            title: "Pressure-test pricing and CAC",
            description:
              "Look for hidden pricing headroom and decide where spend should tighten or expand.",
            tag: "finance",
            priority: "medium",
          },
        ],
        [
          {
            type: "copy",
            title: "Proof-first launch assets",
            author: "Growth",
            summary: "Fresh landing page and outbound copy for the strongest offer angle.",
          },
        ],
      );
    case "scaling":
    default:
      return createFocus(
        "Defend margin while doubling down on the best channels.",
        [
          {
            owner: "Operations",
            title: "Tighten fulfillment and support loops",
            description:
              "Document what breaks under higher volume and ship the next automation guardrails.",
            tag: "ops",
            priority: "high",
          },
          {
            owner: "Growth",
            title: "Scale the highest-performing acquisition motion",
            description:
              "Expand one proven channel instead of splitting attention across too many campaigns.",
            tag: "growth",
            priority: "critical",
          },
          {
            owner: "Finance",
            title: "Review burn, contribution margin, and hiring pressure",
            description:
              "Make the spend tradeoffs explicit before volume creates invisible drag.",
            tag: "finance",
            priority: "high",
          },
        ],
        [
          {
            type: "investor_update",
            title: "Scale memo",
            author: "CEO",
            summary: "A weekly brief covering growth, margins, operating leverage, and next bets.",
          },
        ],
      );
  }
}

function buildTask(company: CompanyRecord, template: (ReturnType<typeof focusForStage>)["taskSet"][number]): TaskItem {
  const now = new Date().toISOString();
  return {
    id: createId("task"),
    title: template.title,
    description: template.description,
    status: "todo",
    priority: template.priority,
    owner: template.owner,
    tag: template.tag,
    createdAt: now,
    updatedAt: now,
    dueAt: isoDaysAhead(2),
  };
}

function buildDocument(
  company: CompanyRecord,
  template: (ReturnType<typeof focusForStage>)["documentSet"][number],
): DocumentRecord {
  const now = new Date().toISOString();
  return {
    id: createId("doc"),
    title: template.title,
    type: template.type,
    summary: template.summary,
    author: template.author,
    createdAt: now,
    body: `${company.name}\n\nFocus\n${template.summary}\n\nOffer\n${company.offer}\n\nAudience\n${company.audience}\n\nCycle note\n${focusForStage(company).headline}`,
  };
}

function buildLog(company: CompanyRecord, agentName: string, message: string): ActivityLog {
  return {
    id: createId("log"),
    timestamp: new Date().toISOString(),
    level: "info",
    stage: "execution",
    agentName,
    companyId: company.id,
    companyLabel: company.name,
    message,
  };
}

function mergeUniqueByTitle<T extends { title: string }>(
  existing: T[],
  incoming: T[],
) {
  const seenTitles = new Set(existing.map((item) => item.title));
  const freshItems = incoming.filter((item) => {
    if (seenTitles.has(item.title)) {
      return false;
    }

    seenTitles.add(item.title);
    return true;
  });

  return {
    freshItems,
    combined: [...freshItems, ...existing],
  };
}

function advanceMetrics(company: CompanyRecord) {
  const visitorLift = seededNumber(`${company.slug}-${company.day}-visitors`, 22, 180);
  const signupLift = seededNumber(`${company.slug}-${company.day}-signups`, 3, 16);
  const customerLift = seededNumber(`${company.slug}-${company.day}-customers`, 0, 3);
  const aiSpendLift = seededNumber(`${company.slug}-${company.day}-ai`, 6, 24);
  const adSpendLift = seededNumber(`${company.slug}-${company.day}-ads`, 0, 28);
  const mrrLift = customerLift * seededNumber(`${company.slug}-${company.day}-mrr`, 79, 420);

  company.metrics.visitors += visitorLift;
  company.metrics.signups += signupLift;
  company.metrics.customers += customerLift;
  company.metrics.mrrUsd += mrrLift;
  company.metrics.arrUsd = company.metrics.mrrUsd * 12;
  company.metrics.aiSpendUsd += aiSpendLift;
  company.metrics.adSpendUsd += adSpendLift;
  company.metrics.conversionRate = Number(
    ((company.metrics.customers / company.metrics.visitors) * 100).toFixed(2),
  );
  company.metrics.runwayMonths = clamp(
    company.metrics.runwayMonths - customerLift * 0.08 + 0.3,
    6,
    36,
  );

  company.history.push({
    date: new Date().toISOString(),
    visitors: company.metrics.visitors,
    signups: company.metrics.signups,
    customers: company.metrics.customers,
    mrrUsd: company.metrics.mrrUsd,
    arrUsd: company.metrics.arrUsd,
    aiSpendUsd: aiSpendLift,
    adSpendUsd: adSpendLift,
    tasksCompleted: seededNumber(`${company.slug}-${company.day}-taskcount`, 5, 18),
  });
  company.history = company.history.slice(-21);
}

export async function runOperatingCycle(
  companySlug: string,
  mode: "cycle" | "onboarding" = "cycle",
): Promise<OperatingCycleResult | null> {
  const existing = await findCompanyBySlug(companySlug);

  if (!existing) {
    return null;
  }

  return updateState((state) => {
    const company = state.companies.find((item) => item.slug === companySlug);

    if (!company) {
      return null;
    }

    company.day += 1;
    company.stage = stageFromDay(company.day);
    company.updatedAt = new Date().toISOString();

    const focus = focusForStage(company);
    const proposedTasks = focus.taskSet.map((task) => buildTask(company, task));
    const proposedDocuments = focus.documentSet.map((document) =>
      buildDocument(company, document),
    );
    const { freshItems: createdTasks, combined: nextTasks } = mergeUniqueByTitle(
      company.tasks,
      proposedTasks,
    );
    const { freshItems: createdDocuments, combined: nextDocuments } =
      mergeUniqueByTitle(company.documents, proposedDocuments);

    const logs = [
      buildLog(company, "Nova", `Set the cycle theme: ${focus.headline}`),
      buildLog(company, "Trace", "Updated research notes and refreshed the objection map."),
      buildLog(company, "Patch", "Prepared engineering and product execution for the new cycle."),
      buildLog(company, "Mara", "Queued growth work aligned with the day’s strongest signal."),
    ];

    company.tasks = nextTasks.slice(0, 40);
    company.documents = nextDocuments.slice(0, 20);
    company.logs = [...logs, ...company.logs].slice(0, 60);

    company.agents = company.agents.map((agent, index) => ({
      ...agent,
      status: index < 4 ? "executing" : "planning",
      spendTodayUsd: Number(
        (agent.spendTodayUsd + seededNumber(`${agent.id}-${company.day}`, 1, 7)).toFixed(2),
      ),
      tasksCompleted: agent.tasksCompleted + seededNumber(`${agent.id}-tasks-${company.day}`, 0, 3),
      lastRunAt: new Date().toISOString(),
      latestUpdate:
        mode === "onboarding"
          ? "Converted the initial brief into a concrete launch system."
          : focus.headline,
    }));

    advanceMetrics(company);
    company.mood =
      mode === "onboarding"
        ? "Freshly activated"
        : ["Focused", "Expanding", "Disciplined", "Shipping"][
            seededNumber(`${company.slug}-mood-${company.day}`, 0, 3)
          ]!;

    return {
      company,
      createdTasks,
      createdDocuments,
      logs,
    };
  });
}
