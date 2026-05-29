import Link from "next/link";
import { ArrowRight, Braces, Cpu, MessageCircle, Radio, Send, Share2, ShieldCheck, Signal, Trophy } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getTopTeams } from "@/lib/data";

const sponsors = ["JPL NODE", "NOVA CLOUD", "BYTEFORGE", "QUANTUM LABS"];
const telemetry = [
  { label: "Signal latency", value: "22h 14m", accent: "text-cyan-200" },
  { label: "Cipher layers", value: "12", accent: "text-purple-200" },
  { label: "Teams linked", value: "500+", accent: "text-amber-200" },
];
const bars = Array.from({ length: 18 });

export default async function Home() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);
  const topTeams = await getTopTeams(2);

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-screen items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[9%] top-[22%] h-64 w-64 rounded-full border border-cyan-300/10" />
          <div className="absolute right-[7%] top-[16%] h-80 w-80 rounded-full border border-purple-300/10" />
          <div className="absolute bottom-[8%] left-[28%] h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <p className="section-kicker">Classified deep-space relay</p>
            <h1 className="mission-title mt-7 max-w-5xl text-5xl leading-[0.95] text-white drop-shadow-[0_0_46px_rgba(0,229,255,0.18)] sm:text-7xl lg:text-8xl">
              Voyager-1 Has Received A Response
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              CODEFEST is now humanity&apos;s first alien communication interface: a high-pressure computer science
              mission where teams decode encrypted transmissions, solve puzzle tracks, and climb the live command feed.
            </p>

            <div className="mt-9 flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
              <Link href="/register" className="codefest-button signal-button px-8 py-4 text-sm">
                Join Mission <ArrowRight size={16} />
              </Link>
              <Link href="/#events" className="codefest-button ghost-button px-8 py-4 text-sm">
                Decode Briefing
              </Link>
            </div>

            <div className="mt-10 max-w-2xl">
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center">
            <span className="pulse-ring" />
            <span className="pulse-ring" />
            <span className="pulse-ring" />
            <div className="radar-disc absolute inset-4 opacity-80" />
            <div className="absolute left-[7%] top-[23%] h-2 w-2 animate-ping bg-cyan-200" />
            <div className="absolute right-[16%] top-[36%] h-2 w-2 animate-pulse bg-amber-200" />
            <div className="absolute bottom-[20%] left-[26%] h-2 w-2 animate-ping bg-purple-200" />

            <div className="glass-panel scanline relative z-10 w-[82%] max-w-md p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="terminal-label">Voyager-1 / rx_1977</p>
                  <h2 className="font-display mt-2 text-2xl font-black uppercase text-white sm:text-3xl">
                    Unknown Signal
                  </h2>
                </div>
                <Signal className="text-cyan-200 drop-shadow-[0_0_18px_rgba(0,229,255,0.5)]" size={34} />
              </div>

              <div className="mt-7 flex h-28 items-end justify-center gap-2 transmission-bars">
                {bars.map((_, index) => (
                  <span key={index} style={{ height: `${26 + ((index * 19) % 72)}px` }} />
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {telemetry.map((item) => (
                  <div key={item.label} className="hud-frame p-3">
                    <p className={`font-display text-2xl font-black ${item.accent}`}>{item.value}</p>
                    <p className="font-terminal mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="teams" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="glass-panel p-8 transition-all duration-300 hover:border-cyan-300/50 hover:shadow-signal">
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center border border-amber-300/40 bg-amber-300/10 text-amber-200 shadow-amber">
                  <Trophy size={28} />
                </div>
                <div>
                  <p className="terminal-label">Mission reward cache</p>
                  <h2 className="mission-title mt-1 text-3xl text-white">$10,000 Prize Pool</h2>
                </div>
              </div>
              <p className="relative z-10 mt-5 max-w-xl text-sm leading-7 text-slate-300">
                Scholarships, hardware grants, and finalist awards for teams that survive the alien cipher stack.
              </p>
            </article>

            <article className="glass-panel p-8 transition-all duration-300 hover:border-amber-300/50 hover:shadow-amber">
              <div className="relative z-10 grid gap-5 sm:grid-cols-2">
                <div>
                  <Cpu className="text-cyan-200" />
                  <p className="font-display mt-4 text-4xl font-black uppercase text-cyan-200">500+</p>
                  <p className="font-terminal mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Operators linked
                  </p>
                </div>
                <div>
                  <Braces className="text-purple-200" />
                  <p className="font-display mt-4 text-4xl font-black uppercase text-purple-200">12</p>
                  <p className="font-terminal mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Cipher tracks
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="glass-panel mt-8 p-6">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 bg-red-400" />
                </span>
                <h3 className="mission-title text-lg tracking-widest text-white">Live Mission Feed</h3>
              </div>
              <Link href="/leaderboard" className="codefest-button justify-start text-xs text-cyan-200 hover:text-white sm:justify-center">
                Open Rankings <ArrowRight size={14} />
              </Link>
            </div>

            <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-2">
              {topTeams.length > 0 ? (
                topTeams.map((team, index) => (
                  <div key={team.id} className="hud-frame flex items-center justify-between p-4 transition-all duration-300 hover:border-cyan-300/45">
                    <div>
                      <p className="font-terminal text-xs font-bold uppercase tracking-widest text-slate-500">
                        Signal rank {index + 1}
                      </p>
                      <p className="font-display mt-1 text-xl font-bold text-white">{team.name}</p>
                    </div>
                    <p className="font-display text-2xl font-black text-cyan-200">{team.score}</p>
                  </div>
                ))
              ) : (
                <p className="hud-frame p-4 text-sm text-slate-400 md:col-span-2">
                  Live teams will appear here as soon as Supabase returns registered competitors.
                </p>
              )}
            </div>
          </div>

          <div id="events" className="mt-14 border-y border-cyan-300/15 py-8">
            <p className="section-kicker mx-auto w-fit">Transmission partners</p>
            <div className="mt-6 grid gap-4 text-center font-terminal text-sm font-bold uppercase tracking-widest text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
              {sponsors.map((sponsor) => (
                <span key={sponsor} className="transition-all duration-300 hover:text-cyan-200 hover:drop-shadow-[0_0_14px_rgba(0,229,255,0.35)]">
                  {sponsor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass-panel scanline mx-auto max-w-5xl p-8 text-center sm:p-12">
          <ShieldCheck className="relative z-10 mx-auto text-cyan-200" size={42} />
          <h2 className="mission-title relative z-10 mt-5 text-4xl text-white sm:text-6xl">Enter The Decoder Array</h2>
          <p className="relative z-10 mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
            Bring your team, pick your stack, and work the signal through timed tracks built for algorithms,
            debugging instincts, and production-grade problem solving.
          </p>
          <Link href="/register" className="codefest-button signal-button relative z-10 mx-auto mt-10 w-full max-w-xl px-10 py-5 text-sm">
            Authorize Team Uplink
          </Link>
          <p className="font-terminal relative z-10 mt-5 text-xs font-black uppercase tracking-widest text-amber-200">
            Registration window closes in 48 hours
          </p>
        </div>
      </section>

      <footer className="border-t border-cyan-300/15 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto]">
          <div>
            <p className="font-display bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 bg-clip-text text-2xl font-black text-transparent">
              CODEFEST
            </p>
            <p className="font-terminal mt-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              &copy; 2026 University Codefest | CS Department
            </p>
          </div>
          <div>
            <h3 className="terminal-label text-white">Resources</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-200">
                API Docs
              </Link>
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-200">
                Rules
              </Link>
            </div>
          </div>
          <div>
            <h3 className="terminal-label text-white">Support</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-200">
                Help Center
              </Link>
              <Link href="/#events" className="transition-all duration-300 hover:text-cyan-200">
                Contact
              </Link>
            </div>
            <div className="mt-5 flex gap-3 text-slate-500">
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
