import { Link } from "@/components/big/link";
import Image from "next/image";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";
import { formatToKebabCase } from "@/app/blog/utils";

let ids: string[] = [];
interface TableData {
  headers: string[];
  rows: string[][];
}

function Table({ data }: { data: TableData }) {
  const headers = data.headers.map((header: string, index: number) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row: string[], index: number) => (
    <tr key={index}>
      {row.map((cell: string, cellIndex: number) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = (props.href || "")
    .split("/")
    .map((value) => formatToKebabCase(value))
    .join("/");
  const propsWithoutHref = { ...props };
  delete propsWithoutHref.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...propsWithoutHref} dashed>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

interface RoundedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

function RoundedImage({ className, alt, width, height, ...props }: RoundedImageProps) {
  // If width and height are provided, use Next.js Image for optimization
  if (width && height) {
    return (
      <>
        <Image 
          className={`rounded-lg ${className || ""}`} 
          alt={alt} 
          width={width}
          height={height}
          {...props} 
        />
        <span className="w-fit">{alt}</span>
      </>
    );
  }

  // Otherwise, use regular img tag for external images without dimensions
  return (
    <>
      <img 
        className={`rounded-lg ${className || ""}`} 
        alt={alt} 
        {...props} 
      />
      <span className="w-fit">{alt}</span>
    </>
  );
}

function Code({ children, ...props }: { children: string }) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function Blockquote({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="rounded border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Strong({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="font-bold text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </span>
  );
}

function Em({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="italic text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </span>
  );
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    let id = slug;

    let counter = 1;
    while (ids.includes(id)) {
      id = `${slug}-${counter}`;
      counter++;
    }
    ids.push(id);

    return React.createElement(
      `h${level}`,
      { id: id, className: `target:border-l-2 target:pl-2` },
      [
        React.createElement("a", {
          href: `#${id}`,
          key: `link-${id}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
  blockquote: Blockquote,
  strong: Strong,
  em: Em,
};

export function CustomMDX(
  props: React.JSX.IntrinsicAttributes & MDXRemoteProps
) {
  ids = [];

  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
