"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md border border-[#1f1f2e] bg-[#111118] p-8 shadow-[0_0_60px_rgba(139,92,246,0.14)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center border border-purple-400/50 bg-purple-500/10 text-purple-200">
        <LockKeyhole size={26} />
      </div>
      <h1 className="font-display mt-6 text-center text-4xl font-black uppercase text-white">Admin Access</h1>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Email</span>
          <input name="email" type="email" placeholder="EMAIL" className="codefest-field" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Password</span>
          <input name="password" type="password" placeholder="PASSWORD" className="codefest-field" required />
        </label>
      </div>

      {error ? <p className="mt-5 border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="codefest-button mt-7 w-full bg-purple-600 px-5 py-4 text-sm text-white hover:bg-purple-500"
      >
        {loading ? "Entering..." : "Enter Command Center"}
      </button>
    </form>
  );
}
