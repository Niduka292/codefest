"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="max-w-lg border border-red-500/30 bg-[#111118] p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.12)]">
        <p className="text-xs font-black uppercase tracking-widest text-red-300">Data Fetch Error</p>
        <h1 className="font-display mt-3 text-3xl font-black uppercase text-white">Signal Interrupted</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="codefest-button mt-6 bg-purple-600 px-6 py-3 text-xs text-white hover:bg-purple-500"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
