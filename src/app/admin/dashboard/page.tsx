import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { getAdminSession, getAllTeams, getRecentScoreEvents } from "@/lib/data";

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  if (!admin.session) {
    redirect("/admin/login");
  }

  if (!admin.isAdmin) {
    redirect("/");
  }

  const [teams, scoreEvents] = await Promise.all([getAllTeams(), getRecentScoreEvents()]);

  return <AdminDashboardClient teams={teams} scoreEvents={scoreEvents} />;
}
