import { SettingsScreen } from "@/components/app/settings-screen";

export const dynamic = "force-dynamic";

export default async function CompanySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;

  return <SettingsScreen companySlug={company} />;
}
