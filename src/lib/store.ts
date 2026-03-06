import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createSeedState } from "@/lib/seed";
import type { AppState, CompanyRecord } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const stateFile = path.join(dataDir, "runtime-store.json");

let writeLock = Promise.resolve();

async function ensureStoreFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(stateFile, "utf8");
  } catch {
    await writeFile(stateFile, JSON.stringify(createSeedState(), null, 2), "utf8");
  }
}

async function readStateFile() {
  await ensureStoreFile();
  const file = await readFile(stateFile, "utf8");
  return JSON.parse(file) as AppState;
}

async function writeStateFile(state: AppState) {
  await writeFile(stateFile, JSON.stringify(state, null, 2), "utf8");
}

export async function readState() {
  return readStateFile();
}

export async function updateState<T>(
  mutator: (state: AppState) => Promise<T> | T,
): Promise<T> {
  const previousLock = writeLock;
  let releaseLock: (() => void) | undefined;
  writeLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  await previousLock;

  try {
    const state = await readStateFile();
    const result = await mutator(state);
    await writeStateFile(state);
    return result;
  } finally {
    releaseLock?.();
  }
}

export async function findCompanyBySlug(slug: string) {
  const state = await readStateFile();
  return state.companies.find((company) => company.slug === slug) ?? null;
}

export async function getDefaultCompany() {
  const state = await readStateFile();
  return (
    state.companies.find((company) => company.slug === state.user.defaultCompanySlug) ??
    state.companies[0] ??
    null
  );
}

export function sortCompanyTasks(company: CompanyRecord) {
  company.tasks.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  company.documents.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  company.logs.sort((left, right) => right.timestamp.localeCompare(left.timestamp));
}
