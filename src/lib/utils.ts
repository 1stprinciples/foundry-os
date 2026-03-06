import crypto from "node:crypto";

import type {
  AgentRole,
  CompanyMetrics,
  CompanyStage,
  TaskPriority,
} from "@/lib/types";

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function seededNumber(seed: string, min: number, max: number) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  const ratio = hash / 0xffffffff;
  return Math.round(min + ratio * (max - min));
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function isoDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function isoDaysAhead(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function stageFromDay(day: number): CompanyStage {
  if (day < 7) {
    return "idea";
  }

  if (day < 21) {
    return "building";
  }

  if (day < 45) {
    return "launching";
  }

  return "scaling";
}

export function priorityWeight(priority: TaskPriority) {
  return {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  }[priority];
}

export function recomputeConversionRate(metrics: CompanyMetrics) {
  if (metrics.visitors === 0) {
    return 0;
  }

  return Number(((metrics.customers / metrics.visitors) * 100).toFixed(2));
}

export function roleLabel(role: AgentRole) {
  return role;
}
