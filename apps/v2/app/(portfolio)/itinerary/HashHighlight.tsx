"use client";

import { useEffect } from "react";

const ATTR = "data-highlighted";

/** Highlights the itinerary entry whose id matches the URL hash (/itinerary#some-id)
 *  and scrolls it into view. Sets a data attribute rather than relying on :target,
 *  which doesn't update on history.pushState (Next.js client navigation). */
export function HashHighlight() {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll(`[${ATTR}]`).forEach((el) => el.removeAttribute(ATTR));
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el?.hasAttribute("data-entry")) return;
      el.setAttribute(ATTR, "");
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    apply();
    window.addEventListener("hashchange", apply);
    window.addEventListener("popstate", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
      window.removeEventListener("popstate", apply);
    };
  }, []);
  return null;
}
