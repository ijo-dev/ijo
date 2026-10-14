"use client";

import type { Control, ControlValues, Controls } from "@ijo/registry";

/**
 * The customize panel. It is generated from the component's controls schema,
 * so every control maps 1:1 to a prop and a new component needs no panel code.
 */
export function ControlPanel({
  controls,
  values,
  onChange,
  onReset,
}: {
  controls: Controls;
  values: ControlValues;
  onChange: (key: string, value: number | string | boolean) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface-2 p-4 shadow-ring-hairline">
      <div className="flex items-baseline justify-between">
        <h3 className="text-label text-text">Customize</h3>
        <button
          type="button"
          onClick={onReset}
          className="rounded-sm px-2 py-1 text-caption text-text-muted hover:bg-surface-3 hover:text-text"
        >
          Reset
        </button>
      </div>

      {Object.entries(controls).map(([key, control]) => (
        <ControlRow
          key={key}
          name={key}
          control={control}
          value={values[key]!}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </div>
  );
}

function ControlRow({
  name,
  control,
  value,
  onChange,
}: {
  name: string;
  control: Control;
  value: number | string | boolean;
  onChange: (value: number | string | boolean) => void;
}) {
  const id = `control-${name}`;

  if (control.kind === "range") {
    const percent = ((Number(value) - control.min) / (control.max - control.min)) * 100;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor={id} className="text-label text-text-muted" title={control.help}>
            {control.label}
          </label>
          <span className="font-mono text-numeric text-grape-11 tabular-nums">
            {Number(value).toFixed(control.step < 0.1 ? 2 : control.step < 1 ? 2 : 0)}
            {control.unit}
          </span>
        </div>
        <input
          id={id}
          type="range"
          className="ij-range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={Number(value)}
          style={{ ["--pct" as string]: `${percent}%` }}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    );
  }

  if (control.kind === "select") {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-label text-text-muted" title={control.help}>
          {control.label}
        </label>
        <select
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 rounded-md border border-border bg-surface-3 px-3 font-mono text-[13px] text-text hover:border-border-strong"
        >
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-label text-text-muted" title={control.help}>
        {control.label}
      </label>
      <input
        id={id}
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-[var(--primary)]"
      />
    </div>
  );
}
