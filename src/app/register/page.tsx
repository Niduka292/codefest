import { RegistrationForm } from "@/components/RegistrationForm";
import { getParticipantCount } from "@/lib/data";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default async function RegisterPage() {
  const participantCount = await getParticipantCount();
  const avatarLabels = ["AI", "JS", "DB", "UX"];

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-153px)] max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <section className="py-10">
          <span className="inline-flex border border-cyan-300/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-300">
            Registration Open
          </span>
          <h1 className="font-display mt-8 text-5xl font-black uppercase leading-tight text-white sm:text-7xl">
            Join The <span className="text-purple-400">Ultimate</span> Code Arena.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
            Team leaders lock in the squad for the University Finals and get matched into the live scoring pipeline
            before registrations close.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatarLabels.map((label) => (
                <div
                  key={label}
                  className="flex h-11 w-11 items-center justify-center border border-[#0a0a0f] bg-gradient-to-br from-purple-500 to-cyan-400 font-mono text-sm font-black text-white"
                >
                  {initials(label)}
                </div>
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
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
