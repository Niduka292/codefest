import { getSupabaseServer } from "@/lib/supabaseServer";
import type { ScoreEvent, Team } from "@/lib/types";

export async function getTopTeams(limit = 2) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as Team[];
}

export async function getAllTeams() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Team[];
}

export async function getParticipantCount() {
  const supabase = await getSupabaseServer();
  const { count, error } = await supabase
    .from("participants")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getRecentScoreEvents(limit = 8) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("score_events")
    .select("id, team_id, points, reason, created_at, teams(name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as ScoreEvent[];
}

export async function getAdminSession() {
  const supabase = await getSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { session: null, isAdmin: false };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return { session, isAdmin: data?.role === "admin" };
}
