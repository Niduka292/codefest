import { RegistrationForm } from "@/components/RegistrationForm";
import { getParticipantCount } from "@/lib/data";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default async function RegisterPage() {
  const participantCount = await getParticipantCount();
  const avatarLabels = ["AI", "JS", "DB", "UX"];

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-153px)] max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <section className="relative py-10">
          <div className="absolute -left-16 top-16 -z-10 h-64 w-64 rounded-full border border-cyan-300/10" />
          <span className="section-kicker">Registration uplink open</span>
          <h1 className="mission-title mt-8 text-5xl leading-tight text-white sm:text-7xl">
            Join The <span className="text-cyan-200 drop-shadow-[0_0_24px_rgba(0,229,255,0.28)]">Decoder</span> Crew.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
            Team leaders lock in their squad, declare the operating stack, and get matched into the live Voyager
            transmission pipeline before mission registration closes.
          </p>

          <div className="mt-8 flex items-center gap-4 glass-panel w-fit p-3 pr-5">
            <div className="flex -space-x-3">
              {avatarLabels.map((label) => (
                <div
                  key={label}
                  className="relative z-10 flex h-11 w-11 items-center justify-center border border-cyan-300/25 bg-gradient-to-br from-purple-500 to-cyan-400 font-mono text-sm font-black text-white shadow-signal"
                >
                  {initials(label)}
                </div>
              ))}
            </div>
            <p className="font-terminal relative z-10 text-xs font-black uppercase tracking-widest text-slate-300">
              {participantCount}+ registrations already enrolled
            </p>
          </div>
        </section>

        <section>
          <RegistrationForm />
        </section>
      </div>
    </div>
  );
}
