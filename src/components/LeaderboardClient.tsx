"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Medal, Rocket, TrendingUp, Trophy, Users, Zap } from "lucide-react";
import { AddPointsModal } from "@/components/AddPointsModal";
import { supabase } from "@/lib/supabase";
import type { Team } from "@/lib/types";

type LeaderboardClientProps = {
  initialTeams: Team[];
  isAdmin: boolean;
  targetDate: Date;
};

function rankColor(index: number) {
  if (index === 0) return "text-amber-200 border-amber-300/70 shadow-amber";
  if (index === 1) return "text-cyan-200 border-cyan-300/60";
  if (index === 2) return "text-purple-200 border-purple-300/60";
  return "text-slate-400 border-cyan-300/15";
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

export function LeaderboardClient({ initialTeams, isAdmin }: LeaderboardClientProps) {
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
  const maxScore = Math.max(1, ...orderedTeams.map((team) => team.score ?? 0));
  const topThree = orderedTeams.slice(0, 3);
  const podiumTeams = [topThree[1], topThree[0], topThree[2]].filter((team): team is Team => Boolean(team));
  const topScore = orderedTeams[0]?.score ?? 0;

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
    <div className="min-h-[calc(100vh-88px)] px-4 py-8 sm:px-6 lg:px-9">
      <section className="mx-auto max-w-[1404px]">
        <div className="text-center">
          <h1 className="page-gradient-title text-5xl sm:text-7xl lg:text-8xl">Mission Rankings</h1>
          <p className="font-terminal mt-6 text-xl font-bold uppercase tracking-widest text-slate-400">
            Live team standings // updated every 60 seconds
          </p>
          {isAdmin ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="codefest-button signal-button mt-6 px-6 py-3 text-xs"
            >
              Add Points
            </button>
          ) : null}
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          <div className="glass-panel flex items-center gap-5 p-7">
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 text-cyan-300">
              <Users size={27} />
            </div>
            <div className="relative z-10">
              <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Active Teams</p>
              <p className="font-display text-3xl font-black text-cyan-300">{orderedTeams.length}</p>
            </div>
          </div>
          <div className="glass-panel flex items-center gap-5 p-7">
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-lg border border-emerald-300/35 bg-emerald-300/10 text-emerald-400">
              <TrendingUp size={27} />
            </div>
            <div className="relative z-10">
              <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Total Submissions</p>
              <p className="font-display text-3xl font-black text-emerald-400">1,845</p>
            </div>
          </div>
          <div className="glass-panel flex items-center gap-5 p-7">
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10 text-amber-300">
              <Trophy size={27} />
            </div>
            <div className="relative z-10">
              <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Top Score</p>
              <p className="font-display text-3xl font-black text-amber-300">{topScore.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {podiumTeams.length > 0 ? (
          <div className="mt-14 grid items-end gap-7 lg:grid-cols-3">
            {podiumTeams.map((team, visualIndex) => {
              const actualRank = orderedTeams.findIndex((item) => item.id === team.id) + 1;
              const isWinner = actualRank === 1;
              const palette =
                actualRank === 1
                  ? "border-amber-300/75 bg-amber-950/22 text-amber-300 min-h-[408px]"
                  : actualRank === 2
                    ? "border-slate-400/45 bg-slate-300/10 text-slate-300 min-h-[342px]"
                    : "border-orange-400/55 bg-orange-950/24 text-orange-400 min-h-[342px]";
              const Mascot = actualRank === 1 ? Rocket : actualRank === 2 ? Brain : Zap;

              return (
                <article
                  key={team.id}
                  className={`leader-podium-card flex flex-col items-center justify-center border p-8 text-center ${palette} ${
                    visualIndex === 1 ? "lg:-mt-9" : ""
                  }`}
                >
                  <Mascot size={64} strokeWidth={1.8} />
                  {actualRank === 1 ? <Trophy className="mt-4" size={42} /> : <Medal className="mt-4" size={38} />}
                  <p className="font-terminal mt-4 text-sm font-bold uppercase tracking-widest">Rank #{actualRank}</p>
                  <h2 className="font-display mt-3 max-w-[260px] text-2xl font-black text-white">{team.name}</h2>
                  <p className="font-terminal mt-3 text-sm text-purple-400">Codefest</p>
                  <p className={`font-display mt-6 font-black ${isWinner ? "text-5xl text-amber-300" : "text-4xl text-slate-300"}`}>
                    {(team.score ?? 0).toLocaleString()}
                  </p>
                  <p className="font-terminal mt-1 text-xs uppercase">XP</p>
                </article>
              );
            })}
          </div>
        ) : null}

        <div className="mt-14 overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="font-terminal grid grid-cols-[110px_1.35fr_1fr_190px] border-b border-cyan-300/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500">
              <span>Rank</span>
              <span>Team Name</span>
              <span>Members</span>
              <span className="text-right">Signal Strength</span>
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
                      className={`glass-panel grid grid-cols-[110px_1.35fr_1fr_190px] items-center border-l-4 px-5 py-5 transition-all duration-300 hover:border-cyan-300/45 hover:shadow-signal ${
                        index === 0 ? `scanline ${colors}` : colors
                      }`}
                    >
                      <div className={`relative z-10 font-display text-4xl font-black ${colors.split(" ")[0]}`}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="relative z-10">
                        <p className="font-display text-xl font-bold text-white">{team.name}</p>
                        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500">{latest}</p>
                      </div>
                      <div className="relative z-10 flex -space-x-2">
                        {memberInitials(team).map((initial, avatarIndex) => (
                          <div
                            key={`${team.id}-${initial}-${avatarIndex}`}
                            className="flex h-10 w-10 items-center justify-center border border-cyan-300/20 bg-cyan-300/10 font-mono text-xs font-black text-cyan-50 shadow-signal"
                          >
                            {initial}
                          </div>
                        ))}
                      </div>
                      <div className="relative z-10">
                        <div
                          className={`font-display text-right text-3xl font-black text-white transition-all duration-300 ${
                            highlightedScores[team.id] ? "score-pulse text-cyan-200" : ""
                          }`}
                        >
                          {team.score ?? 0}
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden bg-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-signal"
                            style={{ width: `${Math.max(5, Math.round(((team.score ?? 0) / maxScore) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass-panel p-8 text-center text-slate-400">
                  No teams returned from Supabase yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {modalOpen ? <AddPointsModal teams={orderedTeams} onClose={() => setModalOpen(false)} onSuccess={refreshTeams} /> : null}
    </div>
  );
}
