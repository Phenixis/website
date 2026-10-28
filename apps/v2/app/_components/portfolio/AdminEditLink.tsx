"use client";

import { useEffect, useState } from "react";

// One check per page load, shared by every link rendered after it.
let sessionCheck: Promise<boolean> | null = null;

function checkSession(): Promise<boolean> {
  sessionCheck ??= fetch("/api/auth/session", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : { authenticated: false }))
    .then((data: { authenticated?: boolean }) => data.authenticated === true)
    .catch(() => false);
  return sessionCheck;
}

/** "Edit" shortcut into the admin, shown only when the visitor has an admin session. */
export function AdminEditLink({ href }: { href: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let cancelled = false;
    checkSession().then((ok) => {
      if (!cancelled) setIsAdmin(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAdmin) return null;
  return (
    <a
      href={href}
      className="ml-auto text-v3-accent border border-v3-border rounded-[4px] px-[10px] py-1 transition-colors duration-150 hover:text-v3-accent-2 hover:border-v3-accent"
    >
      Edit ✎
    </a>
  );
}
