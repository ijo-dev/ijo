import { byName, registry, type Control } from "@ijo/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommandBlock } from "@/components/site/code-block";
import { Badge } from "@/components/site/ui";
import { Workbench } from "@/components/site/workbench";
import { registryUrl, SITE } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

/** Every component page is generated at build time; none needs a server at runtime. */
export function generateStaticParams() {
  return registry.map((entry) => ({ slug: entry.meta.name }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = byName(slug);
  if (!entry) return {};
  return { title: entry.meta.title, description: entry.meta.description };
}

const PACKAGE_MANAGERS = [
  { label: "npm", command: "npx shadcn@latest add" },
  { label: "pnpm", command: "pnpm dlx shadcn@latest add" },
  { label: "yarn", command: "yarn dlx shadcn@latest add" },
  { label: "bun", command: "bunx --bun shadcn@latest add" },
];

const typeOf = (control: Control) =>
  control.kind === "range" ? "number" : control.kind === "switch" ? "boolean" : "string";

const defaultOf = (control: Control) =>
  typeof control.default === "string" ? `"${control.default}"` : String(control.default);

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params;
  const entry = byName(slug);
  if (!entry) notFound();

  const { meta, controls } = entry;

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-h1 font-semibold">{meta.title}</h1>
          <Badge tone="brand">{meta.category}</Badge>
          {meta.sizeGzip ? (
            <Badge>{(meta.sizeGzip / 1024).toFixed(1)} KB gzipped</Badge>
          ) : null}
        </div>
        <p className="max-w-[60ch] text-body-lg text-text-muted">{meta.description}</p>
      </header>

      <Workbench meta={meta} controls={controls} siteUrl={SITE.url} />

      <section>
        <h2 className="text-h3 font-semibold">Dependencies</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {meta.dependencies.map((dependency) => (
            <li key={dependency}>
              <code className="rounded-xs bg-surface-3 px-1.5 py-0.5 font-mono text-[13px] font-medium">
                {dependency}
              </code>
            </li>
          ))}
          {meta.plugins.length === 0 ? (
            <li className="text-small text-text-faint">No GSAP plugins.</li>
          ) : (
            meta.plugins.map((plugin) => (
              <li key={plugin}>
                <code className="rounded-xs bg-surface-3 px-1.5 py-0.5 font-mono text-[13px] font-medium">
                  {plugin}
                </code>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-h3 font-semibold">How it behaves</h2>
        <p className="mt-2 max-w-[70ch] text-body text-text-muted">{meta.behaviour}</p>
      </section>

      <section>
        <h2 className="text-h3 font-semibold">Props</h2>
        <div className="mt-3 overflow-x-auto rounded-lg bg-surface-2 shadow-ring-hairline">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-border-subtle text-text">
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Default</th>
                <th className="px-4 py-3 text-left font-semibold">When you&rsquo;d use it</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(controls).map(([name, control]) => (
                <tr key={name} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3 font-mono text-[13px] text-grape-11">{name}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-muted">
                    {typeOf(control)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-muted">
                    {defaultOf(control)}
                  </td>
                  <td className="max-w-[46ch] px-4 py-3 text-text-muted">{control.help}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-h3 font-semibold">Install</h2>
        <div className="mt-3 flex max-w-[640px] flex-col gap-2">
          {PACKAGE_MANAGERS.map((manager) => (
            <div key={manager.label} className="flex items-center gap-3">
              <span className="w-10 shrink-0 font-mono text-caption text-text-faint">
                {manager.label}
              </span>
              <div className="min-w-0 flex-1">
                <CommandBlock command={`${manager.command} ${registryUrl(meta.name)}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
