"use client";

import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard#teams", label: "Teams Data", icon: Users },
];

type AdminSidebarProps = {
  active?: string;
};

export function AdminSidebar({ active = "Dashboard" }: AdminSidebarProps) {
  return (
    <aside className="glass-panel flex h-full min-h-[calc(100vh-73px)] w-full flex-col border-r border-cyan-300/15 p-5 lg:w-72">
      <div>
        <p className="terminal-label relative z-10">Event Control</p>
        <h2 className="font-display relative z-10 mt-2 text-2xl font-bold text-white">University Finals</h2>
      </div>

      <div className="relative z-10 mt-8 flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.label;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`font-terminal flex items-center gap-3 border px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                selected
                  ? "border-purple-300/60 bg-purple-500/20 text-white shadow-violet"
                  : "border-transparent text-slate-400 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-200"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
