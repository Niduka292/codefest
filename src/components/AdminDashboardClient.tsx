"use client";

import { useState } from "react";
import { FileSpreadsheet, Users } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import type { RegistrationRecord } from "@/lib/registrations";

type AdminDashboardClientProps = {
  initialRegistrations?: RegistrationRecord[];
};

export function AdminDashboardClient({ initialRegistrations = [] }: AdminDashboardClientProps) {
  const [registrations] = useState<RegistrationRecord[]>(initialRegistrations);

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[18rem_1fr]">
      <AdminSidebar active="Dashboard" />

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Command Center</p>
            <h1 className="mission-title mt-3 text-5xl text-white">Registered Teams</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-terminal rounded border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-300">
              {registrations.length} Teams Registered
            </span>
          </div>
        </div>

        {/* Registered Teams Table */}
        <div className="glass-panel mt-6 overflow-x-auto">
          <table className="relative z-10 w-full min-w-[800px] text-left">
            <thead className="font-terminal border-b border-cyan-300/15 text-xs font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-5 py-4">Submitted</th>
                <th className="px-5 py-4">Team Name</th>
                <th className="px-5 py-4">Leader Name</th>
                <th className="px-5 py-4">Leader Contact</th>
                <th className="px-5 py-4">Languages</th>
                <th className="px-5 py-4">Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-300/10">
              {registrations.length > 0 ? (
                registrations.map((reg) => (
                  <tr key={reg.id} className="transition-all duration-300 hover:bg-cyan-300/[0.04]">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      {new Date(reg.submitted_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-display text-base font-bold text-white">
                      {reg.team_name}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-200">
                      {reg.full_name}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">
                      <div>{reg.email}</div>
                      <div className="font-mono text-cyan-300 mt-1">ID: {reg.student_id}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-purple-300">
                      {Array.isArray(reg.programming_languages) ? reg.programming_languages.join(", ") : reg.programming_languages}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">
                      {reg.team_members && reg.team_members.length > 0 ? (
                        <ul className="space-y-1">
                          {reg.team_members.map((m, idx) => (
                            <li key={idx} className="font-mono">
                              • {m.full_name} <span className="text-slate-500">({m.student_id})</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">Solo / Leader Only</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Users className="mx-auto mb-3 opacity-40 text-cyan-300" size={38} />
                    <p className="font-display text-lg text-white">No Team Signups Recorded Yet</p>
                    <p className="mt-1 text-xs text-slate-400">
                      When users register on the website, their details will display here automatically.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Google Sheets Status Banner */}
        <div className="glass-panel mt-8 p-6 border-emerald-400/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
                <FileSpreadsheet size={26} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Google Spreadsheet Sync</h3>
                <p className="mt-1 text-sm text-slate-300">
                  All signups are saved locally in <code className="text-cyan-300">registrations.json</code> and forwarded to your Google Sheet URL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
