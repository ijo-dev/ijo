import type { Metadata } from "next";
import { TimeReel } from "@/components/site/time-reel";
import { releases } from "@/content/releases";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Everything that shipped in Ijó, newest first.",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-12 md:px-8 lg:pt-16">
      <header className="mb-10 lg:mb-16 lg:ml-[256px]">
        <p className="text-[12px] text-text-faint">Changelog</p>
        <h1 className="mt-2 max-w-[20ch] text-[32px]/[38px] font-semibold tracking-[-0.03em] text-text md:text-[44px]/[48px]">
          Scroll back through everything we shipped
        </h1>
        <p className="mt-4 max-w-[56ch] text-[14px]/[22px] text-text-muted">
          A new component every week. The newest release is at the top; the ruler shows where you
          are in time.
        </p>
      </header>
      <TimeReel releases={releases} />
    </div>
  );
}
