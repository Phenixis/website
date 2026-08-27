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

const SEARCH_ICON =
  "bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%3E%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%224.5%22%20fill%3D%22none%22%20stroke%3D%22%236e6e80%22%20stroke-width%3D%221.4%22%2F%3E%3Cpath%20d%3D%22M9.5%209.5L13%2013%22%20stroke%3D%22%236e6e80%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')]";

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
    <div className="fixed inset-0 grid grid-rows-[44px_1fr] grid-cols-[232px_1fr] [grid-template-areas:'topbar_topbar'_'sidebar_main'] bg-a-bg text-a-text font-mono text-[13px] leading-[1.55] antialiased max-[900px]:grid-cols-1 max-[900px]:[grid-template-areas:'topbar'_'main']">
      <header className="[grid-area:topbar] flex items-center border-b border-a-border px-[18px] bg-a-bg-2 text-[11.5px] gap-5 z-[11] relative max-[980px]:gap-3 max-[980px]:px-[14px] max-[560px]:px-[10px] max-[560px]:gap-2">
        <button
          className="hidden max-[900px]:flex w-8 h-8 flex-none bg-transparent border border-a-border rounded-[5px] cursor-pointer p-0 items-center justify-center flex-col gap-[3px] mr-1 transition-colors duration-[140ms] hover:border-a-border-focus"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={sidebarOpen}
        >
          <span className={`w-[14px] h-[1.5px] bg-a-text rounded-[1px] transition-[transform,opacity] duration-200 ${sidebarOpen ? "translate-y-[4.5px] rotate-45" : ""}`} />
          <span className={`w-[14px] h-[1.5px] bg-a-text rounded-[1px] transition-[transform,opacity] duration-200 ${sidebarOpen ? "opacity-0" : ""}`} />
          <span className={`w-[14px] h-[1.5px] bg-a-text rounded-[1px] transition-[transform,opacity] duration-200 ${sidebarOpen ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-a-accent text-[14px] max-[560px]:text-[16px]">✦</span>
          <div className="flex items-baseline gap-[10px] tracking-[0.15em] uppercase text-[11px] max-[560px]:hidden">
            <span className="text-a-text font-semibold tracking-[0.2em] max-[900px]:tracking-[0.15em] max-[900px]:text-[10.5px]">{profile.name}</span>
            <span className="text-[9.5px] tracking-[0.18em] px-[7px] py-[2px] border border-a-border-strong rounded-[3px] text-a-text-mute bg-a-bg-3 max-[900px]:hidden">Back-office</span>
          </div>
        </div>
        <div className="flex-1 flex justify-center max-[900px]:hidden">
          <input
            className={`bg-a-bg border border-a-border rounded-[5px] pl-7 pr-[10px] py-[5px] w-80 text-a-text font-mono text-[11.5px] outline-none transition-colors duration-[160ms] bg-no-repeat bg-[position:8px_center] focus:border-a-border-focus placeholder:text-a-text-dim max-[980px]:w-[220px] max-[980px]:text-[11px] ${SEARCH_ICON}`}
            placeholder="Search projects, posts, experiences…"
            readOnly
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-[6px] text-a-text-mute text-[11px] max-[560px]:hidden">
            <span className="w-[6px] h-[6px] rounded-full bg-a-green shadow-[0_0_0_3px_var(--color-a-green-soft)]" />
            <span className="max-[980px]:hidden">All synced</span>
          </span>
          <Link className="inline-flex items-center gap-1 text-a-text-mute no-underline text-[11px] tracking-[0.08em] uppercase px-[10px] py-1 rounded-[4px] border border-a-border transition-all duration-[160ms] hover:text-a-accent hover:border-a-border-strong" href="/">
            <span>↗</span>
            <span className="max-[560px]:hidden"> View site</span>
          </Link>
          <div className="w-6 h-6 rounded-full [background:linear-gradient(135deg,var(--color-a-accent),#f472b6)] flex items-center justify-center text-[#0a0a14] font-bold text-[11px] font-serif" title={profile.name}>M</div>
        </div>
      </header>

      <aside
        className={[
          "[grid-area:sidebar] bg-a-bg-2 border-r border-a-border flex flex-col pt-[18px] pb-[14px] overflow-y-auto scroll-thin-a",
          "max-[900px]:fixed max-[900px]:left-0 max-[900px]:top-11 max-[900px]:bottom-0 max-[900px]:w-[264px] max-[900px]:z-10 max-[900px]:transition-transform max-[900px]:duration-[260ms] max-[900px]:ease-a-drawer",
          sidebarOpen
            ? "max-[900px]:translate-x-0 max-[900px]:shadow-[8px_0_32px_rgba(0,0,0,0.5)]"
            : "max-[900px]:-translate-x-full",
        ].join(" ")}
      >
        {nav.map((group) => (
          <div key={group.group} className="px-3 pb-[6px] [&+&]:mt-[14px] [&+&]:pt-[14px] [&+&]:border-t [&+&]:border-a-border">
            <div className="text-[10px] tracking-[0.18em] uppercase text-a-text-dim px-[10px] pb-2 font-medium">{group.group}</div>
            {group.items.map((it) => {
              const active = isActive(it.href, it.id);
              return (
                <Link
                  key={it.id}
                  href={it.href}
                  className={[
                    "flex items-center gap-[10px] px-[10px] py-[7px] rounded-[5px] cursor-pointer text-a-text-2 text-[12px] tracking-[-0.005em] transition-all duration-[140ms] border border-transparent no-underline font-mono hover:bg-a-bg-3 hover:text-a-text",
                    active ? "bg-a-accent-soft text-a-accent-2 border-[rgba(183,148,246,0.18)]" : "",
                  ].join(" ")}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={`w-4 text-center text-[13px] font-serif italic font-light ${active ? "text-a-accent" : "text-a-text-mute"}`}>{it.icon}</span>
                  <span className="flex-1">{it.label}</span>
                  {it.count != null && (
                    <span
                      className={[
                        "text-[10px] tabular-nums rounded-[3px] px-[6px] py-[1px] border",
                        active
                          ? "bg-[rgba(183,148,246,0.08)] border-[rgba(183,148,246,0.2)] text-a-accent"
                          : "bg-a-bg border-a-border text-a-text-dim",
                      ].join(" ")}
                    >
                      {String(it.count).padStart(2, "0")}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="flex-1" />
        <div className="px-[22px] pt-[14px] pb-1 text-[10px] text-a-text-dim tracking-[0.1em] flex items-center justify-between">
          <span>v2.0 · Saint-Brieuc</span>
          <button className="bg-transparent border-0 text-a-text-dim font-mono text-[14px] cursor-pointer px-[6px] py-1 rounded-[4px] transition-colors duration-[120ms] leading-none hover:text-a-text-mute hover:bg-a-bg-3" onClick={signOut} title="Sign out">↩</button>
        </div>
      </aside>

      <div
        className={`fixed inset-0 bg-black/55 z-[9] transition-opacity duration-[240ms] ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="[grid-area:main] flex flex-col overflow-hidden bg-a-bg">{children}</main>
    </div>
  );
}
