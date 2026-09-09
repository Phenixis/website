import Link from "next/link";
import { HourglassIcon } from "./_components/HourglassIcon";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-v3-bg text-v3-text font-mono text-[13px] px-6 text-center">
      <HourglassIcon className="w-5 h-7" topFraction={0.1} bottomFraction={0.9} />
      <h1 className="font-serif font-light text-[32px] text-v3-text m-0">Nothing here.</h1>
      <p className="text-v3-text-2 max-w-[420px] m-0 leading-[1.6]">
        This page doesn&apos;t exist, or it moved.
      </p>
      <Link
        href="/"
        className="mt-2 px-4 py-2 rounded-[5px] border border-v3-border-strong text-v3-text no-underline transition-colors duration-150 hover:border-v3-accent hover:text-v3-accent"
      >
        Go home
      </Link>
    </div>
  );
}
