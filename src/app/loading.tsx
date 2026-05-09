export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="border border-[#1f1f2e] bg-[#111118] px-8 py-6 text-center">
        <p className="font-display text-2xl font-black uppercase tracking-widest text-white">Loading Signal</p>
        <div className="mx-auto mt-4 h-1 w-40 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 animate-pulse bg-cyan-300" />
        </div>
      </div>
    </div>
  );
}
