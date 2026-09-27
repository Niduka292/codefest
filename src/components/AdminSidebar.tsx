"use client";

import { Trophy, Users } from "lucide-react";

type AdminSidebarProps = {
  activeTab: "teams" | "leaderboard";
  onTabChange: (tab: "teams" | "leaderboard") => void;
};

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const items = [
    { id: "teams", label: "Teams Data", icon: Users },
    { id: "leaderboard", label: "Leaderboard Tab", icon: Trophy },
  ] as const;

  return (
    <aside className="glass-panel flex h-full min-h-[calc(100vh-73px)] w-full flex-col border-r border-cyan-300/15 p-5 lg:w-72">
      <div>
        <p className="terminal-label relative z-10">Event Control</p>
        <h2 className="font-display relative z-10 mt-2 text-2xl font-bold text-white">Command Center</h2>
      </div>

      <div className="relative z-10 mt-8 flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`font-terminal flex items-center gap-3 border px-4 py-3 text-left text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                selected
                  ? "border-purple-300/60 bg-purple-500/20 text-white shadow-violet"
                  : "border-transparent text-slate-400 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-200"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
