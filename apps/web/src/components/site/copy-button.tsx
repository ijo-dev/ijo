"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui";

/** Copies text and says so, then quietly goes back to resting after two seconds. */
export function CopyButton({
  value,
  label = "Copy",
  variant = "ghost",
  className,
}: {
  value: string;
  label?: string;
  variant?: "ghost" | "secondary" | "primary";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!copied && !failed) return;
    const timer = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied, failed]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard access is denied in some in-app browsers; say so rather than
      // leaving the button looking like it worked.
      setFailed(true);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      className={className}
      onClick={copy}
      data-copied={copied || undefined}
    >
      {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
      <span>{failed ? "Press Ctrl+C" : copied ? "Copied" : label}</span>
    </Button>
  );
}
