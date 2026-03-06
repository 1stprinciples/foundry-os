import { AnalyticsScreen } from "@/components/app/analytics-screen";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;

  return <AnalyticsScreen companySlug={company} />;
}
