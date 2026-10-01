"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import type { Letter } from "@/lib/content/types";
import { cx } from "@/components/ui/layout";

/**
 * Embedded PDF letter viewer (pdf.js v4: pinned for broad browser support;
 * v5+/v6 rely on very new JS APIs that older Safari/Chrome lack).
 * - Compact panel: one page at a time, arrows to flip, click to expand.
 * - Expanded: full-screen <dialog> with larger pages, keyboard ← → and Esc.
 * - Download button (Sanity file URLs get ?dl= to force a download).
 */
export function LetterViewer({ letter }: { letter: Letter }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Load pdf.js only in the browser, then the document.
  useEffect(() => {
    let cancelled = false;
    let task: { destroy: () => Promise<void> } | null = null;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        const loadingTask = pdfjs.getDocument({ url: letter.url });
        task = loadingTask;
        const loaded = await loadingTask.promise;
        if (cancelled) return;
        setDoc(loaded);
        setPage(1);
      } catch (e) {
        if (cancelled) return;
        console.error("[letter] failed to load PDF:", (e as Error)?.name, (e as Error)?.message);
        setError(true);
      }
    })();
    return () => {
      cancelled = true;
      task?.destroy();
    };
  }, [letter.url]);

  const pages = doc?.numPages ?? 0;
  const go = useCallback(
    (delta: number) => setPage((p) => Math.min(Math.max(1, p + delta), pages || 1)),
    [pages],
  );

  // Open/close the expanded dialog.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (expanded && !d.open) d.showModal();
    if (!expanded && d.open) d.close();
  }, [expanded]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const downloadHref = letter.url.includes("cdn.sanity.io")
    ? `${letter.url}?dl=${encodeURIComponent(letter.filename)}`
    : letter.url;

  if (error) {
    return (
      <div className="flex aspect-[8.5/11] w-full flex-col items-center justify-center gap-4 bg-mist p-8 text-center">
        <p className="text-slate">The letter couldn&apos;t be displayed here.</p>
        <a href={letter.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-rice-blue underline underline-offset-4">
          Open the PDF
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col" onKeyDown={onKey}>
      {/* Compact page */}
      <button
        type="button"
        onClick={() => doc && setExpanded(true)}
        aria-label={`${letter.title}, page ${page} of ${pages || "…"}. Open larger view`}
        className="group relative block aspect-[8.5/11] w-full cursor-zoom-in overflow-hidden bg-mist"
      >
        <PdfPage doc={doc} pageNumber={page} className="p-2 sm:p-3" />
        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 bg-rice-blue/90 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <ExpandIcon /> Expand
        </span>
      </button>

      <Controls
        page={page}
        pages={pages}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        right={
          <>
            <IconButton label="Expand" onClick={() => doc && setExpanded(true)}>
              <ExpandIcon />
            </IconButton>
            <a
              href={downloadHref}
              download={letter.filename}
              className="inline-flex h-10 items-center gap-2 bg-rice-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-rich-blue"
            >
              <DownloadIcon /> <span className="hidden min-[380px]:inline">Download</span>
            </a>
          </>
        }
      />

      {/* Expanded view */}
      <dialog
        ref={dialogRef}
        aria-label={letter.title}
        onCancel={(e) => {
          e.preventDefault();
          setExpanded(false);
        }}
        onClick={(e) => e.target === e.currentTarget && setExpanded(false)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0"
      >
        {expanded && (
          <div className="flex h-full flex-col bg-rice-blue-deep/95 text-white">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
              <p className="truncate font-serif text-lg">{letter.title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={downloadHref}
                  download={letter.filename}
                  className="inline-flex h-10 items-center gap-2 bg-white px-4 text-sm font-semibold text-rice-blue transition-colors hover:bg-mist"
                >
                  <DownloadIcon /> <span className="hidden sm:inline">Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  aria-label="Close"
                  className="flex size-10 items-center justify-center text-white transition-colors hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <PdfPage doc={doc} pageNumber={page} className="p-3 sm:p-6" quality={2} swipe={go} />
              <SideArrow side="left" disabled={page <= 1} onClick={() => go(-1)} />
              <SideArrow side="right" disabled={page >= pages} onClick={() => go(1)} />
            </div>

            <p className="py-3 text-center text-sm text-white/70 tabular-nums">
              Page {page} of {pages} · Use ← → to turn pages
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/** Renders one PDF page onto a canvas, scaled to fit its container. */
function PdfPage({
  doc,
  pageNumber,
  className,
  quality = 1,
  swipe,
}: {
  doc: PDFDocumentProxy | null;
  pageNumber: number;
  className?: string;
  quality?: number;
  swipe?: (delta: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!doc || !size.w || !size.h || !canvasRef.current) return;
    let task: RenderTask | null = null;
    let cancelled = false;
    (async () => {
      const page = await doc.getPage(pageNumber);
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(size.w / base.width, size.h / base.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
      const viewport = page.getViewport({ scale: scale * dpr });
      const canvas = canvasRef.current!;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(base.width * scale)}px`;
      canvas.style.height = `${Math.floor(base.height * scale)}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      task = page.render({ canvasContext: ctx, viewport });
      try {
        await task.promise;
        if (!cancelled) setReady(true);
      } catch {
        /* render cancelled by a newer page */
      }
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, size.w, size.h, quality]);

  return (
    <div
      className={cx("absolute inset-0 flex items-center justify-center", className)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null || !swipe) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) swipe(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div ref={boxRef} className="relative flex h-full w-full items-center justify-center">
        {(!doc || !ready) && (
          <div aria-hidden className="absolute inset-0 m-auto aspect-[8.5/11] max-h-full max-w-full animate-pulse bg-white/70" />
        )}
        <canvas ref={canvasRef} className={cx("relative bg-white shadow-lg shadow-rice-blue-deep/15", !ready && "opacity-0")} />
      </div>
    </div>
  );
}

function Controls({
  page,
  pages,
  onPrev,
  onNext,
  right,
}: {
  page: number;
  pages: number;
  onPrev: () => void;
  onNext: () => void;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
      <div className="flex items-center gap-1">
        <IconButton label="Previous page" onClick={onPrev} disabled={page <= 1}>
          <Chevron dir="left" />
        </IconButton>
        <span className="min-w-20 text-center text-sm text-slate tabular-nums" aria-live="polite">
          {pages ? `${page} / ${pages}` : "Loading…"}
        </span>
        <IconButton label="Next page" onClick={onNext} disabled={!pages || page >= pages}>
          <Chevron dir="right" />
        </IconButton>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-10 items-center justify-center border border-line text-rice-blue transition-colors hover:bg-mist disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function SideArrow({ side, disabled, onClick }: { side: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous page" : "Next page"}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-0 sm:size-14",
        side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6",
      )}
    >
      <Chevron dir={side} className="size-6" />
    </button>
  );
}

const Chevron = ({ dir, className = "size-4" }: { dir: "left" | "right"; className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden>
    <path d={dir === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const ExpandIcon = () => (
  <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
    <path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
