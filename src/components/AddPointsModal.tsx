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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
      <div className="glass-panel scanline w-full max-w-lg p-6">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="terminal-label">Mission scoring console</p>
            <h2 className="mission-title mt-1 text-2xl text-white">Add Points</h2>
            <p className="mt-1 text-sm text-slate-400">Record a solve and update the live score.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center border border-cyan-300/20 text-slate-300 transition-all duration-300 hover:border-cyan-300/60 hover:text-cyan-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
          <label className="block">
            <span className="terminal-label mb-2 block">Team</span>
            <select value={teamId} onChange={(event) => setTeamId(event.target.value)} className="codefest-field">
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="terminal-label mb-2 block">Points to add</span>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(event) => setPoints(event.target.value)}
              className="codefest-field font-mono"
            />
          </label>

          <label className="block">
            <span className="terminal-label mb-2 block">
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

          {error ? <p className="border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || teams.length === 0}
            className="codefest-button signal-button w-full px-5 py-4 text-sm"
          >
            {loading ? "Adding Points..." : "Add Points"}
          </button>
        </form>
      </div>
    </div>
  );
}
