import type { ReactNode } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
export { cx };

export function Container({
  children,
  className,
  size = "wide",
}: {
  children: ReactNode;
  className?: string;
  size?: "wide" | "narrow";
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-5 sm:px-8",
        size === "wide" ? "max-w-7xl" : "max-w-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

const tones = {
  white: "bg-white",
  mist: "bg-mist",
  blue: "bg-rice-blue text-white",
} as const;

export function Section({
  children,
  tone = "white",
  className,
  id,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cx("py-20 sm:py-28", tones[tone], className)}>
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={cx(
        "flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase",
        light ? "text-white/80" : "text-rice-blue",
      )}
    >
      <span
        aria-hidden
        className={cx("h-px w-8", light ? "bg-white/60" : "bg-rice-blue")}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center [&>p:first-child]:justify-center",
      )}
    >
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={cx(
          "mt-4 text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]",
          light ? "text-white" : "text-rice-blue",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cx(
            "mt-5 text-lg leading-relaxed text-pretty",
            light ? "text-white/80" : "text-slate",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

/** Small label shown on draft content that uses illustrative data. */
export function SampleNote({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-slate">
      <span aria-hidden className="size-1.5 rounded-full bg-rice-gray" />
      {children ?? "Illustrative data: to be replaced"}
    </span>
  );
}
