import Link from "next/link";
import { Cpu, GitFork, LockKeyhole, Radio, Zap } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";

const modules = [
  {
    id: "01",
    title: "Data Structures & Algorithms",
    type: "Core CS",
    copy: "Optimize data layout, dynamic programming, tree traversals, graph search, and algorithmic complexity.",
    icon: GitFork,
    status: "ACTIVE",
    color: "cyan",
  },
  {
    id: "02",
    title: "Computer Security",
    type: "Cybersecurity",
    copy: "Cryptographic protocol analysis, vulnerability exploitation, payload defense, and reverse engineering.",
    icon: LockKeyhole,
    status: "ACTIVE",
    color: "purple",
  },
  {
    id: "03",
    title: "Computer System Organization",
    type: "Systems & Hardware",
    copy: "Low-level memory management, assembly instructions, CPU architecture, and operating system kernels.",
    icon: Cpu,
    status: "ACTIVE",
    color: "amber",
  },
];

export default async function Home() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-[calc(100vh-88px)] items-start justify-center px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center text-center">
          <div className="status-pill font-terminal inline-flex items-center gap-3 px-6 py-3 text-base font-bold uppercase tracking-wider">
            <Radio size={18} />
            Signal Detected
          </div>

          <h1 className="page-gradient-title mt-7 max-w-[1180px] text-[2.4rem] leading-[1.08] sm:mt-11 sm:text-[5.5rem] sm:leading-[0.94] md:text-[6.8rem] lg:text-[7.8rem] xl:text-[7rem] 2xl:text-[8.2rem]">
            Voyager-1 Has
            <br />
            Received A
            <br />
            Response
          </h1>

          <p className="mt-9 max-w-[900px] text-lg font-normal leading-8 text-slate-400 sm:text-xl">
            After 47 years in deep space, Voyager-1 detects an extraterrestrial transmission. Your mission: solve interconnected CS
            puzzles to decode the message.
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
            <h2 className="page-gradient-title text-5xl sm:text-7xl lg:text-8xl">Knowledge Areas</h2>
            <p className="font-terminal mt-5 text-xl font-bold uppercase tracking-widest text-slate-400">
              Core computer science domains tested in this competition
            </p>
          </div>

          <div className="glass-panel mt-16 p-8">
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div>
                <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Competition Domains</p>
                <p className="font-display mt-3 text-3xl font-black uppercase text-cyan-300">3 Core Subject Areas</p>
              </div>
              <div>
                <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Challenge Modules</p>
                <p className="font-display mt-2 text-2xl font-black text-amber-300">Active Protocol</p>
              </div>
              <div>
                <p className="font-terminal text-base font-bold uppercase tracking-widest text-slate-400">Eligibility</p>
                <p className="font-display mt-2 text-2xl font-black text-emerald-400">All CS Students</p>
              </div>
            </div>
            <div className="relative z-10 mt-7 h-3 overflow-hidden rounded-full bg-[#030712]">
              <div className="h-full w-[100%] rounded-full bg-gradient-to-r from-cyan-300 via-purple-400 to-amber-300 shadow-signal" />
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
                    Domain {module.id}
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
