"use client";

import { demos, registry } from "@ijo/registry";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Release } from "@/content/releases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DAY = 86_400_000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** Height of the desktop ruler in px; the playhead travels this far. */
const RULER = 320;
/** Ticks per day, so the ruler reads like a ruler rather than a list. */
const STEPS = 4;

const at = (iso: string) => new Date(`${iso}T12:00:00Z`).getTime();
const day = (time: number) => new Date(time).getUTCDate();
const monthYear = (time: number) =>
  `${MONTHS[new Date(time).getUTCMonth()]} ${new Date(time).getUTCFullYear()}`;
const short = (time: number) => `${day(time)} ${MONTHS[new Date(time).getUTCMonth()]}`;

function isoWeek(time: number) {
  const d = new Date(time);
  const weekday = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - weekday);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - start) / DAY + 1) / 7);
}

const titleOf = (name: string) =>
  registry.find((entry) => entry.meta.name === name)?.meta.title ?? name;

/**
 * The changelog as a reel you scroll back through.
 *
 * A ruler of days stays pinned beside the releases. As you scroll, a purple
 * playhead travels down it from today into the past, the ticks it passes swell,
 * the big date rolls to the release you are reading, and the others dim. The
 * motion answers one question: where in time am I? Under reduced motion the date
 * and playhead jump instead of travelling.
 */
