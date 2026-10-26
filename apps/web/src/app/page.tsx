import { demos, registry } from "@ijo/registry";
import Link from "next/link";
import { CommandBlock } from "@/components/site/code-block";
import { PreviewStage } from "@/components/site/preview-stage";
import { PromptBox } from "@/components/site/prompt-box";
import { SectionHeader } from "@/components/site/ui";
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
      <section className="py-14 md:py-20">
        <p className="mb-5 text-caption uppercase text-text-faint">
          Free · MIT licensed · React, Vue and HTML
        </p>
        <h1 className="max-w-[18ch] text-[32px]/[38px] font-semibold tracking-[-0.03em] sm:text-display md:text-display-xl">
          What do you want to animate?
        </h1>
        <p className="mb-7 mt-5 max-w-[58ch] text-body-lg text-text-muted">
          Describe it in your own words. Ijó finds the motion component and writes the prompt for
          your AI agent. Every component is free, under 3 KB, and fast on mid-range phones.
        </p>
        <PromptBox siteUrl={SITE.url} />
        <p className="mt-6 text-small text-text-faint">
          Or{" "}
          <Link href="/library" className="text-primary-text hover:underline">
            Browse components
          </Link>{" "}
          · {registry.length} in the library ·{" "}
          <Link href="/docs" className="text-text-muted hover:text-text hover:underline">
            Read the docs
          </Link>
        </p>
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
