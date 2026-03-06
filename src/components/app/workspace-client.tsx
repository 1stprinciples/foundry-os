"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export type SessionUser = {
  id?: string;
  email: string;
  name?: string;
  companySlug?: string;
};

export type FeedRecord = {
  id: string;
  timestamp: string;
  stage: string;
  level: string;
  agentName: string;
  message: string;
};

export type ConnectorRecord = {
  id: string;
  name: string;
  status: string;
  detail?: string;
};

export type CompanyRecord = {
  id: string;
  slug: string;
  name: string;
  day: number;
  stage: string;
  status?: string;
  mood?: string;
  thesis?: string;
  offer?: string;
  audience?: string;
  monthlyBudget?: number;
  runCadence?: string;
  metrics?: Record<string, number | string | undefined>;
  links?: Record<string, string | undefined>;
  connectors?: ConnectorRecord[];
  logs?: FeedRecord[];
};

export type AgentRecord = {
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

export type TaskRecord = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tag: string;
  owner: string;
  createdAt?: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  type: string;
  summary: string;
  author: string;
  createdAt: string;
};

export type AnalyticsPoint = {
  date: string;
  arr?: number;
  visitors?: number;
  signups?: number;
  aiSpend?: number;
  tasksCompleted?: number;
};

type AnalyticsRecord = {
  history: AnalyticsPoint[];
  feed: FeedRecord[];
  experiments: Array<{
    id: string;
    name: string;
    status: string;
    summary: string;
  }>;
};

type WorkspaceBundle = {
  session: SessionUser | null;
  companies: CompanyRecord[];
  company: CompanyRecord | null;
  agents: AgentRecord[];
  tasks: TaskRecord[];
  documents: DocumentRecord[];
  analytics: AnalyticsRecord;
};

function asArray<T>(value: unknown, key: string): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    value &&
    typeof value === "object" &&
    key in value &&
    Array.isArray((value as Record<string, unknown>)[key])
  ) {
    return (value as Record<string, unknown>)[key] as T[];
  }

  return [];
}

function buildQuery(companySlug?: string) {
  return companySlug ? `?companySlug=${encodeURIComponent(companySlug)}` : "";
}

async function fetchJson(path: string) {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json();
}

function normalizeFeed(raw: Record<string, unknown>): FeedRecord {
  return {
    id: String(raw.id ?? ""),
    timestamp: String(raw.timestamp ?? ""),
    stage: String(raw.stage ?? "execution"),
    level: String(raw.level ?? "info"),
    agentName: String(raw.agentName ?? "Foundry"),
    message: String(raw.message ?? ""),
  };
}

function normalizeCompany(raw: Record<string, unknown>): CompanyRecord {
  const metrics =
    raw.metrics && typeof raw.metrics === "object"
      ? (raw.metrics as Record<string, number | string | undefined>)
      : {};

  return {
    id: String(raw.id ?? ""),
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    day: Number(raw.day ?? 0),
    stage: String(raw.stage ?? "idea"),
    status: raw.status ? String(raw.status) : undefined,
    mood: raw.mood ? String(raw.mood) : undefined,
    thesis: raw.thesis ? String(raw.thesis) : undefined,
    offer: raw.offer ? String(raw.offer) : undefined,
    audience: raw.audience ? String(raw.audience) : undefined,
    monthlyBudget: Number(raw.monthlyBudgetUsd ?? raw.monthlyBudget ?? 0),
    runCadence: raw.runCadence ? String(raw.runCadence) : "Daily cycle",
    links: {
      website: raw.website ? String(raw.website) : undefined,
      repo:
        raw.links && typeof raw.links === "object"
          ? String((raw.links as Record<string, unknown>).repo ?? "")
          : undefined,
    },
    connectors: asArray<Record<string, unknown>>(
      raw.connections ?? raw.connectors,
      "connectors",
    ).map((connector) => ({
      id: String(connector.id ?? ""),
      name: String(connector.name ?? ""),
      status: String(connector.status ?? "available"),
      detail: String(
        connector.description ?? connector.detail ?? "Connector metadata unavailable.",
      ),
    })),
    logs: asArray<Record<string, unknown>>(raw.logs, "logs").map(normalizeFeed),
    metrics: {
      arr: Number(metrics.arr ?? metrics.arrUsd ?? metrics.mrrUsd ?? 0),
      mrr: Number(metrics.mrr ?? metrics.mrrUsd ?? 0),
      visitors: Number(metrics.visitors ?? 0),
      signups: Number(metrics.signups ?? 0),
      customers: Number(metrics.customers ?? 0),
      aiSpend: Number(metrics.aiSpend ?? metrics.aiSpendUsd ?? 0),
      adSpend: Number(metrics.adSpend ?? metrics.adSpendUsd ?? 0),
      runwayMonths: Number(metrics.runwayMonths ?? 0),
      conversionRate: Number(metrics.conversionRate ?? 0),
      nps: Number(metrics.nps ?? 0),
    },
  };
}

