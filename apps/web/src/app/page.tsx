import { registry } from "@ijo/registry";
import { CommandBlock } from "@/components/site/code-block";
import { ComponentCard } from "@/components/site/component-card";
import { PreviewStage } from "@/components/site/preview-stage";
import { ButtonLink, SectionHeader } from "@/components/site/ui";
import { registryUrl, SITE } from "@/lib/site";
import { demos } from "@ijo/registry";

export default function HomePage() {
  const first = registry[0];
  const Demo = first ? demos[first.meta.name as keyof typeof demos] : undefined;

  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-8">
      <section className="py-16 md:py-24">
        <h1 className="max-w-[16ch] text-display font-semibold md:text-display-xl">
          Motion for every site, free
        </h1>
        <p className="mt-5 max-w-[60ch] text-body-lg text-text-muted">
          {SITE.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href="/library" variant="primary">
            Browse components
          </ButtonLink>
          <ButtonLink href="/docs">Read the docs</ButtonLink>
          <span className="text-small text-text-faint">
            {registry.length} component{registry.length === 1 ? "" : "s"} · MIT licensed
          </span>
        </div>
      </section>

      {first && Demo ? (
        <section className="pb-16">
          <SectionHeader
            number={1}
            title={first.meta.title}
            description={first.meta.description}
          />
          <PreviewStage minHeight={300}>
            <Demo />
          </PreviewStage>
        </section>
      ) : null}

      <section className="pb-16">
        <SectionHeader
          number={2}
          title="Install"
          description="One command, or copy the source straight out of the page."
        />
        <div className="max-w-[640px]">
          <CommandBlock
            command={`npx shadcn@latest add ${registryUrl(first?.meta.name ?? "rise-in")}`}
          />
        </div>
      </section>

      <section className="pb-24">
        <SectionHeader
          number={3}
          title="The library"
          description="Every component with its size, category and a preview that plays on hover."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {registry.map((entry) => (
            <ComponentCard key={entry.meta.name} meta={entry.meta} />
          ))}
        </div>
      </section>
    </div>
  );
}
