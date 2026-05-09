"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  targetDate: Date;
  compact?: boolean;
};

function getRemaining(targetDate: Date) {
  const total = Math.max(0, targetDate.getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((total / (1000 * 60)) % 60);
  const secs = Math.floor((total / 1000) % 60);

  return { total, days, hours, mins, secs };
}

export function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getRemaining(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const units = useMemo(
    () => [
      { label: "Days", value: remaining.days },
      { label: "Hours", value: remaining.hours },
      { label: "Mins", value: remaining.mins },
      { label: "Secs", value: remaining.secs },
    ],
    [remaining],
  );

  if (remaining.total <= 0) {
    return (
      <div className="font-display animate-pulse border border-cyan-300/40 bg-cyan-300/10 px-8 py-4 text-3xl font-black uppercase tracking-widest text-cyan-200 shadow-[0_0_34px_rgba(34,211,238,0.18)]">
        Event Live
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-3 ${compact ? "w-full max-w-sm" : "w-full max-w-2xl"}`}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className={`border border-[#1f1f2e] bg-[#111118]/90 text-center shadow-[0_0_28px_rgba(139,92,246,0.08)] backdrop-blur transition-all duration-300 hover:border-purple-400/50 ${
            compact ? "px-2 py-3" : "px-3 py-5 sm:px-6"
          }`}
        >
          <div className={`font-display font-black text-white ${compact ? "text-2xl" : "text-4xl sm:text-5xl"}`}>
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
