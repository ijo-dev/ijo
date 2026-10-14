import { ButtonLink } from "@/components/site/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-4 py-24 md:px-8">
      <h1 className="text-h1 font-semibold">That page isn&rsquo;t here</h1>
      <p className="max-w-[60ch] text-body text-text-muted">
        The link may be from an older version of the site, or the component may have been
        renamed.
      </p>
      <ButtonLink href="/library" variant="primary">
        Browse components
      </ButtonLink>
    </div>
  );
}
