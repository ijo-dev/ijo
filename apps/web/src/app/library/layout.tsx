import { registry } from "@ijo/registry";
import { LibrarySidebar } from "@/components/site/library-sidebar";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1200px] gap-8 px-4 md:px-8">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 lg:block">
        <LibrarySidebar items={registry.map((entry) => entry.meta)} />
      </aside>
      <div className="min-w-0 flex-1 py-8">{children}</div>
    </div>
  );
}
