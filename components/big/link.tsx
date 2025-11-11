import React from "react";
import LinkPrimitive from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@/lib/utils";

// Discriminated union for the desired behavior:
type LinkWithUnderline = {
  underlined?: true;
  dashed?: boolean;
  onlyOnHover?: boolean;
  className?: string;
};

type LinkWithoutUnderline = {
  underlined: false;
  dashed?: never;
  onlyOnHover?: never;
  className?: string;
};

// Final LinkProps type (combines Next.js Link props + children + the discriminated union)
export type LinkProps = NextLinkProps & {
  children: React.ReactNode;
} & (LinkWithUnderline | LinkWithoutUnderline);

export function Link({
  children,
  underlined = true,
  dashed = false,
  onlyOnHover = false,
  className,
  ...props
}: LinkProps) {
  return (
    <LinkPrimitive
      {...props}
      className={cn(
        "duration-1000 transition-all underline-offset-6 lg:hover:text-black dark:lg:hover:text-white decoration-neutral-400 lg:hover:decoration-neutral-600 dark:decoration-neutral-600 dark:lg:hover:decoration-neutral-400",
        underlined ? (onlyOnHover ? "lg:hover:underline" : "underline") : "",
        dashed ? "decoration-dashed" : "",
        className
      )}
    >
      {children}
    </LinkPrimitive>
  );
}
