"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AddPointsModal } from "@/components/AddPointsModal";
import { AdminSidebar } from "@/components/AdminSidebar";
import { CountdownTimer } from "@/components/CountdownTimer";
import { supabase } from "@/lib/supabase";
import type { Team } from "@/lib/types";

type LeaderboardClientProps = {
  initialTeams: Team[];
  isAdmin: boolean;
  targetDate: Date;
};

function rankColor(index: number) {
  if (index === 0) return "text-amber-300 border-amber-300 shadow-[0_0_28px_rgba(245,158,11,0.12)]";
  if (index === 1) return "text-cyan-300 border-cyan-300";
  if (index === 2) return "text-purple-300 border-purple-300";
  return "text-zinc-400 border-[#1f1f2e]";
}

function memberInitials(team: Team) {
  const members = Array.isArray(team.members) ? team.members : [];
  if (members.length > 0) {
    return members.slice(0, 4).map((member) =>
      member
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    );
  }

  return team.name
    .split(/\s+/)
    .slice(0, 4)
    .map((part) => part.slice(0, 2).toUpperCase());
}

export function LeaderboardClient({ initialTeams, isAdmin, targetDate }: LeaderboardClientProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [modalOpen, setModalOpen] = useState(false);
  const [highlightedScores, setHighlightedScores] = useState<Record<string, boolean>>({});
  const previousScores = useRef<Record<string, number>>(
    Object.fromEntries(initialTeams.map((team) => [team.id, team.score ?? 0])),
  );

  const orderedTeams = useMemo(
    () => [...teams].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [teams],
  );

  useEffect(() => {
    const channel = supabase
      .channel("teams-live-rankings")
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, (payload) => {
        const nextTeam = payload.new as Team;

        setTeams((current) => {
          if (payload.eventType === "DELETE") {
            return current.filter((team) => team.id !== (payload.old as Team).id);
          }

          const exists = current.some((team) => team.id === nextTeam.id);
          return exists ? current.map((team) => (team.id === nextTeam.id ? nextTeam : team)) : [...current, nextTeam];
        });

        const previousScore = previousScores.current[nextTeam.id];
        if (previousScore !== undefined && previousScore !== nextTeam.score) {
          setHighlightedScores((current) => ({ ...current, [nextTeam.id]: true }));
          window.setTimeout(() => {
            setHighlightedScores((current) => ({ ...current, [nextTeam.id]: false }));
          }, 900);
        }
        previousScores.current[nextTeam.id] = nextTeam.score ?? 0;
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function refreshTeams() {
    const { data } = await supabase.from("teams").select("*").order("score", { ascending: false });
    if (data) {
      setTeams(data as Team[]);
    }
    setModalOpen(false);
  }

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[18rem_1fr]">
      <AdminSidebar showAddPoints={isAdmin} onAddPoints={() => setModalOpen(true)} />

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-7xl">
              Live Rankings
            </h1>
            <div className="mt-4 inline-flex flex-wrap items-center gap-3 border border-red-500/30 bg-red-500/10 px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping bg-red-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 bg-red-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-red-200">Live Broadcast</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <CountdownTimer targetDate={targetDate} compact />
            <div className="border border-[#1f1f2e] bg-[#111118] p-5 text-right">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Total Problems</p>
              <p className="font-display mt-2 text-3xl font-black text-cyan-300">12/24 Solved</p>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[110px_1.5fr_1fr_170px] border-b border-[#1f1f2e] px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-500">
              <span>Rank</span>
              <span>Team Name</span>
              <span>Members</span>
              <span className="text-right">Total Score</span>
            </div>

            <div className="mt-3 space-y-3">
              {orderedTeams.length > 0 ? (
                orderedTeams.map((team, index) => {
                  const colors = rankColor(index);
                  const latest = team.latest_solve
                    ? `LATEST: ${team.latest_solve}${team.latest_points ? ` [+${team.latest_points}]` : ""}`
                    : "LATEST: AWAITING SOLVE";

                  return (
                    <div
                      key={team.id}
                      className={`grid grid-cols-[110px_1.5fr_1fr_170px] items-center border-l-4 bg-[#111118]/95 px-5 py-5 transition-all duration-300 hover:bg-[#161622] ${
                        index === 0 ? `border border-amber-300/70 ${colors}` : colors
                      }`}
                    >
                      <div className={`font-display text-4xl font-black ${colors.split(" ")[0]}`}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="font-display text-xl font-bold text-white">{team.name}</p>
                        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-zinc-500">{latest}</p>
                      </div>
                      <div className="flex -space-x-2">
                        {memberInitials(team).map((initial, avatarIndex) => (
                          <div
                            key={`${team.id}-${initial}-${avatarIndex}`}
                            className="flex h-10 w-10 items-center justify-center border border-[#0a0a0f] bg-[#1a1a2e] font-mono text-xs font-black text-zinc-200"
                          >
                            {initial}
                          </div>
                        ))}
                      </div>
                      <div
                        className={`font-display text-right text-3xl font-black text-white transition-all duration-300 ${
                          highlightedScores[team.id] ? "score-pulse text-cyan-300" : ""
                        }`}
                      >
                        {team.score ?? 0}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border border-[#1f1f2e] bg-[#111118] p-8 text-center text-zinc-400">
                  No teams returned from Supabase yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <a
          href="#teams"
          className="codefest-button mt-8 inline-flex text-xs text-cyan-300 hover:text-cyan-100"
        >
          Broadcast details <ArrowUpRight size={14} />
        </a>
      </section>

      {modalOpen ? <AddPointsModal teams={orderedTeams} onClose={() => setModalOpen(false)} onSuccess={refreshTeams} /> : null}
    </div>
  );
}
