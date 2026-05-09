import Link from "next/link";
import { ArrowRight, MessageCircle, Radio, Send, Share2, Trophy } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getTopTeams } from "@/lib/data";

const sponsors = ["NOVA CLOUD", "BYTEFORGE", "QUANTUM LABS", "STACKHUB"];

export default async function Home() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);
  const topTeams = await getTopTeams(2);

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-screen items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[8%] top-[18%] h-1 w-1 animate-ping bg-cyan-300" />
          <div className="absolute left-[24%] top-[70%] h-1 w-1 animate-pulse bg-purple-400" />
          <div className="absolute right-[20%] top-[28%] h-1 w-1 animate-ping bg-amber-300" />
          <div className="absolute right-[12%] top-[76%] h-1 w-1 animate-pulse bg-cyan-300" />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          <p className="text-xs font-black uppercase tracking-[0.55em] text-cyan-300">
            The ultimate university-wide CS showdown.
          </p>
          <h1 className="font-display mt-8 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-8xl font-black italic leading-none tracking-tight text-transparent drop-shadow-[0_0_42px_rgba(139,92,246,0.22)] md:text-[180px]">
            CODEFEST
          </h1>

          <div className="mt-10 flex w-full justify-center">
            <CountdownTimer targetDate={targetDate} />
          </div>

          <div className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="codefest-button bg-purple-600 px-8 py-4 text-sm text-white shadow-[0_0_34px_rgba(139,92,246,0.28)] hover:bg-purple-500"
            >
              Register Now
            </Link>
            <Link
              href="/#events"
              className="codefest-button border border-cyan-300/70 px-8 py-4 text-sm text-cyan-200 hover:bg-cyan-300/10 hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]"
            >
              View Rules
            </Link>
          </div>
        </div>
      </section>

      <section id="teams" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border border-[#1f1f2e] bg-[#111118]/90 p-8 transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_0_34px_rgba(139,92,246,0.12)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center border border-purple-400/40 bg-purple-500/10 text-purple-200">
                  <Trophy size={28} />
                </div>
                <h2 className="font-display text-3xl font-black uppercase text-white">$10,000 Prize Pool</h2>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400">
                Scholarships, hardware grants, and finalist awards for teams that survive the full challenge slate.
              </p>
            </article>

            <article className="border border-amber-400/50 bg-[#111118]/90 p-8 shadow-[0_0_34px_rgba(245,158,11,0.1)] transition-all duration-300 hover:border-amber-300">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="font-display text-4xl font-black uppercase text-amber-300">500+</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Coders Enrolled</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-black uppercase text-cyan-300">12</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Challenge Tracks</p>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-8 border border-[#1f1f2e] bg-[#111118]/88 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 bg-red-500" />
                </span>
                <h3 className="font-display text-lg font-black uppercase tracking-widest text-white">Live Status</h3>
              </div>
              <Link
                href="/leaderboard"
                className="codefest-button justify-start text-xs text-cyan-300 hover:text-cyan-100 sm:justify-center"
              >
                Open Leaderboard <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {topTeams.length > 0 ? (
                topTeams.map((team, index) => (
                  <div key={team.id} className="flex items-center justify-between border border-white/10 bg-black/20 p-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Rank {index + 1}</p>
                      <p className="font-display mt-1 text-xl font-bold text-white">{team.name}</p>
                    </div>
                    <p className="font-display text-2xl font-black text-cyan-300">{team.score}</p>
                  </div>
                ))
              ) : (
                <p className="border border-white/10 bg-black/20 p-4 text-sm text-zinc-400 md:col-span-2">
                  Live teams will appear here as soon as Supabase returns registered competitors.
                </p>
              )}
            </div>
          </div>

          <div id="events" className="mt-14 border-y border-[#1f1f2e] py-8">
            <p className="text-center text-xs font-black uppercase tracking-[0.35em] text-zinc-500">
              Powered by industry leaders
            </p>
            <div className="mt-6 grid gap-4 text-center text-sm font-bold uppercase tracking-widest text-zinc-600 sm:grid-cols-2 lg:grid-cols-4">
              {sponsors.map((sponsor) => (
                <span key={sponsor}>{sponsor}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-5xl font-black uppercase text-white sm:text-7xl">Ready To Execute?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400">
            Bring your team, pick your stack, and push through timed tracks built for algorithmic speed,
            debugging instincts, and production-grade problem solving.
          </p>
          <Link
            href="/register"
            className="codefest-button mx-auto mt-10 w-full max-w-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-5 text-sm text-white shadow-[0_0_40px_rgba(139,92,246,0.28)] hover:scale-[1.01]"
          >
            Join The Arena
          </Link>
          <p className="mt-5 text-xs font-black uppercase tracking-widest text-cyan-300">
            Registration closes in 48 hours
          </p>
        </div>
      </section>

      <footer className="border-t border-[#1f1f2e] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto]">
          <div>
            <p className="font-display bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-2xl font-black text-transparent">
              CODEFEST
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
              © 2024 University Codefest | CS Department
            </p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Resources</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-500">
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-300">
                API Docs
              </Link>
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-300">
                Rules
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Support</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-500">
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-300">
                Help Center
              </Link>
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-300">
                Contact
              </Link>
            </div>
            <div className="mt-5 flex gap-3 text-zinc-500">
              <MessageCircle size={18} />
              <Send size={18} />
              <Share2 size={18} />
              <Radio size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
