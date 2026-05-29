export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="glass-panel scanline px-8 py-6 text-center">
        <p className="terminal-label relative z-10">Receiving carrier wave</p>
        <p className="mission-title relative z-10 mt-2 text-2xl text-white">Loading Signal</p>
        <div className="relative z-10 mx-auto mt-4 h-1 w-40 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 animate-pulse bg-cyan-300 shadow-signal" />
        </div>
      </div>
    </div>
  );
}
