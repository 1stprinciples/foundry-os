import { DocumentsScreen } from "@/components/app/documents-screen";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;

  return <DocumentsScreen companySlug={company} />;
}
