"use client";

import Link from "next/link";
import { Menu, SatelliteDish, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/#events", label: "Events" },
  { href: "/#teams", label: "Teams" },
  { href: "/admin/login", label: "Admin" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="glass-panel mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
        <Link
          href="/"
          className="group relative z-10 inline-flex items-center gap-3 transition-all duration-300 hover:drop-shadow-[0_0_18px_rgba(0,229,255,0.42)]"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-signal">
            <SatelliteDish size={19} />
          </span>
          <span>
            <span className="font-display block bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
              CODEFEST
            </span>
            <span className="font-terminal block text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-200/70">
              Voyager uplink
            </span>
          </span>
        </Link>

        <div className="relative z-10 hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-terminal px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 transition-all duration-300 hover:bg-cyan-300/10 hover:text-cyan-200 hover:shadow-signal"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="relative z-10 hidden items-center md:flex">
          <Link
            href="/register"
            className="codefest-button signal-button px-5 py-3 text-xs"
          >
            Register Now
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 transition-all duration-300 hover:border-cyan-300/70 hover:text-white md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="glass-panel mx-auto mt-2 max-w-7xl px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-terminal border border-transparent px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 transition-all duration-300 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="codefest-button signal-button mt-2 px-5 py-3 text-xs"
            >
              Register Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
