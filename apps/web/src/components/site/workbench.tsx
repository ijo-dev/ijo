"use client";

import { defaultValues, type Controls, type ControlValues, type Meta } from "@ijo/registry";
import { demos } from "@ijo/registry";
import { useMemo, useState } from "react";
import { buildPrompt, buildSnippet, FRAMEWORKS, type Framework } from "@/lib/snippet";
import { CodeBlock } from "./code-block";
import { ControlPanel } from "./control-panel";
import { CopyButton } from "./copy-button";
import { PreviewStage } from "./preview-stage";

/**
 * Preview, customize panel and code, kept in one piece of state so that moving
 * a slider changes the demo and the snippet in the same render.
 */
export function Workbench({
  meta,
  controls,
  siteUrl,
}: {
  meta: Meta;
  controls: Controls;
  siteUrl: string;
}) {
  const initial = useMemo(() => defaultValues(controls), [controls]);
  const [values, setValues] = useState<ControlValues>(initial);
  const [replay, setReplay] = useState(0);

  const Demo = demos[meta.name as keyof typeof demos];

  const snippets = useMemo(
    () =>
      Object.fromEntries(
        FRAMEWORKS.map((framework) => [
          framework,
          buildSnippet(meta, controls, values, framework, meta.demoChildren),
        ])
      ) as Record<Framework, string>,
    [meta, controls, values]
  );

  const set = (key: string, value: number | string | boolean) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    // A changed prop is a new animation; play it so the change is visible.
    setReplay((n) => n + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <PreviewStage replayKey={replay} onReplay={() => setReplay((n) => n + 1)} minHeight={320}>
          {Demo ? <Demo {...(values as Record<string, never>)} /> : null}
        </PreviewStage>

        <ControlPanel
          controls={controls}
          values={values}
          onChange={set}
          onReset={() => {
            setValues(initial);
            setReplay((n) => n + 1);
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <CodeBlock snippets={snippets} />
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton
            variant="secondary"
            label="Copy prompt"
            value={buildPrompt(meta, snippets.react, siteUrl)}
          />
          <p className="text-caption text-text-faint">
            A ready-made instruction for Claude Code, Cursor or any other agent.
          </p>
        </div>
      </div>
    </div>
  );
}
