import { CompanyDashboardScreen } from "@/components/app/company-dashboard-screen";

export const dynamic = "force-dynamic";

export default async function CompanyDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CompanyDashboardScreen companySlug={slug} />;
}
