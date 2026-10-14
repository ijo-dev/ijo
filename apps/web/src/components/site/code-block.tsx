"use client";

import clsx from "clsx";
import { useId, useState } from "react";
import { tokenize } from "@/lib/highlight";
import { FRAMEWORK_LABEL, FRAMEWORKS, type Framework } from "@/lib/snippet";
import { CopyButton } from "./copy-button";

const TOKEN_CLASS: Record<string, string> = {
  "tok-comment": "text-text-faint",
  "tok-string": "text-success",
  "tok-number": "text-ember",
  "tok-keyword": "text-grape-11",
};

function Code({ code }: { code: string }) {
  return (
    <pre className="m-0 overflow-x-auto p-4 font-mono text-code text-text">
      <code>
        {tokenize(code).map((token, index) => (
          <span key={index} className={token.cls ? TOKEN_CLASS[token.cls] : undefined}>
            {token.text}
          </span>
        ))}
      </code>
    </pre>
  );
}

/**
 * The React / Vue / HTML code block. The snippets are passed in already built
 * from the current control values, so the code and the preview never disagree.
 */
export function CodeBlock({
  snippets,
  className,
}: {
  snippets: Record<Framework, string>;
  className?: string;
}) {
  const [active, setActive] = useState<Framework>("react");
  const id = useId();

  return (
    <div
      data-testid="code-block"
      className={clsx("overflow-hidden rounded-lg bg-surface-2 shadow-ring-hairline", className)}
    >
      <div role="tablist" aria-label="Framework" className="flex items-center gap-1 border-b border-border-subtle p-2">
        {FRAMEWORKS.map((framework) => (
          <button
            key={framework}
            role="tab"
            type="button"
            id={`${id}-${framework}`}
            aria-selected={active === framework}
            aria-controls={`${id}-${framework}-panel`}
            onClick={() => setActive(framework)}
            className={clsx(
              "rounded-sm px-3 py-1.5 text-label transition-colors duration-[100ms]",
              active === framework
                ? "bg-surface-5 text-text"
                : "text-text-muted hover:bg-surface-3 hover:text-text"
            )}
          >
            {FRAMEWORK_LABEL[framework]}
          </button>
        ))}
        <CopyButton value={snippets[active]} label="Copy code" className="ml-auto" />
      </div>

      <div role="tabpanel" id={`${id}-${active}-panel`} aria-labelledby={`${id}-${active}`}>
        <Code code={snippets[active]} />
      </div>
    </div>
  );
}

/** A single static snippet, for install commands and docs examples. */
export function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-lg bg-surface-2 py-1 pl-4 pr-1 shadow-ring-hairline">
      <code className="flex-1 overflow-x-auto whitespace-nowrap py-2 font-mono text-code text-text">
        {command}
      </code>
      <CopyButton value={command} label="Copy" />
    </div>
  );
}
