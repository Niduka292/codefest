"use client";

import { useState } from "react";
import { AddPointsModal } from "@/components/AddPointsModal";
import { AdminSidebar } from "@/components/AdminSidebar";
import type { ScoreEvent, Team } from "@/lib/types";

type AdminDashboardClientProps = {
  teams: Team[];
  scoreEvents: ScoreEvent[];
};

export function AdminDashboardClient({ teams, scoreEvents }: AdminDashboardClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  function handleSuccess() {
    setModalOpen(false);
    window.location.reload();
  }

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[18rem_1fr]">
      <AdminSidebar active="Teams" showAddPoints onAddPoints={() => setModalOpen(true)} />

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Command Center</p>
            <h1 className="mission-title mt-3 text-5xl text-white">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="codefest-button signal-button px-6 py-4 text-xs"
          >
            Add Points
          </button>
        </div>

        <div className="glass-panel mt-8 overflow-x-auto">
          <table className="relative z-10 w-full min-w-[700px] text-left">
            <thead className="font-terminal border-b border-cyan-300/15 text-xs font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-5 py-4">Team</th>
                <th className="px-5 py-4">Latest Solve</th>
                <th className="px-5 py-4 text-right">Current Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-300/10">
              {teams.map((team) => (
                <tr key={team.id} className="transition-all duration-300 hover:bg-cyan-300/[0.04]">
                  <td className="px-5 py-4 font-display text-lg font-bold text-white">{team.name}</td>
                  <td className="px-5 py-4 font-mono text-xs uppercase tracking-widest text-slate-500">
                    {team.latest_solve ?? "NO SOLVE RECORDED"}
                  </td>
                  <td className="px-5 py-4 text-right font-display text-2xl font-black text-cyan-200">
                    {team.score ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {teams.length === 0 ? <p className="relative z-10 p-6 text-center text-slate-400">No teams returned from Supabase.</p> : null}
        </div>

        <section className="mt-10">
          <h2 className="mission-title text-2xl text-white">Recent Score Events</h2>
          <div className="mt-4 space-y-3">
            {scoreEvents.length > 0 ? (
              scoreEvents.map((event) => (
                <div
                  key={event.id}
                  className="hud-frame grid gap-3 p-4 transition-all duration-300 hover:border-purple-300/50 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <p className="font-display font-bold text-white">
                      {Array.isArray(event.teams) ? event.teams[0]?.name ?? event.team_id : event.teams?.name ?? event.team_id}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500">{event.reason}</p>
                  </div>
                  <p className="font-display text-xl font-black text-cyan-200">+{event.points}</p>
                  <time className="font-terminal text-xs font-bold uppercase tracking-widest text-slate-600">
                    {new Date(event.created_at).toLocaleString()}
                  </time>
                </div>
              ))
            ) : (
              <p className="glass-panel p-5 text-slate-400">
                No score events returned from Supabase.
              </p>
            )}
          </div>
        </section>
      </section>

      {modalOpen ? <AddPointsModal teams={teams} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} /> : null}
    </div>
  );
}
