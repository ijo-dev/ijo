/**
 * A deliberately small highlighter for the live snippet, which changes on every
 * slider move. Shiki handles the static code in the docs at build time; shipping
 * it to the browser as well would cost more than the whole page.
 *
 * Classes match the four token colours in the design system.
 */
export type Token = { text: string; cls?: string };

const PATTERN = new RegExp(
  [
    "(?<comment>//[^\\n]*|<!--[\\s\\S]*?-->|/\\*[\\s\\S]*?\\*/)",
    '(?<string>"[^"\\n]*"|\'[^\'\\n]*\')',
    "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
    "(?<keyword>\\b(?:import|from|export|const|let|function|return|default|script|template|setup|lang|type|module)\\b)",
  ].join("|"),
  "g"
);

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;

  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: code.slice(last, index) });

    const groups = match.groups ?? {};
    const cls = groups.comment
      ? "tok-comment"
      : groups.string
        ? "tok-string"
        : groups.number
          ? "tok-number"
          : "tok-keyword";

    tokens.push({ text: match[0], cls });
    last = index + match[0].length;
  }

  if (last < code.length) tokens.push({ text: code.slice(last) });
  return tokens;
}
