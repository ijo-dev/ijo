import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs",
  description: "How to install and use Ijó components in Next.js, Vite, Nuxt or plain HTML.",
};

export default function DocsIndex() {
  return (
    <>
      <h1 className="text-h1 font-semibold text-text">Docs</h1>
      <p>
        Ijó components are copied into your project, not installed as a dependency you cannot
        edit. Start with <Link href="/docs/getting-started">getting started</Link>, then read{" "}
        <Link href="/docs/reduced-motion">reduced motion</Link> before you ship.
      </p>
      <p>
        More pages — GSAP basics, easing, ScrollTrigger and performance — land with the first
        twelve components.
      </p>
    </>
  );
}
