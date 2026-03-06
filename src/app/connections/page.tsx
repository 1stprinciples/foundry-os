import { ConnectionsScreen } from "@/components/app/connections-screen";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;

  return <ConnectionsScreen companySlug={company} />;
}
