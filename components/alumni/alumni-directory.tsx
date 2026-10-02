"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALUMNI_INDUSTRIES, RUIF_ROLES, normalizeFirm, type Alumnus, type DirectoryFirm, type Person } from "@/lib/content/types";
import { PersonPhoto } from "@/components/people/person";
import { cx } from "@/components/ui/layout";

const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
const rank = (role?: string) => {
  const i = RUIF_ROLES.indexOf(role as (typeof RUIF_ROLES)[number]);
  return i === -1 ? RUIF_ROLES.length : i;
};
const bySeniority = (a: Alumnus, b: Alumnus) => rank(a.ruifRole) - rank(b.ruifRole) || a.name.localeCompare(b.name);
const byClassThenSeniority = (a: Alumnus, b: Alumnus) => b.classYear - a.classYear || bySeniority(a, b);

type Group = { key: string; label: string; tiers: string[][] };
type Modal = { eyebrow: string; title: string; people: Alumnus[] } | null;

export function AlumniDirectory({ alumni, firms }: { alumni: Alumnus[]; firms: DirectoryFirm[] }) {
  const [mode, setMode] = useState<"class" | "company">("class");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Modal>(null);

  const classes = useMemo(() => [...new Set(alumni.map((a) => a.classYear))].sort((a, b) => b - a), [alumni]);

  // Company view: the home-page structure (tabs → unlabeled tier rows), all at once,
  // listing only firms that have at least one alumnus, plus "Other" for the rest.
  const { groups, peopleByFirm } = useMemo(() => {
    const peopleByFirm = new Map<string, Alumnus[]>();
    for (const a of alumni) {
      if (!a.company) continue;
      const k = normalizeFirm(a.company);
      peopleByFirm.set(k, [...(peopleByFirm.get(k) ?? []), a]);
    }
    const known = new Set(firms.map((f) => normalizeFirm(f.name)));
    const groups: Group[] = ALUMNI_INDUSTRIES.map(({ key, label }) => {
      const inIndustry = firms.filter((f) => f.industry === key && peopleByFirm.has(normalizeFirm(f.name)));
      const tierNums = [...new Set(inIndustry.map((f) => f.tier))].sort((a, b) => a - b);
      const tiers = tierNums.map((t) =>
        inIndustry
          .filter((f) => f.tier === t)
          .map((f) => f.name)
          .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
      );
      return { key, label, tiers };
    });
    const other = new Map<string, string>(); // normalized → first spelling seen
    for (const a of alumni) {
      if (!a.company) continue;
      const k = normalizeFirm(a.company);
      if (!known.has(k) && !other.has(k)) other.set(k, a.company.trim());
    }
    const otherNames = [...other.values()].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    groups.push({ key: "other", label: "Other", tiers: otherNames.length ? [otherNames] : [] });
    return { groups: groups.filter((g) => g.tiers.length), peopleByFirm };
  }, [alumni, firms]);

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return [];
    return alumni.filter((a) => fold(a.name).includes(q)).sort(byClassThenSeniority);
  }, [alumni, query]);

  const openClass = (year: number) =>
    setModal({ eyebrow: "Alumni", title: `Class of ${year}`, people: alumni.filter((a) => a.classYear === year).sort(bySeniority) });
  const openFirm = (name: string, label: string) =>
    setModal({ eyebrow: label, title: name, people: [...(peopleByFirm.get(normalizeFirm(name)) ?? [])].sort(byClassThenSeniority) });

  if (!alumni.length) {
    return <p className="border-t border-line pt-8 text-slate">No alumni have been added yet.</p>;
  }

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.2em] text-slate uppercase">Browse by</span>
          <div role="tablist" aria-label="Browse by" className="inline-flex border border-rice-blue">
            {(["class", "company"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m && !query}
                onClick={() => {
                  setMode(m);
                  setQuery("");
                }}
                className={cx(
                  "h-10 px-5 text-sm font-semibold transition-colors",
                  mode === m && !query ? "bg-rice-blue text-white" : "text-rice-blue hover:bg-mist",
                )}
              >
                {m === "class" ? "Class" : "Company"}
              </button>
            ))}
          </div>
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search by name</span>
          <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-rice-gray" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="h-10 w-full border border-line bg-white pr-3 pl-9 text-sm text-ink placeholder:text-rice-gray focus:border-rice-blue focus:ring-1 focus:ring-rice-blue focus:outline-none"
          />
        </label>
      </div>

      {/* Search results */}
      {query.trim() ? (
        <div className="mt-8">
          {results.length ? (
            <ul className="divide-y divide-line border-y border-line">
              {results.map((a) => (
                <li key={a.id}>
                  <ProfileRow a={a} showClass />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate">No alumni match “{query.trim()}”.</p>
          )}
        </div>
      ) : mode === "class" ? (
        /* By class */
        <ul className="mt-10 grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-4">
          {classes.map((y) => (
            <li key={y} className="border-r border-b border-line">
              <button
                type="button"
                onClick={() => openClass(y)}
                aria-haspopup="dialog"
                className="group flex h-36 w-full flex-col items-center justify-center bg-white transition-colors hover:bg-mist sm:h-40"
              >
                <span className="text-xs font-semibold tracking-[0.2em] text-slate uppercase">Class of</span>
                <span className="mt-2 font-serif text-4xl text-rice-blue tabular-nums sm:text-5xl">{y}</span>
                <span className="mt-3 text-xs font-semibold text-rice-blue opacity-0 transition-opacity group-hover:opacity-100">
                  View class →
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        /* By company */
        <div className="mt-10 space-y-14">
          {groups.map((g) => (
            <section key={g.key} aria-label={g.label}>
              <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">
                <span aria-hidden className="h-px w-8 bg-rice-blue" />
                {g.label}
              </p>
              <div className="mt-4 divide-y divide-line border-t border-line">
                {g.tiers.map((row, r) => (
                  <ul key={r} className="flex flex-wrap justify-center gap-x-10 gap-y-4 py-7 sm:gap-x-14">
                    {row.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          onClick={() => openFirm(name, g.label)}
                          aria-haspopup="dialog"
                          className="font-serif text-lg whitespace-nowrap text-rice-blue decoration-1 underline-offset-[6px] transition-colors hover:underline sm:text-2xl"
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <DirectoryModal modal={modal} onClose={() => setModal(null)} showClass={modal?.eyebrow !== "Alumni"} />
    </>
  );
}

/** Scrollable list of profiles for one class or one firm. */
function DirectoryModal({ modal, onClose, showClass }: { modal: Modal; onClose: () => void; showClass: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (modal && !d.open) d.showModal();
    if (!modal && d.open) d.close();
    scrollRef.current?.scrollTo({ top: 0 });
  }, [modal]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="directory-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto h-dvh max-h-dvh w-full max-w-none bg-transparent p-0 open:animate-[modal-in_240ms_var(--ease-out-soft)] sm:h-auto sm:max-h-[min(90dvh,900px)] sm:w-[calc(100%-3rem)] sm:max-w-[52rem]"
    >
      {modal && (
        <div className="flex h-full max-h-[inherit] flex-col bg-white shadow-2xl shadow-rice-blue-deep/40">
          <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate uppercase">{modal.eyebrow}</p>
              <h2 id="directory-modal-title" className="mt-2 text-3xl leading-tight text-rice-blue sm:text-4xl">
                {modal.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 flex size-10 shrink-0 items-center justify-center text-rice-blue transition-colors hover:bg-mist"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8">
            <ul className="divide-y divide-line">
              {modal.people.map((a) => (
                <li key={a.id}>
                  <ProfileRow a={a} showClass={showClass} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </dialog>
  );
}

function ProfileRow({ a, showClass = false }: { a: Alumnus; showClass?: boolean }) {
  const asPerson = { id: a.id, name: a.name, photo: a.photo, status: "alumni" } as Person;
  const role = [a.ruifRole, a.ruifSector].filter(Boolean).join(", ");
  const job = [a.position, a.company].filter(Boolean).join(" · ");
  return (
    <article className="flex gap-5 py-6 sm:gap-8 sm:py-7">
      <div className="w-24 shrink-0 sm:w-40">
        <PersonPhoto person={asPerson} portrait sizes="(min-width: 640px) 160px, 96px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="font-serif text-xl leading-snug text-ink sm:text-[1.75rem]">{a.name}</h3>
        {job && <p className="mt-1.5 text-ink sm:text-lg">{job}</p>}
        {a.location && <p className="mt-0.5 text-sm text-muted sm:text-base">{a.location}</p>}
        {(role || showClass) && (
          <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-rice-blue uppercase sm:mt-4">
            {[role || null, showClass ? `Class of ${a.classYear}` : null].filter(Boolean).join(" · ")}
          </p>
        )}
        {(a.linkedin || a.email) && (
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
            {a.linkedin && (
              <a
                href={a.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 bg-rice-blue px-4 text-xs font-semibold text-white transition-colors hover:bg-rich-blue"
              >
                <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.3 21 14.7V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z" />
                </svg>
                LinkedIn
              </a>
            )}
            {a.email && (
              <a
                href={`mailto:${a.email}`}
                className="inline-flex h-9 max-w-full items-center gap-2 border border-rice-blue px-4 text-xs font-semibold text-rice-blue transition-colors hover:bg-rice-blue hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" />
                  <path d="M3 6l9 7 9-7" />
                </svg>
                <span className="truncate">{a.email}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
