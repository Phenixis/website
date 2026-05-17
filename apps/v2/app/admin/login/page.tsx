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
    <div className="a-login-root">
      <div className="a-login-card">
        <div className="a-login-logo">✦</div>
        <h1 className="a-login-title">Back-office</h1>
        <p className="a-login-sub">Enter your admin password to continue.</p>
        <form className="a-login-form" onSubmit={submit}>
          <input
            className="a-login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="a-login-error">{error}</p>}
          <button className="a-login-btn" type="submit" disabled={loading || !password}>
            {loading ? "…" : "Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
}