export function TimeReel({ releases }: { releases: Release[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const previous = useRef(0);

  const newest = at(releases[0]?.date ?? "2026-01-01");
  const oldest = at(releases[releases.length - 1]?.date ?? "2026-01-01");
  const span = Math.max(1, Math.round((newest - oldest) / DAY));
  const fraction = (iso: string) => Math.round((newest - at(iso)) / DAY) / span;
  const stops = releases.map((release) => fraction(release.date));
  const ticks = Array.from({ length: span * STEPS + 1 }, (_, i) => i / (span * STEPS));
  // One label per release day, even when two releases share a day.
  const marked = new Map<number, string>();
  for (const release of releases) {
    const f = fraction(release.date);
    if (!marked.has(f)) marked.set(f, release.date);
  }

  // Follow the scroll: move the playhead and swell the ticks near it.
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const tickEls = gsap.utils.toArray<HTMLElement>("[data-tick]", root);
      const heads = gsap.utils.toArray<HTMLElement>("[data-playhead]", root);
      const place = (p: number) => {
        for (const head of heads) head.style.setProperty("--p", p.toFixed(4));
        for (const tick of tickEls) {
          const days = Math.abs(Number(tick.dataset.f) - p) * span;
          tick.style.setProperty("--boost", Math.max(0, 1 - days / 1.25).toFixed(3));
        }
      };
      place(0);

      gsap.utils.toArray<HTMLElement>("[data-entry]", root).forEach((entry, index) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            setActive(index);
            setSeen((set) => (set.has(index) ? set : new Set(set).add(index)));
          },
          onUpdate: (self) => {
            const from = stops[index] ?? 0;
            const to = stops[index + 1] ?? from;
            place(from + (to - from) * self.progress);
          },
        });
      });
    },
    { scope },
  );

  // Roll the big date: further back in time comes up from below, forward from above.
  const { contextSafe } = useGSAP({ scope });
  const roll = contextSafe((direction: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      "[data-date-now]",
      { yPercent: 70 * direction, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.45, ease: "expo.out", overwrite: true },
    );
  });
  useEffect(() => {
    if (previous.current === active) return;
    roll(active > previous.current ? 1 : -1);
    previous.current = active;
  }, [active, roll]);

  const now = at(releases[active]?.date ?? releases[0]?.date ?? "2026-01-01");
  const jump = (iso: string) => {
    const index = releases.findIndex((release) => release.date === iso);
    document.getElementById(`release-${index}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div ref={scope} className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
      {/* Desktop: the date and a vertical ruler, pinned. */}
      <aside className="hidden lg:block" aria-hidden>
        <div className="sticky top-24">
          <div className="overflow-hidden">
            <div data-date-now>
              <div className="text-[64px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-text">
                {String(day(now)).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[12px] text-text-muted">
                {monthYear(now)} · Week {isoWeek(now)}
              </div>
            </div>
          </div>

          <div className="relative mt-10" style={{ height: RULER }}>
            {ticks.map((f) => {
              const step = Math.round(f * span * STEPS);
              const kind = step % (STEPS * 7) === 0 ? "week" : step % STEPS === 0 ? "day" : "minor";
              return (
                <span
                  key={f}
                  data-tick
                  data-f={f}
                  style={{ top: `${f * 100}%` }}
                  className={clsx(
                    "tick absolute left-0 h-px origin-left transition-[transform,background-color] duration-150 [transform:scaleX(calc(1+var(--boost,0)*1.6))]",
                    kind === "week" ? "w-7" : kind === "day" ? "w-4" : "w-2",
                  )}
                />
              );
            })}
            {[...marked].map(([f, iso]) => (
              <button
                key={iso}
                type="button"
                tabIndex={-1}
                onClick={() => jump(iso)}
                style={{ top: `${f * 100}%` }}
                className="absolute left-[72px] -translate-y-1/2 text-[11px] tabular-nums text-text-faint transition-colors hover:text-text"
              >
                {short(at(iso))}
              </button>
            ))}
            {/* The marker: a pointer on the edge and a long line, like a needle on a dial. */}
            <span
              data-playhead
              className="pointer-events-none absolute left-0 top-0 flex items-center [transform:translateY(calc(var(--p,0)*320px))]"
            >
              <span className="-translate-y-1/2 border-y-[5px] border-l-[7px] border-y-transparent border-l-grape-9" />
              <span className="h-0.5 w-14 -translate-y-1/2 bg-grape-9" />
            </span>
          </div>
        </div>
      </aside>

      {/* Phones and tablets: a slim bar with the date and a sideways ruler. */}
      <div
        aria-hidden
        className="sticky top-14 z-10 -mx-4 mb-8 flex items-center gap-4 border-b border-border-subtle bg-bg px-4 py-3 md:-mx-8 md:px-8 lg:hidden"
      >
        <div className="shrink-0 text-[12px] tabular-nums text-text">
          {short(now)} <span className="text-text-faint">· Wk {isoWeek(now)}</span>
        </div>
        <div className="relative h-5 flex-1">
          {ticks.map((f) => {
            const major = Math.round(f * span * STEPS) % STEPS === 0;
            return (
              <span
                key={f}
                data-tick
                data-f={f}
                style={{ left: `${f * 100}%` }}
                className={clsx(
                  "tick absolute bottom-0 w-px origin-bottom transition-[transform,background-color] duration-150 [transform:scaleY(calc(1+var(--boost,0)*1.4))]",
                  major ? "h-2.5" : "h-1.5",
                )}
              />
            );
          })}
          <span
            data-playhead
            className="absolute -bottom-1 top-[-6px] w-0.5 -translate-x-1/2 bg-grape-9 [left:calc(var(--p,0)*100%)]"
          />
        </div>
      </div>

      <ol className="flex flex-col gap-20 pb-[40vh]">
        {releases.map((release, index) => {
          const time = at(release.date);
          return (
            <li
              key={`${release.date}-${release.title}`}
              id={`release-${index}`}
              data-entry
              className={clsx(
                "scroll-mt-28 transition-opacity duration-300 motion-reduce:transition-none",
                index === active ? "opacity-100" : "opacity-40",
              )}
            >
              <div className="flex items-center gap-2 text-[12px] text-text-faint">
                <time dateTime={release.date}>
                  {short(time)} {new Date(time).getUTCFullYear()}
                </time>
                <span aria-hidden>·</span>
                <span>Week {isoWeek(time)}</span>
                {index === 0 ? <span className="text-primary-text">· Latest</span> : null}
              </div>
              <h2 className="mt-2 text-[24px]/[30px] font-semibold tracking-[-0.02em] text-text">
                {release.title}
              </h2>
              <p className="mt-3 max-w-[62ch] text-[14px]/[22px] text-text-muted">
                {release.summary}
              </p>

              {release.visual === "canvas" ? <CanvasVisual /> : null}
              {release.components?.length ? (
                <div
                  className={clsx(
                    "mt-6 grid gap-3",
                    release.components.length > 1 && "sm:grid-cols-3",
                  )}
                >
                  {release.components.map((name) => (
                    <Preview
                      key={name}
                      name={name}
                      play={seen.has(index)}
                      wide={release.components?.length === 1}
                    />
                  ))}
                </div>
              ) : null}

              <ul className="mt-6 flex max-w-[62ch] flex-col gap-2.5">
                {release.changes.map((change) => (
                  <li key={change} className="flex gap-3 text-[13px]/[21px] text-text-muted">
                    <span
                      aria-hidden
                      className="mt-[8px] size-1 shrink-0 rounded-full bg-grape-9"
                    />
                    {change}
                  </li>
                ))}
              </ul>

              {release.more?.length ? (
                <p className="mt-4 max-w-[62ch] text-[13px]/[21px] text-text-faint">
                  Also shipped:{" "}
                  {release.more.map((name, i) => (
                    <span key={name}>
                      {i ? ", " : ""}
                      <Link
                        href={`/library/${name}`}
                        className="text-text-muted underline-offset-2 hover:text-text hover:underline"
                      >
                        {titleOf(name)}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** A live preview of a component that shipped, linking to its page. */
function Preview({ name, play, wide }: { name: string; play: boolean; wide: boolean }) {
  const Demo = demos[name as keyof typeof demos];
  return (
    <Link
      href={`/library/${name}`}
      className="group block rounded-xl bg-surface-1 p-1.5 shadow-ring-hairline transition-colors duration-150 hover:bg-surface-2"
    >
      <div
        inert
        className={clsx(
          "flex items-center justify-center overflow-hidden rounded-lg bg-bg shadow-ring-hairline",
          wide ? "aspect-[16/7]" : "aspect-[4/3]",
        )}
      >
        <div
          className={clsx(
            "demo-frame pointer-events-none w-full origin-center",
            wide ? "scale-90" : "scale-[0.62]",
          )}
        >
          {Demo ? <Demo key={play ? "play" : "poster"} duration={play ? undefined : 0} /> : null}
        </div>
      </div>
      <div className="px-2 pb-1 pt-2.5 text-[12px] text-text-muted group-hover:text-text">
        {titleOf(name)}
      </div>
    </Link>
  );
}

/** Before and after for the darker canvas: the same purple button on each. */
function CanvasVisual() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {[
        { label: "Before", hex: "#17161b" },
        { label: "After", hex: "#0b0a0e" },
      ].map((swatch) => (
        <figure key={swatch.hex} className="rounded-xl bg-surface-1 p-1.5 shadow-ring-hairline">
          <div
            className="flex aspect-[16/9] items-center justify-center rounded-lg shadow-ring-hairline"
            style={{ background: swatch.hex }}
          >
            <span className="demo-frame rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-on-primary">
              Add to cart
            </span>
          </div>
          <figcaption className="flex justify-between px-2 pb-1 pt-2.5 text-[12px]">
            <span className="text-text-muted">{swatch.label}</span>
            <span className="tabular-nums text-text-faint">{swatch.hex}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
