import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { getAdminSession } from "@/lib/data";
import { getSavedRegistrations } from "@/lib/registrations";

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  if (!admin.session) {
    redirect("/admin/login");
  }

  if (!admin.isAdmin) {
    redirect("/");
  }

  const registrations = getSavedRegistrations();

  return <AdminDashboardClient initialRegistrations={registrations} />;
}
