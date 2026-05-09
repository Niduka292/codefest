"use client";

import { useState, useEffect } from "react";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setMounted(true);

    function calculate() {
      const diff = targetDate.getTime() - Date.now();
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

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Don't render on server at all — avoids hydration mismatch
  if (!mounted) return null;

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.mins },
    { label: "SECS", value: timeLeft.secs },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="border border-[#1f1f2e] bg-[#111118] px-4 py-5 text-center">
          <div className="font-display font-black text-white text-4xl sm:text-5xl">
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