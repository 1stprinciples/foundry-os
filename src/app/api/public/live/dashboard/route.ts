import { ok } from "@/lib/http";
import { buildPublicDashboard } from "@/lib/public";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  return ok(buildPublicDashboard(state));
}
