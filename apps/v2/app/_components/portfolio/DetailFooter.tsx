import Link from "next/link";

type NavItem = { id: string; title: string };

const navBtnBase =
  "bg-transparent border border-v3-border rounded-md px-[18px] py-[14px] cursor-pointer font-mono text-v3-text-2 flex flex-col gap-1 transition-all duration-200 hover:border-v3-accent hover:bg-[rgba(183,148,246,0.04)] only:col-start-2";

/** Shared "signature + prev/next" footer used by both project and post detail articles. */
export function DetailFooter({
  sign,
  prev,
  next,
  hrefFor,
}: {
  sign: React.ReactNode;
  prev: NavItem | null;
  next: NavItem | null;
  hrefFor: (id: string) => string;
}) {
  return (
    <footer className="mt-14 pt-7 border-t border-v3-border max-[480px]:mt-9 max-[480px]:pt-5">
      <div className="flex items-center gap-[10px] text-[11px] tracking-[0.15em] uppercase text-v3-text-mute mb-7">
        {sign}
      </div>
      <nav className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
        {prev && (
          <Link href={hrefFor(prev.id)} className={`${navBtnBase} text-left`}>
            <span className="text-[10px] tracking-[0.18em] uppercase text-v3-text-mute">← previous</span>
            <span className="font-serif not-italic font-normal text-[15px] tracking-[-0.005em] text-v3-text leading-[1.3] text-pretty">{prev.title}</span>
          </Link>
        )}
        {next && (
          <Link href={hrefFor(next.id)} className={`${navBtnBase} text-right`}>
            <span className="text-[10px] tracking-[0.18em] uppercase text-v3-text-mute">next →</span>
            <span className="font-serif not-italic font-normal text-[15px] tracking-[-0.005em] text-v3-text leading-[1.3] text-pretty">{next.title}</span>
          </Link>
        )}
      </nav>
    </footer>
  );
}
