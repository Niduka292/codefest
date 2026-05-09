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
            <p className="text-xs font-black uppercase tracking-widest text-amber-400">Command Center</p>
            <h1 className="font-display mt-2 text-5xl font-black uppercase text-white">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="codefest-button bg-purple-600 px-6 py-4 text-xs text-white hover:bg-purple-500"
          >
            Add Points
          </button>
        </div>

        <div className="mt-8 overflow-x-auto border border-[#1f1f2e] bg-[#111118]/90">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-[#1f1f2e] text-xs font-black uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-5 py-4">Team</th>
                <th className="px-5 py-4">Latest Solve</th>
                <th className="px-5 py-4 text-right">Current Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f2e]">
              {teams.map((team) => (
                <tr key={team.id} className="transition-all duration-300 hover:bg-white/[0.03]">
                  <td className="px-5 py-4 font-display text-lg font-bold text-white">{team.name}</td>
                  <td className="px-5 py-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
                    {team.latest_solve ?? "NO SOLVE RECORDED"}
                  </td>
                  <td className="px-5 py-4 text-right font-display text-2xl font-black text-cyan-300">
                    {team.score ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {teams.length === 0 ? <p className="p-6 text-center text-zinc-400">No teams returned from Supabase.</p> : null}
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-black uppercase text-white">Recent Score Events</h2>
          <div className="mt-4 space-y-3">
            {scoreEvents.length > 0 ? (
              scoreEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid gap-3 border border-[#1f1f2e] bg-[#111118]/90 p-4 transition-all duration-300 hover:border-purple-400/50 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <p className="font-display font-bold text-white">
                      {Array.isArray(event.teams) ? event.teams[0]?.name ?? event.team_id : event.teams?.name ?? event.team_id}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-zinc-500">{event.reason}</p>
                  </div>
                  <p className="font-display text-xl font-black text-cyan-300">+{event.points}</p>
                  <time className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                    {new Date(event.created_at).toLocaleString()}
                  </time>
                </div>
              ))
            ) : (
              <p className="border border-[#1f1f2e] bg-[#111118]/90 p-5 text-zinc-400">
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
