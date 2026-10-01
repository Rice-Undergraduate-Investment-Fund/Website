import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/images";
import type { Person } from "@/lib/content";
import { cx } from "@/components/ui/layout";

/** Square person photo, or a neutral silhouette placeholder when no photo exists. */
export function PersonPhoto({
  person,
  sizes,
  className,
  large = false,
}: {
  person: Person;
  sizes: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <div className={cx("relative aspect-square w-full overflow-hidden bg-mist", className)}>
      {person.photo ? (
        <Image
          src={person.photo.src}
          alt={person.photo.alt || person.name}
          fill
          sizes={sizes}
          quality={PHOTO_QUALITY}
          className="object-cover"
          style={{ objectPosition: person.photo.position ?? "50% 30%" }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_38%,white,var(--color-mist)_70%)]"
        >
          <svg
            viewBox="0 0 100 100"
            className={cx("absolute inset-x-0 bottom-0 mx-auto text-line", large ? "w-1/2" : "w-3/5")}
          >
            <circle cx="50" cy="40" r="17" fill="currentColor" />
            <path d="M16 100c0-21 15-35 34-35s34 14 34 35z" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function PersonCard({
  person,
  role,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  details,
}: {
  person: Person;
  role?: string;
  sizes?: string;
  details?: (string | undefined)[];
}) {
  return (
    <figure>
      <PersonPhoto person={person} sizes={sizes} />
      <figcaption className="mt-4">
        <p className="font-serif text-lg leading-snug text-ink">{person.name}</p>
        {role && <p className="mt-1 text-sm text-muted">{role}</p>}
        {details?.filter(Boolean).map((d) => (
          <p key={d} className="mt-0.5 text-sm text-muted">
            {d}
          </p>
        ))}
      </figcaption>
    </figure>
  );
}
