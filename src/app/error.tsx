"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="glass-panel max-w-lg p-8 text-center">
        <p className="font-terminal relative z-10 text-xs font-black uppercase tracking-widest text-red-300">Data Fetch Error</p>
        <h1 className="mission-title relative z-10 mt-3 text-3xl text-white">Signal Interrupted</h1>
        <p className="relative z-10 mt-4 text-sm leading-7 text-slate-300">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="codefest-button signal-button relative z-10 mt-6 px-6 py-3 text-xs"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
