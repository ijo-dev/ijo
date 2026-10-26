import { registry } from "@ijo/registry";
import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/site/library-browser";

export const metadata: Metadata = {
  title: "Library",
  description: "Every Ijó motion component, with its size, category and a live preview.",
};

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px]/[38px] font-semibold tracking-[-0.03em] text-text">Library</h1>
        <p className="mt-2 max-w-[60ch] text-[14px]/[22px] text-text-muted">
          {registry.length} motion components for React, Vue and HTML, each under 3 KB. Hover a card
          to see it move; open one to change its props and copy the code.
        </p>
      </div>
      <LibraryBrowser items={registry.map((entry) => entry.meta)} />
    </div>
  );
}
