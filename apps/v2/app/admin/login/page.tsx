"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-a-bg flex items-center justify-center font-mono antialiased z-[100]">
      <div className="w-80 flex flex-col items-center gap-0">
        <div className="text-[28px] text-a-accent mb-[18px]">✦</div>
        <h1 className="font-serif text-[22px] font-normal text-a-text m-0 mb-[6px]">Back-office</h1>
        <p className="text-[11.5px] text-a-text-mute m-0 mb-7 text-center">Enter your admin password to continue.</p>
        <form className="w-full flex flex-col gap-[10px]" onSubmit={submit}>
          <input
            className="w-full box-border bg-a-bg-2 border border-a-border rounded-md text-a-text font-mono text-[13px] px-3 py-[9px] outline-none transition-colors duration-[140ms] focus:border-a-accent placeholder:text-a-text-dim"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="text-[11.5px] text-a-red m-0 py-1">{error}</p>}
          <button
            className="bg-a-accent text-[#0a0a0d] border-0 rounded-md font-mono text-[13px] font-semibold px-5 py-[10px] cursor-pointer tracking-[0.04em] transition-colors duration-[120ms] w-full enabled:hover:bg-a-accent-2 disabled:opacity-40 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || !password}
          >
            {loading ? "…" : "Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
}
