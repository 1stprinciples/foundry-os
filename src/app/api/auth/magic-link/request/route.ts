import { requestMagicLink } from "@/lib/auth";
import { badRequest, ok, readJson } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson<{ email?: string }>(request);
  const email = body?.email?.trim();

  if (!email) {
    return badRequest("Email is required to generate a Foundry magic link.");
  }

  const magicLink = await requestMagicLink(email);
  return ok({
    ok: true,
    brand: "Foundry OS",
    message: "Magic link generated for local Foundry sign-in.",
    ...magicLink,
  });
}
