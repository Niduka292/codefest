import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { getAdminSession } from "@/lib/data";
import { getSavedRegistrations } from "@/lib/registrations";
import { fetchLiveLeaderboard } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  if (!admin.session) {
    redirect("/admin/login");
  }

  if (!admin.isAdmin) {
    redirect("/");
  }

  const registrations = getSavedRegistrations();
  const { teams } = await fetchLiveLeaderboard();

  return (
    <AdminDashboardClient
      initialRegistrations={registrations}
      initialLeaderboard={teams}
    />
  );
}
