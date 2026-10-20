import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* The primitives from design/reference-components.css, as React. Every value
   comes from a token; none of these invent a colour or a size. */

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonBase =
  "inline-flex items-center gap-2 rounded-md font-medium transition-colors duration-[100ms] ease-out disabled:pointer-events-none disabled:opacity-40";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover hover:shadow-glow",
  secondary: "bg-surface-3 text-text shadow-ring-button hover:bg-surface-4",
  ghost: "bg-transparent text-text-muted hover:bg-surface-3 hover:text-text",
};

const buttonSizes = { md: "h-9 px-4 text-[13px]", sm: "h-8 px-3 text-[12px]" };

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: keyof typeof buttonSizes }) {
  return (
    <button
      className={clsx(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: keyof typeof buttonSizes }) {
  return (
    <Link
      className={clsx(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

type BadgeTone = "neutral" | "brand" | "new";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-3 text-text-muted border-border-subtle",
  brand: "bg-grape-3 text-grape-11 border-grape-7",
  new: "bg-ember text-on-signal border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-[2px] text-caption",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The numbered section line the library and home pages are built from:
 * number, title and a one-line description sharing one baseline.
 */
export function SectionHeader({
  number,
  title,
  description,
  id,
}: {
  number: number;
  title: string;
  description: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-3 flex flex-wrap items-baseline gap-2 text-small">
      <span className="font-mono text-caption text-text-faint tabular-nums">
        {String(number).padStart(2, "0")}
      </span>
      <h2 className="font-semibold text-text">{title}</h2>
      <p className="text-text-faint">{description}</p>
    </div>
  );
}

/** A card, demo stage, code block or panel edge: a 1px light ring, never a border. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx("rounded-lg bg-surface-2 shadow-ring-hairline", className)}>
      {children}
    </div>
  );
}
