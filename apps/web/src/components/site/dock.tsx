"use client";

import clsx from "clsx";
import { BookOpen, History, House, LayoutGrid, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home", icon: House },
  { href: "/library", label: "Library", icon: LayoutGrid },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/changelog", label: "Changelog", icon: History },
];

/** Opens the ⌘K search from anywhere, without sharing state through context. */
export const openSearch = () => window.dispatchEvent(new Event("ijo:open-search"));

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Navigation for phones: a floating dock at the bottom, in thumb reach, after
 * Fey. Wider screens keep the links in the header instead.
 */
export function Dock() {
  const pathname = usePathname();
  const item =
    "flex h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-full px-2.5 text-[10px] leading-none transition-colors duration-100";

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex justify-center px-3 md:hidden"
    >
      <div className="flex items-center gap-0.5 rounded-full bg-surface-2 p-1 shadow-overlay">
        {LINKS.slice(0, 2).map((link) => (
          <DockLink
            key={link.href}
            {...link}
            active={isActive(pathname, link.href)}
            className={item}
          />
        ))}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search components"
          className={clsx(item, "text-text-muted hover:text-text")}
        >
          <Search size={18} strokeWidth={1.75} aria-hidden />
          Search
        </button>
        {LINKS.slice(2).map((link) => (
          <DockLink
            key={link.href}
            {...link}
            active={isActive(pathname, link.href)}
            className={item}
          />
        ))}
      </div>
    </nav>
  );
}

function DockLink({
  href,
  label,
  icon: Icon,
  active,
  className,
}: {
  href: string;
  label: string;
  icon: typeof House;
  active: boolean;
  className: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        className,
        active ? "bg-surface-4 text-text shadow-ring-hairline" : "text-text-muted hover:text-text",
      )}
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        aria-hidden
        className={active ? "text-grape-11" : undefined}
      />
      {label}
    </Link>
  );
}
