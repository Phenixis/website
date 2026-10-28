import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const text = "font-mono text-[13.5px] leading-[1.85] text-v3-text text-pretty max-[480px]:text-[12.5px] max-[480px]:leading-[1.75]";

function isExternal(href: string | undefined): boolean {
  return !!href && /^https?:\/\//.test(href);
}

// Raw HTML in the source is not rendered (no rehype-raw): bodies only ever
// contain Markdown.
const components: Components = {
  p: ({ children }) => <p className={`${text} m-0`}>{children}</p>,
  h1: ({ children }) => <h2 className="font-serif font-light text-[28px] leading-[1.2] tracking-[-0.01em] text-v3-text mt-4 mb-0 max-[480px]:text-[22px]">{children}</h2>,
  h2: ({ id, className, children }) =>
    // remark-gfm's visually hidden "Footnotes" label above the notes list.
    className?.includes("sr-only") ? (
      <h2 id={id} className="sr-only">{children}</h2>
    ) : (
      <h2 className="font-serif font-light text-[24px] leading-[1.25] tracking-[-0.01em] text-v3-text mt-4 mb-0 max-[480px]:text-[20px]">{children}</h2>
    ),
  h3: ({ children }) => <h3 className="font-serif italic font-light text-[20px] leading-[1.3] text-v3-text mt-2 mb-0 max-[480px]:text-[17px]">{children}</h3>,
  h4: ({ children }) => <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-v3-text-mute mt-2 mb-0">{children}</h4>,
  a: ({ href, id, children, ...rest }) => {
    // Footnote reference (the superscript number) and its back-link (↩).
    if (href?.startsWith("#user-content-fn")) {
      return (
        <a
          href={href}
          id={id}
          aria-describedby={rest["aria-describedby"]}
          aria-label={rest["aria-label"]}
          className="text-v3-accent no-underline px-[1px] transition-colors duration-150 hover:text-v3-accent-2"
        >
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        className="text-v3-accent underline decoration-v3-accent/40 underline-offset-[3px] transition-colors duration-150 hover:text-v3-accent-2 hover:decoration-v3-accent-2"
        {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  sup: ({ children }) => <sup className="text-[0.7em] leading-none align-super scroll-mt-24">{children}</sup>,
  section: ({ className, children }) =>
    className?.includes("footnotes") ? (
      <section className="mt-2 pt-5 border-t border-v3-rule [&_ol]:text-[12px] [&_ol]:leading-[1.7] [&_ol]:text-v3-text-2 [&_p]:text-[12px] [&_p]:leading-[1.7] [&_p]:text-v3-text-2">
        {children}
      </section>
    ) : (
      <section>{children}</section>
    ),  strong: ({ children }) => <strong className="font-semibold text-v3-text">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className={`${text} m-0 pl-5 list-disc marker:text-v3-accent flex flex-col gap-2`}>{children}</ul>,
  ol: ({ children }) => <ol className={`${text} m-0 pl-6 list-decimal marker:text-v3-accent marker:tabular-nums flex flex-col gap-2`}>{children}</ol>,
  li: ({ id, className, children }) =>
    // GFM task list item ("- [ ] …"): the checkbox replaces the bullet.
    className?.includes("task-list-item") ? (
      <li className="list-none -ml-5 flex items-baseline gap-[10px] [&>ul]:mt-2 [&>ol]:mt-2">{children}</li>
    ) : (
      <li id={id} className="pl-1 scroll-mt-24 [&>ul]:mt-2 [&>ol]:mt-2">{children}</li>
    ),
  input: ({ type, checked }) =>
    type === "checkbox" ? (
      <input type="checkbox" checked={!!checked} disabled className="accent-v3-accent translate-y-[1px] shrink-0" />
    ) : null,
  blockquote: ({ children }) => (
    <blockquote className="m-0 border-l-2 border-v3-accent/55 pl-5 font-serif italic font-light text-[17px] leading-[1.6] text-v3-text-2 [&_p]:font-serif [&_p]:text-[17px] [&_p]:leading-[1.6] [&_p]:text-v3-text-2 max-[480px]:text-[15px] max-[480px]:[&_p]:text-[15px]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.92em] bg-v3-bg-3 border border-v3-border rounded-[3px] px-[5px] py-px text-v3-accent-2">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="m-0 overflow-x-auto scroll-thin bg-v3-bg-2 border border-v3-border rounded-[6px] px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-v3-text-2 [&_code]:bg-transparent [&_code]:border-0 [&_code]:p-0 [&_code]:text-inherit [&_code]:text-[length:inherit]">
      {children}
    </pre>
  ),
  hr: () => <hr className="w-14 h-px border-0 bg-v3-accent opacity-55 my-2" />,
  img: ({ src, alt }) => (
    // Images are arbitrary URLs (usually Vercel Blob uploads from the admin
    // media page) with unknown dimensions, so next/image doesn't fit here.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" className="block max-w-full h-auto rounded-[6px] border border-v3-border" />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto scroll-thin">
      <table className={`${text} w-full border-collapse text-[12.5px]`}>{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="text-left font-semibold border-b border-v3-border-strong px-3 py-2">{children}</th>,
  td: ({ children }) => <td className="border-b border-v3-border px-3 py-2 align-top">{children}</td>,
};

// Writing's drop cap: the first letter of the body's opening paragraph.
// Purely CSS, so it survives inline Markdown (links, bold) in that paragraph.
const dropCapCls = [
  "[&>p:first-child]:first-letter:font-serif",
  "[&>p:first-child]:first-letter:italic",
  "[&>p:first-child]:first-letter:font-light",
  "[&>p:first-child]:first-letter:text-[56px]",
  "[&>p:first-child]:first-letter:leading-[0.85]",
  "[&>p:first-child]:first-letter:float-left",
  "[&>p:first-child]:first-letter:mr-2",
  "[&>p:first-child]:first-letter:-mb-[2px]",
  "[&>p:first-child]:first-letter:mt-[6px]",
  "[&>p:first-child]:first-letter:text-v3-accent",
  "max-[720px]:[&>p:first-child]:first-letter:text-[44px]",
  "max-[480px]:[&>p:first-child]:first-letter:text-[36px]",
  "max-[480px]:[&>p:first-child]:first-letter:mr-[6px]",
  "max-[480px]:[&>p:first-child]:first-letter:mt-1",
].join(" ");

// remark-breaks keeps a single newline inside a paragraph as a line break
// (as the plain-text bodies did), rather than Markdown's default of folding
// it into a space.
const remarkPlugins = [remarkGfm, remarkBreaks];

export function Markdown({ source, dropCap = false }: { source: string; dropCap?: boolean }) {
  return (
    <div className={`flex flex-col gap-[22px] max-[720px]:gap-[18px] ${dropCap ? dropCapCls : ""}`}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
