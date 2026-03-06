import type {
  ActivityLog,
  AppState,
  PublicCompanyCard,
  PublicDashboardPayload,
} from "@/lib/types";
import { average, percentChange } from "@/lib/utils";

function arrHistory(state: AppState) {
  const byDate = new Map<string, number>();

  for (const company of state.companies) {
    for (const point of company.history) {
      const day = point.date.slice(0, 10);
      byDate.set(day, (byDate.get(day) ?? 0) + point.arrUsd);
    }
  }

  return [...byDate.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .slice(-14)
    .map(([date, arrUsd]) => ({ date, arrUsd }));
}

function publicCompanies(state: AppState): PublicCompanyCard[] {
  return state.companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    tagline: company.tagline,
    website: company.website,
    stage: company.stage,
    day: company.day,
    arrUsd: company.metrics.arrUsd,
    visitors: company.metrics.visitors,
    customers: company.metrics.customers,
  }));
}

function latestLogs(state: AppState): ActivityLog[] {
  return state.companies
    .flatMap((company) => company.logs)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, 20);
}

export function buildPublicDashboard(state: AppState): PublicDashboardPayload {
  const companies = publicCompanies(state);
  const logs = latestLogs(state);
  const tasks = state.companies
    .flatMap((company) => company.tasks)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 12);

  const arrSeries = arrHistory(state);
  const latestArr = arrSeries.at(-1)?.arrUsd ?? 0;
  const previousArr = arrSeries.at(-2)?.arrUsd ?? 0;
  const conversionRates = state.companies.map((company) => company.metrics.conversionRate);
  const totalAgents = state.companies.reduce(
    (total, company) => total + company.agents.length,
    0,
  );

  return {
    success: true,
    brand: state.brand,
    stats: {
      arrUsd: latestArr,
      companies: companies.length,
      tasksCompleted: state.companies.reduce(
        (total, company) => total + company.history.at(-1)!.tasksCompleted,
        0,
      ),
      docsCreated24h: state.companies.reduce(
        (total, company) =>
          total +
          company.documents.filter((document) => {
            const age = Date.now() - new Date(document.createdAt).getTime();
            return age < 24 * 60 * 60 * 1000;
          }).length,
        0,
      ),
      messagesSent: state.companies.reduce(
        (total, company) => total + Math.round(company.metrics.signups * 2.6),
        0,
      ),
      activeAgents: totalAgents,
    },
    companies,
    logs,
    tasks,
    arrHistory: arrSeries,
    dailyMetrics: {
      computedAt: new Date().toISOString(),
      activeCompanies: companies.length,
      liveCompanies: state.companies.filter((company) => company.status === "running").length,
      wowArrGrowthPct: Number(percentChange(latestArr, previousArr).toFixed(1)),
      avgConversionPct: Number(average(conversionRates).toFixed(2)),
      aiSpendTodayUsd: Number(
        state.companies
          .reduce((total, company) => total + company.metrics.aiSpendUsd, 0)
          .toFixed(2),
      ),
    },
  };
}
