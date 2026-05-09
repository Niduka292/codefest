"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/72 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-2xl font-black tracking-tight text-transparent transition-all duration-300 hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]"
        >
          CODEFEST
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-widest text-zinc-300 transition-all duration-300 hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center md:flex">
          <Link
            href="/register"
            className="codefest-button bg-purple-600 px-5 py-3 text-xs text-white shadow-[0_0_28px_rgba(139,92,246,0.24)] hover:bg-purple-500"
          >
            Register Now
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-cyan-300/60 hover:text-cyan-300 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#0a0a0f]/95 px-4 pb-5 pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-all duration-300 hover:text-cyan-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="codefest-button mt-2 bg-purple-600 px-5 py-3 text-xs text-white hover:bg-purple-500"
            >
              Register Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
