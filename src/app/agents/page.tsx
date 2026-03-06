import { AgentsScreen } from "@/components/app/agents-screen";

export const dynamic = "force-dynamic";

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;

  return <AgentsScreen companySlug={company} />;
}
