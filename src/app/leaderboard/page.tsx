import { LeaderboardClient } from "@/components/LeaderboardClient";
import { getAdminSession, getAllTeams } from "@/lib/data";

export default async function LeaderboardPage() {
  const [teams, admin] = await Promise.all([getAllTeams(), getAdminSession()]);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);

  return <LeaderboardClient initialTeams={teams} isAdmin={admin.isAdmin} targetDate={targetDate} />;
}
