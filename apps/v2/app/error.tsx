"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LifeElapsed } from "./_components/portfolio/LifeElapsed";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-v3-bg text-v3-text font-mono text-[13px] px-6 text-center">
      <LifeElapsed className="w-5 h-7" />
      <h1 className="font-serif font-light text-[32px] text-v3-text m-0">Something broke.</h1>
      <p className="text-v3-text-2 max-w-[420px] m-0 leading-[1.6]">
        The page hit an unexpected error. It&apos;s been logged — try reloading, or head back home.
      </p>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-[5px] border border-v3-border-strong text-v3-text bg-transparent cursor-pointer transition-colors duration-150 hover:border-v3-accent hover:text-v3-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-[5px] border border-v3-border-strong text-v3-text no-underline transition-colors duration-150 hover:border-v3-accent hover:text-v3-accent"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
