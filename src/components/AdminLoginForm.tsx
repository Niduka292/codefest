"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Invalid login credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel scanline w-full max-w-md p-8">
      <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center border border-purple-300/50 bg-purple-500/10 text-purple-200 shadow-violet">
        <LockKeyhole size={26} />
      </div>
      <p className="terminal-label relative z-10 mt-6 text-center">Encrypted access node</p>
      <h1 className="mission-title relative z-10 mt-2 text-center text-4xl text-white">Admin Access</h1>

      <div className="relative z-10 mt-8 space-y-5">
        <label className="block">
          <span className="terminal-label mb-2 block">Admin Passcode</span>
          <input
            name="password"
            type="password"
            placeholder="ENTER PASSCODE (default: admin123)"
            className="codefest-field"
            required
          />
        </label>
      </div>

      {error ? <p className="relative z-10 mt-5 border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="codefest-button signal-button relative z-10 mt-7 w-full px-5 py-4 text-sm"
      >
        {loading ? "Entering..." : "Enter Command Center"}
      </button>
    </form>
  );
}