function normalizeAgent(raw: Record<string, unknown>): AgentRecord {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    role: String(raw.role ?? ""),
    mission: String(raw.mission ?? ""),
    mood: String(raw.mood ?? ""),
    status: String(raw.status ?? "idle"),
    lastRunAt: raw.lastRunAt ? String(raw.lastRunAt) : undefined,
    spendToday: Number(raw.spendTodayUsd ?? raw.spendToday ?? 0),
    tasksCompleted: Number(raw.tasksCompleted ?? 0),
  };
}

function normalizeTask(raw: Record<string, unknown>): TaskRecord {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    status: String(raw.status ?? "todo"),
    priority: String(raw.priority ?? "medium"),
    tag: String(raw.tag ?? "general"),
    owner: String(raw.owner ?? raw.agentName ?? "Agent"),
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  };
}

function normalizeDocument(raw: Record<string, unknown>): DocumentRecord {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    type: String(raw.type ?? "document"),
    summary: String(raw.summary ?? ""),
    author: String(raw.author ?? "Foundry"),
    createdAt: String(raw.createdAt ?? ""),
  };
}

function normalizeHistory(points: Array<Record<string, unknown>>) {
  return points.map((point) => ({
    date: String(point.date ?? ""),
    arr: Number(point.arr ?? point.arrUsd ?? point.mrrUsd ?? 0),
    visitors: Number(point.visitors ?? 0),
    signups: Number(point.signups ?? 0),
    aiSpend: Number(point.aiSpend ?? point.aiSpendUsd ?? 0),
    tasksCompleted: Number(point.tasksCompleted ?? 0),
  }));
}

export function useWorkspaceBundle(initialSlug?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [bundle, setBundle] = useState<WorkspaceBundle>({
    session: null,
    companies: [],
    company: null,
    agents: [],
    tasks: [],
    documents: [],
    analytics: {
      history: [],
      feed: [],
      experiments: [],
    },
  });

  const refresh = useCallback(() => {
    setTick((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [sessionPayload, companiesPayload] = await Promise.all([
          fetchJson("/api/auth/session").catch(() => null),
          fetchJson("/api/companies"),
        ]);

        const session =
          sessionPayload && typeof sessionPayload === "object"
            ? (((sessionPayload as Record<string, unknown>).session as SessionUser | null) ??
              null)
            : null;
        const companies = asArray<Record<string, unknown>>(
          companiesPayload,
          "companies",
        ).map(normalizeCompany);
        const defaultCompanySlug =
          companiesPayload &&
          typeof companiesPayload === "object" &&
          "defaultCompanySlug" in companiesPayload
            ? String(
                (companiesPayload as Record<string, unknown>).defaultCompanySlug ?? "",
              )
            : "";
        const activeSlug =
          initialSlug || session?.companySlug || defaultCompanySlug || companies[0]?.slug;
        const query = buildQuery(activeSlug);

        const [agentsPayload, tasksPayload, documentsPayload, analyticsPayload] =
          await Promise.all([
            fetchJson(`/api/agents${query}`).catch(() => []),
            fetchJson(`/api/tasks${query}`).catch(() => []),
            fetchJson(`/api/documents${query}`).catch(() => []),
            fetchJson(`/api/analytics/latest${query}`).catch(() => ({})),
          ]);

        if (cancelled) {
          return;
        }

        const company =
          companies.find((item) => item.slug === activeSlug) ?? companies[0] ?? null;
        const analyticsRecord =
          analyticsPayload && typeof analyticsPayload === "object"
            ? (analyticsPayload as Record<string, unknown>)
            : {};

        setBundle({
          session,
          companies,
          company,
          agents: asArray<Record<string, unknown>>(agentsPayload, "agents").map(
            normalizeAgent,
          ),
          tasks: asArray<Record<string, unknown>>(tasksPayload, "tasks").map(
            normalizeTask,
          ),
          documents: asArray<Record<string, unknown>>(
            documentsPayload,
            "documents",
          ).map(normalizeDocument),
          analytics: {
            history: normalizeHistory(
              asArray<Record<string, unknown>>(analyticsRecord.history, "history").length
                ? asArray<Record<string, unknown>>(analyticsRecord.history, "history")
                : asArray<Record<string, unknown>>(analyticsPayload, "history"),
            ),
            feed: asArray<Record<string, unknown>>(analyticsPayload, "feed").map(
              normalizeFeed,
            ).length
              ? asArray<Record<string, unknown>>(analyticsPayload, "feed").map(
                  normalizeFeed,
                )
              : company?.logs ?? [],
            experiments: asArray<AnalyticsRecord["experiments"][number]>(
              analyticsPayload,
              "experiments",
            ),
          },
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the workspace.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [initialSlug, tick]);

  return {
    loading,
    error,
    refresh,
    ...bundle,
  };
}

export function SessionGate({
  session,
}: {
  session: SessionUser | null;
}) {
  if (session) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] border border-[#ff6a00]/20 bg-[#ff6a00]/8 p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#a14500]">
        Session required
      </p>
      <h3 className="mt-3 font-serif text-3xl">Open the magic link once.</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
        Foundry uses passwordless local auth. Visit the login page, request a
        link, and the rest of the operating system will unlock.
      </p>
      <Link
        href="/login"
        className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
      >
        Go to login
      </Link>
    </section>
  );
}

export function useCompanyMetrics(company: CompanyRecord | null) {
  return useMemo(() => company?.metrics ?? {}, [company]);
}
