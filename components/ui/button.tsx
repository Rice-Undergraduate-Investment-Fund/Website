import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./layout";

const variants = {
  primary: "bg-rice-blue text-white hover:bg-rich-blue",
  secondary:
    "border border-rice-blue text-rice-blue hover:bg-rice-blue hover:text-white",
  light: "bg-white text-rice-blue hover:bg-mist",
  outlineLight: "border border-white/70 text-white hover:bg-white hover:text-rice-blue",
} as const;

type Props = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  size?: "md" | "sm";
};

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-colors duration-200 ease-out-soft";
const sizes = { md: "h-12 px-6 text-sm", sm: "h-10 px-4 text-sm" };

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: Props & { href: string }) {
  const external = /^https?:\/\//.test(href);
  const cls = cx(base, sizes[size], variants[variant], className);
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * A button that is visible but not clickable (e.g. "Apply Now" while applications are closed).
 * `onDark` styles it for Rice Blue backgrounds.
 */
export function DisabledButton({
  children,
  reason,
  onDark = false,
  size = "md",
  className,
}: {
  children: ReactNode;
  reason: string;
  onDark?: boolean;
  size?: "md" | "sm";
  className?: string;
}) {
  return (
    <span
      role="link"
      aria-disabled="true"
      title={reason}
      className={cx(
        base,
        sizes[size],
        "cursor-not-allowed select-none",
        onDark ? "bg-white/15 text-white/45" : "bg-line text-muted",
        className,
      )}
    >
      {children}
      <span className="sr-only"> ({reason})</span>
    </span>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cx("size-4 transition-transform duration-200 ease-out-soft", className)}
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
