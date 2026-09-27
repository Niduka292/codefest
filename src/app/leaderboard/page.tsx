import { LeaderboardClient } from "@/components/LeaderboardClient";
import { fetchLiveLeaderboard } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeaderboardPage() {
  const { teams } = await fetchLiveLeaderboard();
  return <LeaderboardClient initialTeams={teams} />;
}
