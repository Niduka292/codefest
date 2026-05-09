"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Team } from "@/lib/types";

type AddPointsModalProps = {
  teams: Team[];
  onClose: () => void;
  onSuccess: () => void;
};

export function AddPointsModal({ teams, onClose, onSuccess }: AddPointsModalProps) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [points, setPoints] = useState("100");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const pointsValue = Number(points);
    const selectedTeam = teams.find((team) => team.id === teamId);

    if (!selectedTeam || !Number.isFinite(pointsValue) || pointsValue <= 0 || !reason.trim()) {
      setError("Select a team, positive points, and a solve description.");
      setLoading(false);
      return;
    }

    const { error: eventError } = await supabase.from("score_events").insert({
      team_id: teamId,
      points: pointsValue,
      reason: reason.trim().toUpperCase(),
    });

    if (eventError) {
      setError(eventError.message);
      setLoading(false);
      return;
    }

    const { error: scoreError } = await supabase
      .from("teams")
      .update({
        score: (selectedTeam.score ?? 0) + pointsValue,
      })
      .eq("id", teamId);

    if (scoreError) {
      setError(scoreError.message);
      setLoading(false);
      return;
    }

    const { error: solveError } = await supabase
      .from("teams")
      .update({
        latest_solve: reason.trim().toUpperCase(),
        latest_points: pointsValue,
      })
      .eq("id", teamId);

    if (solveError) {
      setError(solveError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-[#1f1f2e] bg-[#111118] p-6 shadow-[0_0_60px_rgba(139,92,246,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-wide text-white">Add Points</h2>
            <p className="mt-1 text-sm text-zinc-500">Record a solve and update the live score.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-zinc-300 transition-all duration-300 hover:border-cyan-300/60 hover:text-cyan-300"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Team</span>
            <select value={teamId} onChange={(event) => setTeamId(event.target.value)} className="codefest-field">
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Points to add</span>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(event) => setPoints(event.target.value)}
              className="codefest-field font-mono"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Reason / solve description
            </span>
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="HARD_LOGIC.PY"
              className="codefest-field font-mono"
            />
          </label>

          {error ? <p className="border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || teams.length === 0}
            className="codefest-button w-full bg-purple-600 px-5 py-4 text-sm text-white hover:bg-purple-500"
          >
            {loading ? "Adding Points..." : "Add Points"}
          </button>
        </form>
      </div>
    </div>
  );
}
