"use client";

import { useEffect, useState } from "react";

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setViews(null);

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((res) => (res.ok ? res.json() : { views: 0 }))
      .then((data) => {
        if (!cancelled) setViews(data.views ?? 0);
      })
      .catch(() => {
        if (!cancelled) setViews(0);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return <span>{views === null ? "···" : views}</span>;
}
