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
      <Link href={href} {...propsWithoutHref} underlined dashed>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <Link href={href} {...propsWithoutHref} underlined dashed>
        {props.children}
      </Link>
    );
  }

  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...propsWithoutHref}
      dashed
    >
      {props.children}
    </Link>
  );
}

interface RoundedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

function RoundedImage({ className, alt, ...props }: RoundedImageProps) {
  return (
    <Image className={`rounded-lg ${className || ""}`} alt={alt} {...props} />
  );
}

function Code({ children, ...props }: { children: string }) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
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
  a: CustomLink,
  code: Code,
  Table,
  // Add one for the "> "
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
