"use client";

import Link from "next/link";
import { BarChart3, Bug, Monitor, Settings, Users } from "lucide-react";

const items = [
  { href: "/leaderboard", label: "Live Rank", icon: BarChart3 },
  { href: "/leaderboard#bug-hunt", label: "Bug Hunt", icon: Bug },
  { href: "/leaderboard#speed-code", label: "Speed Code", icon: Monitor },
  { href: "/leaderboard#teams", label: "Teams", icon: Users },
];

type AdminSidebarProps = {
  active?: string;
  showAddPoints?: boolean;
  onAddPoints?: () => void;
};

export function AdminSidebar({ active = "Live Rank", showAddPoints, onAddPoints }: AdminSidebarProps) {
  return (
    <aside className="flex h-full min-h-[calc(100vh-73px)] w-full flex-col border-r border-[#1f1f2e] bg-[#0d0d14]/90 p-5 backdrop-blur lg:w-72">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-400">Event Control</p>
        <h2 className="font-display mt-2 text-2xl font-bold text-white">University Finals</h2>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.label;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                selected
                  ? "bg-purple-600 text-white shadow-[0_0_26px_rgba(139,92,246,0.22)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-cyan-300"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto space-y-3 pt-8">
        {showAddPoints ? (
          <button
            type="button"
            onClick={onAddPoints}
            className="codefest-button w-full bg-purple-600 px-5 py-3 text-xs text-white hover:bg-purple-500"
          >
            Add Points
          </button>
        ) : null}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-500 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
