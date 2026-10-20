import { demos, registry } from "@ijo/registry";
import Link from "next/link";
import { CommandBlock } from "@/components/site/code-block";
import { PreviewStage } from "@/components/site/preview-stage";
import { ButtonLink, SectionHeader } from "@/components/site/ui";
import { registryUrl, SITE } from "@/lib/site";

/**
 * The home page is the library as a list of numbered, live sections: each component's
 * name, one sentence, and its demo right there. Text renders first; each demo mounts
 * only when its stage scrolls near the screen, so the page stays light on mobile data.
 */
export default function HomePage() {
  const first = registry[0];

  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-8">
      <section className="py-16 md:py-24">
        <h1 className="max-w-[16ch] text-display font-semibold md:text-display-xl">
          Motion for every site, free
        </h1>
        <p className="mt-5 max-w-[60ch] text-body-lg text-text-muted">{SITE.description}</p>
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

      {registry.map((entry, index) => {
        const Demo = demos[entry.meta.name as keyof typeof demos];
        return (
          <section key={entry.meta.name} className="pb-14">
            <SectionHeader
              id={entry.meta.name}
              number={index + 1}
              title={entry.meta.title}
              description={entry.meta.description}
            />
            <PreviewStage minHeight={320}>{Demo ? <Demo /> : null}</PreviewStage>
            <Link
              href={`/library/${entry.meta.name}`}
              className="mt-3 inline-block text-small text-primary-text hover:underline"
            >
              Customise {entry.meta.title} and copy the code
            </Link>
          </section>
        );
      })}

      <section className="pb-24">
        <SectionHeader
          number={registry.length + 1}
          title="Install"
          description="One command, or copy the source straight out of the page."
        />
        <div className="max-w-[640px]">
          <CommandBlock
            command={`npx shadcn@latest add ${registryUrl(first?.meta.name ?? "rise-in")}`}
          />
        </div>
      </section>
    </div>
  );
}
