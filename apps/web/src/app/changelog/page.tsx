import { registry } from "@ijo/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What shipped, and when.",
};

export default function ChangelogPage() {
  const entries = [...registry].sort((a, b) => b.meta.added.localeCompare(a.meta.added));

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 md:px-8">
      <h1 className="text-h1 font-semibold">Changelog</h1>
      <p className="mt-2 text-body text-text-muted">A new component every week.</p>

      <ul className="mt-8 flex flex-col gap-4">
        {entries.map((entry) => (
          <li
            key={entry.meta.name}
            className="flex flex-col gap-1 rounded-lg bg-surface-2 p-4 shadow-ring-hairline"
          >
            <div className="flex items-baseline gap-3">
              <time className="font-mono text-caption text-text-faint" dateTime={entry.meta.added}>
                {entry.meta.added}
              </time>
              <span className="text-small font-semibold text-text">{entry.meta.title}</span>
            </div>
            <p className="text-small text-text-muted">{entry.meta.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
