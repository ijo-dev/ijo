import { registryUrl } from "@/lib/site";
import { CommandBlock } from "./code-block";

/**
 * The install command for a component, built from the resolved origin so docs
 * pages never hardcode a hostname. Use it in MDX instead of a fenced block.
 */
export function InstallCommand({ name }: { name: string }) {
  return <CommandBlock command={`npx shadcn@latest add ${registryUrl(name)}`} />;
}
