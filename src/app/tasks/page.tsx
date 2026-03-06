import { TasksScreen } from "@/components/app/tasks-screen";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;

  return <TasksScreen companySlug={company} />;
}
