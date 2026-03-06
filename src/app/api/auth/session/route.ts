import { cookies } from "next/headers";

import {
  clearSession,
  consumeMagicLink,
  createSessionForEmail,
  getSessionFromCookies,
  SESSION_COOKIE,
} from "@/lib/auth";
import { ok, badRequest, readJson } from "@/lib/http";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [session, state] = await Promise.all([getSessionFromCookies(), readState()]);

  if (!session) {
    return ok({
      ok: true,
      brand: "Foundry OS",
      session: null,
      user: state.user,
    });
  }

  return ok({
    ok: true,
    brand: "Foundry OS",
    session,
    user: state.user,
  });
}

export async function POST(request: Request) {
  const body = await readJson<{ email?: string; token?: string }>(request);

  if (!body?.email && !body?.token) {
    return badRequest("Provide either an email or a magic-link token.");
  }

  const session =
    body.token?.trim()
      ? await consumeMagicLink(body.token.trim())
      : await createSessionForEmail(body!.email!.trim());

  if (!session) {
    return badRequest("That Foundry login token is invalid or expired.");
  }

  const response = ok({
    ok: true,
    brand: "Foundry OS",
    session,
  });

  response.cookies.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(session.expiresAt),
  });

  return response;
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await clearSession(sessionId);
  }

  const response = ok({
    ok: true,
    brand: "Foundry OS",
    session: null,
  });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
