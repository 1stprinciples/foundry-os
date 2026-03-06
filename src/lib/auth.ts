import { cookies } from "next/headers";

import { readState, updateState } from "@/lib/store";
import type { SessionRecord } from "@/lib/types";
import { createId, createToken, isoDaysAhead } from "@/lib/utils";

export const SESSION_COOKIE = "foundry_session";

export async function requestMagicLink(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const token = createToken();
  const expiresAt = isoDaysAhead(1);

  const record = await updateState((state) => {
    const magicLink = {
      id: createId("magic"),
      email: normalizedEmail,
      token,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    state.magicLinks.unshift(magicLink);
    state.magicLinks = state.magicLinks.slice(0, 30);
    return magicLink;
  });

  return {
    ...record,
    magicLink: `/login?token=${token}`,
  };
}

export async function createSessionForEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return updateState((state) => {
    const session: SessionRecord = {
      id: createId("session"),
      email: normalizedEmail,
      companySlug: state.user.defaultCompanySlug,
      createdAt: new Date().toISOString(),
      expiresAt: isoDaysAhead(14),
    };

    state.sessions = [
      session,
      ...state.sessions.filter((existing) => existing.email !== normalizedEmail),
    ].slice(0, 20);

    return session;
  });
}

export async function consumeMagicLink(token: string) {
  return updateState((state) => {
    const record = state.magicLinks.find((link) => link.token === token);

    if (!record || record.usedAt || new Date(record.expiresAt) < new Date()) {
      return null;
    }

    record.usedAt = new Date().toISOString();

    const session: SessionRecord = {
      id: createId("session"),
      email: record.email,
      companySlug: state.user.defaultCompanySlug,
      createdAt: new Date().toISOString(),
      expiresAt: isoDaysAhead(14),
    };

    state.sessions = [session, ...state.sessions].slice(0, 20);
    return session;
  });
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const state = await readState();
  const session = state.sessions.find((item) => item.id === sessionId);

  if (!session || new Date(session.expiresAt) < new Date()) {
    return null;
  }

  return session;
}

export async function clearSession(sessionId: string) {
  await updateState((state) => {
    state.sessions = state.sessions.filter((session) => session.id !== sessionId);
  });
}
