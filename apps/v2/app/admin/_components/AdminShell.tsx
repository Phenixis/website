"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile } from "../../data";

type Counts = {
  projects: number;
  posts: number;
  experiences: number;
  drafts: number;
  archived: number;
  tags: number;
};

export function AdminShell({
  children,
  profile,
  counts,
}: {
  children: React.ReactNode;
  profile: Profile;
  counts: Counts;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    {
      group: "Content",
      items: [
        { id: "dashboard", href: "/admin", label: "Overview", icon: "✦", count: undefined as number | undefined },
        { id: "projects", href: "/admin/projects", label: "Projects", icon: "I", count: counts.projects },
        { id: "posts", href: "/admin/posts", label: "Writing", icon: "II", count: counts.posts },
        { id: "experiences", href: "/admin/experiences", label: "Itinerary", icon: "III", count: counts.experiences },
      ],
    },
    {
      group: "Library",
      items: [
        { id: "media", href: "/admin/media", label: "Media", icon: "◇", count: undefined as number | undefined },
        { id: "tags", href: "/admin/tags", label: "Tags", icon: "#", count: counts.tags },
      ],
    },
    {
      group: "Workspace",
      items: [
        { id: "drafts", href: "/admin/drafts", label: "Drafts", icon: "•", count: counts.drafts },
        { id: "archive", href: "/admin/archive", label: "Archive", icon: "⌗", count: counts.archived },
        { id: "settings", href: "/admin/settings", label: "Settings", icon: "⚙", count: undefined as number | undefined },
      ],
    },
  ];

  const signOut = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, id: string) => {
    if (id === "dashboard") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className={`a-shell ${sidebarOpen ? "is-sidebar-open" : ""}`}>
      <header className="a-topbar">
        <button
          className="a-hamburger"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={sidebarOpen}
        >
          <span className="a-hamburger-line" />
          <span className="a-hamburger-line" />
          <span className="a-hamburger-line" />
        </button>
        <div className="a-topbar-left">
          <span className="a-topbar-logo">✦</span>
          <div className="a-topbar-brand">
            <span className="a-topbar-name">{profile.name}</span>
            <span className="a-topbar-pill">Back-office</span>
          </div>
        </div>
        <div className="a-topbar-center">
          <input
            className="a-topbar-search"
            placeholder="Search projects, posts, experiences…"
            readOnly
          />
        </div>
        <div className="a-topbar-right">
          <span className="a-topbar-status">
            <span className="a-topbar-status-dot" />
            <span className="a-topbar-status-label">All synced</span>
          </span>
          <Link className="a-topbar-link" href="/">
            <span>↗</span>
            <span className="a-topbar-link-label"> View site</span>
          </Link>
          <div className="a-topbar-avatar" title={profile.name}>M</div>
        </div>
      </header>

      <aside className="a-sidebar">
        {nav.map((group) => (
          <div key={group.group} className="a-side-group">
            <div className="a-side-heading">{group.group}</div>
            {group.items.map((it) => (
              <Link
                key={it.id}
                href={it.href}
                className={`a-side-item ${isActive(it.href, it.id) ? "is-active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="a-side-icon">{it.icon}</span>
                <span className="a-side-label">{it.label}</span>
                {it.count != null && (
                  <span className="a-side-count">{String(it.count).padStart(2, "0")}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
        <div className="a-side-spacer" />
        <div className="a-side-footer">
          <span>v2.0 · Saint-Brieuc</span>
          <button className="a-side-signout" onClick={signOut} title="Sign out">↩</button>
        </div>
      </aside>

      <div className="a-scrim" onClick={() => setSidebarOpen(false)} />

      <main className="a-main">{children}</main>
    </div>
  );
}
