"use client";

import { defaultValues, demos, registry } from "@ijo/registry";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useId, useMemo, useRef, useState } from "react";
import { CopyButton } from "./copy-button";
import { match, SUGGESTIONS } from "@/lib/match";
import { buildPrompt, buildSnippet } from "@/lib/snippet";

gsap.registerPlugin(useGSAP);

const items = registry.map((entry) => entry.meta);

/** The prompt for the visitor's own AI agent, opening with what they asked for. */
function promptFor(name: string, request: string, siteUrl: string) {
  const entry = registry.find((e) => e.meta.name === name);
  if (!entry) return "";
  const snippet = buildSnippet(
    entry.meta,
    entry.controls,
    defaultValues(entry.controls),
    "react",
    entry.meta.demoChildren,
  );
  return [`What I want: ${request.trim()}`, "", buildPrompt(entry.meta, snippet, siteUrl)].join(
    "\n",
  );
}

/**
 * "What do you want to animate?" Type it in your own words; the best component
 * appears live beside a "Copy prompt" for your AI agent. Matching runs in the
 * browser from each component's name, tags and everyday phrases, so it is instant
 * on slow data and nothing is sent anywhere. The panel says so, the way Fey labels
 * what produced each summary.
 */
export function PromptBox({ siteUrl }: { siteUrl: string }) {
  const id = useId();
  const scope = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [request, setRequest] = useState("");
  const deferred = useDeferredValue(request);
  const results = useMemo(() => match(deferred, items), [deferred]);
  const best = results[0];
  const others = results.slice(1, 3);
  const asked = deferred.trim().length > 0;

  // The answer settles in from just below, so you can see it is new.
  useGSAP(
    () => {
      if (!asked) return;
      gsap.from("[data-answer]", {
        y: 8,
        opacity: 0,
        duration: 0.35,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { scope, dependencies: [best?.meta.name ?? "", asked] },
  );

  const Demo = best ? demos[best.meta.name as keyof typeof demos] : undefined;

  return (
    <div ref={scope} className="w-full max-w-[720px]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          document.getElementById(`${id}-answer`)?.focus();
        }}
        className="flex items-end gap-2 rounded-xl bg-surface-1 p-2 pl-4 shadow-ring-hairline transition-shadow focus-within:shadow-[0_0_0_1px_var(--grape-8)]"
      >
        <label htmlFor={`${id}-input`} className="sr-only">
          Describe the animation you want
        </label>
        <textarea
          ref={input}
          id={`${id}-input`}
          rows={2}
          value={request}
          onChange={(event) => setRequest(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Describe it in your own words, e.g. pricing cards that pile up"
          className="demo-frame min-h-[52px] flex-1 resize-none bg-transparent py-2 text-[15px]/[22px] text-text outline-none placeholder:text-text-faint"
        />
        <button
          type="submit"
          aria-label="Find a component"
          className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-on-primary transition-colors hover:bg-primary-hover"
        >
          <ArrowUp size={16} strokeWidth={2} aria-hidden />
        </button>
      </form>

      {!asked ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setRequest(suggestion);
                input.current?.focus();
              }}
              className="rounded-full bg-surface-1 px-3 py-1.5 text-[12px] text-text-muted shadow-ring-hairline transition-colors hover:bg-surface-2 hover:text-text"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <div aria-live="polite">
        {asked && best ? (
          <section
            data-answer
            id={`${id}-answer`}
            tabIndex={-1}
            aria-label={`Best match: ${best.meta.title}`}
            className="mt-3 grid overflow-hidden rounded-xl bg-surface-1 p-1.5 shadow-ring-hairline outline-none md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          >
            <div
              inert
              className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-bg shadow-ring-hairline"
            >
              <div className="demo-frame pointer-events-none w-full origin-center scale-[0.8]">
                {Demo ? <Demo key={best.meta.name} /> : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 md:pl-5">
              <p className="text-[11px] text-text-faint">Best match · {best.meta.category}</p>
              <div>
                <h2 className="text-[20px]/[26px] font-semibold tracking-[-0.02em] text-text">
                  {best.meta.title}
                </h2>
                <p className="mt-1 text-[13px]/[20px] text-text-muted">{best.meta.description}</p>
              </div>
              <p className="text-[12px]/[18px] text-text-faint">
                Found by{" "}
                {best.because.slice(0, 3).map((word, index) => (
                  <span key={word}>
                    {index ? ", " : ""}
                    <span className="text-primary-text">“{word}”</span>
                  </span>
                ))}
                .
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <CopyButton
                  variant="primary"
                  label="Copy prompt"
                  value={promptFor(best.meta.name, deferred, siteUrl)}
                />
                <Link
                  href={`/library/${best.meta.name}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-[13px] text-text-muted shadow-ring-hairline transition-colors hover:bg-surface-2 hover:text-text"
                >
                  Customise it
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
              <p className="border-t border-border-subtle pt-3 text-[11px]/[16px] text-text-faint">
                Matched in your browser from {items.length} components. No AI, nothing sent. Paste
                the prompt into Claude Code, Cursor or any agent.
              </p>
            </div>
          </section>
        ) : null}

        {asked && best && others.length ? (
          <p data-answer className="mt-3 text-[12px] text-text-faint">
            Also close:{" "}
            {others.map((other, index) => (
              <span key={other.meta.name}>
                {index ? ", " : ""}
                <Link
                  href={`/library/${other.meta.name}`}
                  className="text-text-muted underline-offset-2 hover:text-text hover:underline"
                >
                  {other.meta.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        {asked && !best ? (
          <div
            data-answer
            className="mt-3 rounded-xl bg-surface-1 px-5 py-6 text-[13px] shadow-ring-hairline"
          >
            <p className="text-text">Nothing in the library fits “{deferred.trim()}” yet.</p>
            <p className="mt-1 text-[12px] text-text-faint">
              Try naming the thing that moves, like “cards”, “menu”, “heading” or “logos”, or{" "}
              <Link href="/library" className="text-primary-text hover:underline">
                browse all {items.length}
              </Link>
              .
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
