import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageAsset, Stat, Step } from "@/lib/content";
import { Container, Eyebrow, cx } from "./layout";

/** Full-bleed photo hero with a Rice Blue gradient for legible text. */
export function PhotoHero({
  image,
  eyebrow,
  title,
  children,
  tall = false,
}: {
  image?: ImageAsset;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  tall?: boolean;
}) {
  return (
    <section
      className={cx(
        "relative isolate flex items-end overflow-hidden bg-rice-blue-deep text-white",
        tall ? "min-h-[88svh] sm:min-h-[max(640px,80svh)]" : "min-h-[62svh] sm:min-h-[max(520px,64svh)]",
      )}
    >
      <CoverImage image={image} priority sizes="100vw" className="-z-10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-rice-blue-deep via-rice-blue/70 to-rice-blue/10 sm:bg-gradient-to-r sm:from-rice-blue-deep/95 sm:via-rice-blue/65 sm:to-transparent"
      />
      <Container className="pt-32 pb-14 sm:pb-20">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
          <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
          {children}
        </div>
      </Container>
    </section>
  );
}

/** Solid Rice Blue header band for inner pages without a photo. */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <section className="bg-rice-blue text-white">
      <Container className="py-20 sm:py-28">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 text-pretty">{intro}</p>
        )}
      </Container>
    </section>
  );
}

export function StatRow({ stats, light = false }: { stats: Stat[]; light?: boolean }) {
  return (
    <dl
      className={cx(
        "grid grid-cols-2 gap-y-10 lg:grid-cols-4",
        light ? "divide-white/20" : "divide-line",
      )}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className={cx(
            "border-l pl-5 sm:pl-7",
            light ? "border-white/25" : "border-line",
          )}
        >
          <dd
            className={cx(
              "font-serif text-4xl tabular-nums sm:text-5xl",
              light ? "text-white" : "text-rice-blue",
            )}
          >
            {s.value}
          </dd>
          <dt
            className={cx(
              "mt-2 text-sm font-medium",
              light ? "text-white/75" : "text-slate",
            )}
          >
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/** Numbered process: horizontal on desktop, vertical timeline on mobile. */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-0 lg:auto-cols-fr lg:grid-flow-col lg:gap-6">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
          {/* connector */}
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-12 bottom-0 left-6 w-px bg-line lg:top-6 lg:right-[-1.5rem] lg:bottom-auto lg:left-12 lg:h-px lg:w-auto"
            />
          )}
          <span className="relative z-10 flex size-12 shrink-0 items-center justify-center border border-rice-blue bg-white font-serif text-lg text-rice-blue tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pt-2 lg:pt-6">
            <h3 className="text-xl text-rice-blue">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PillarGrid({ pillars }: { pillars: Step[] }) {
  return (
    <div className="grid border-t border-l border-line md:grid-cols-3">
      {pillars.map((p, i) => (
        <div key={p.title} className="border-r border-b border-line bg-white p-8 sm:p-10">
          <span className="font-serif text-sm text-rice-gray tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-2xl text-rice-blue">{p.title}</h3>
          <p className="mt-3 leading-relaxed text-slate">{p.description}</p>
        </div>
      ))}
    </div>
  );
}

/** Photo that fills its (relatively positioned) parent. Renders nothing if no image is set. */
export function CoverImage({
  image,
  sizes,
  priority = false,
  className,
}: {
  image?: ImageAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!image) return null;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cx("object-cover", className)}
      style={{ objectPosition: image.position ?? "50% 50%" }}
    />
  );
}
