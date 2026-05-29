import Link from "next/link";
import { Bug, GitFork, LockKeyhole, Radio, Trophy, Zap } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getTopTeams } from "@/lib/data";

const modules = [
  {
    id: "01",
    title: "Logic Corruption",
    type: "Debugging",
    copy: "Identify and fix corrupted code segments from the alien transmission",
    icon: Bug,
    status: "ACTIVE",
    color: "cyan",
  },
  {
    id: "02",
    title: "Quantum Network",
    type: "Networking",
    copy: "Route packets through a multi-dimensional network topology",
    icon: GitFork,
    status: "LOCKED",
    color: "purple",
  },
  {
    id: "03",
    title: "Cipher Protocols",
    type: "Cryptography",
    copy: "Decrypt alien encryption algorithms using known cryptographic methods",
    icon: LockKeyhole,
    status: "LOCKED",
    color: "amber",
  },
];

export default async function Home() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);
  const topTeams = await getTopTeams(2);

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-[calc(100vh-88px)] items-start justify-center px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center text-center">
          <div className="status-pill font-terminal inline-flex items-center gap-3 px-6 py-3 text-base font-bold uppercase tracking-wider">
            <Radio size={18} />
            Signal Detected
          </div>

          <h1 className="page-gradient-title mt-11 max-w-[1180px] text-[4.4rem] sm:text-[7.8rem] lg:text-[8.2rem] xl:text-[7.3rem] 2xl:text-[8.6rem]">
            Voyager-1 Has
            <br />
            Received A
            <br />
            Response
          </h1>

          <p className="mt-9 max-w-[940px] text-2xl font-medium leading-[1.65] text-slate-400">
            After 47 years in deep space, Voyager-1 has detected an extraterrestrial transmission. Your mission: solve
            interconnected CS puzzles to decode the message.
          </p>

          <p className="font-terminal mt-10 text-xl font-bold uppercase tracking-wider text-cyan-300">
            Mission Begins In
          </p>

          <div className="mt-5 w-full max-w-[560px]">
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>
      </section>

      <section id="events" className="px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <h2 className="page-gradient-title text-5xl sm:text-7xl lg:text-8xl">Mission Modules</h2>
            <p className="font-terminal mt-5 text-xl font-bold uppercase tracking-widest text-slate-400">
              Complete challenges to unlock the final cipher
            </p>
          </div>

          <div className="glass-panel mt-16 p-8">
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div>
                <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Mission Progress</p>
                <p className="font-display mt-3 text-3xl font-black uppercase text-cyan-300">3 / 10 Modules Active</p>
              </div>
              <div>
                <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Total Points</p>
                <p className="font-display mt-2 text-2xl font-black text-amber-300">2,275 XP</p>
              </div>
              <div>
                <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Completion</p>
                <p className="font-display mt-2 text-2xl font-black text-emerald-400">0%</p>
              </div>
            </div>
            <div className="relative z-10 mt-7 h-3 overflow-hidden rounded-full bg-[#030712]">
              <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-cyan-300 to-purple-400 shadow-signal" />
            </div>
          </div>

          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = module.status === "ACTIVE";
              const accent =
                module.color === "cyan"
                  ? "border-cyan-300/35 text-cyan-300"
                  : module.color === "purple"
                    ? "border-purple-400/35 text-purple-400"
                    : "border-amber-300/35 text-amber-300";

              return (
                <article key={module.id} className="module-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-signal">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-lg border bg-current/10 ${accent}`}>
                      <Icon size={38} />
                    </div>
                    <span
                      className={`font-terminal rounded border px-3 py-2 text-sm font-bold uppercase ${
                        isActive
                          ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-400"
                          : "border-red-400/60 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {module.status}
                    </span>
                  </div>
                  <p className="font-terminal mt-8 text-base font-bold uppercase tracking-widest text-slate-500">
                    Module {module.id}
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-black uppercase text-cyan-300">{module.title}</h3>
                  <p className="font-terminal mt-3 text-base text-purple-400">{module.type}</p>
                  <p className="mt-5 max-w-sm text-lg leading-8 text-slate-400">{module.copy}</p>
                  <div className="mt-7 h-px bg-cyan-300/25" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cipher" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-7 lg:grid-cols-[1fr_1fr]">
          <article className="glass-panel p-8">
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-amber-300/40 bg-amber-300/10 text-amber-300">
                <Trophy size={28} />
              </div>
              <div>
                <p className="font-terminal text-sm font-bold uppercase tracking-widest text-slate-400">Mission reward cache</p>
                <h2 className="font-display mt-1 text-3xl font-black uppercase text-white">$10,000 Prize Pool</h2>
              </div>
            </div>
            <p className="relative z-10 mt-5 max-w-xl text-lg leading-8 text-slate-400">
              Scholarships, hardware grants, and finalist awards for teams that survive the alien cipher stack.
            </p>
          </article>

          <article className="glass-panel p-8">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="font-terminal text-sm font-bold uppercase tracking-widest text-slate-400">Live Mission Feed</p>
                <h2 className="font-display mt-1 text-3xl font-black uppercase text-white">Top Signals</h2>
              </div>
              <Link href="/leaderboard" className="codefest-button ghost-button px-5 py-3 text-xs">
                Rankings
              </Link>
            </div>
            <div className="relative z-10 mt-6 grid gap-3">
              {topTeams.length > 0 ? (
                topTeams.map((team, index) => (
                  <div key={team.id} className="hud-frame flex items-center justify-between p-4">
                    <div>
                      <p className="font-terminal text-xs font-bold uppercase tracking-widest text-slate-500">Rank {index + 1}</p>
                      <p className="font-display mt-1 text-xl font-bold text-white">{team.name}</p>
                    </div>
                    <p className="font-display text-2xl font-black text-cyan-300">{team.score}</p>
                  </div>
                ))
              ) : (
                <p className="hud-frame p-4 text-sm text-slate-400">
                  Live teams will appear here as soon as Supabase returns registered competitors.
                </p>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[960px] text-center">
          <Zap className="mx-auto text-cyan-300" size={42} />
          <h2 className="page-gradient-title mt-5 text-5xl sm:text-7xl">Authorize Uplink</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Assemble your crew and enter the protocol before the final transmission window closes.
          </p>
          <Link href="/register" className="codefest-button signal-button mt-9 px-10 py-5 text-sm">
            Register Team
          </Link>
        </div>
      </section>
    </div>
  );
}
