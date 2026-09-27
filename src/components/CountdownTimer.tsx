"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  targetDate: string | Date;
  compact?: boolean;
};

export function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function calculate() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const boot = window.setTimeout(() => {
      setMounted(true);
      calculate();
      interval = setInterval(calculate, 1000);
    }, 0);

    return () => {
      window.clearTimeout(boot);
      if (interval) clearInterval(interval);
    };
  }, [targetDate]);

  // Don't render on server at all — avoids hydration mismatch
  if (!mounted) return null;

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.mins },
    { label: "SECS", value: timeLeft.secs },
  ];

  const valueClassName = compact
    ? "font-display text-2xl font-black text-white sm:text-3xl"
    : "font-display text-4xl font-black text-white sm:text-5xl";

  return (
    <div className={`grid grid-cols-4 ${compact ? "gap-2" : "gap-3"}`}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className={`glass-panel scanline text-center ${
            compact ? "px-3 py-4" : "px-4 py-5"
          }`}
        >
          <div className={`${valueClassName} relative z-10 text-cyan-50 drop-shadow-[0_0_18px_rgba(0,229,255,0.3)]`}>
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="font-terminal relative z-10 mt-2 text-[10px] font-bold uppercase tracking-widest text-cyan-200/70">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
