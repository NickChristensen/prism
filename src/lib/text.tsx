import { Children, type ReactNode } from "react";

export const inlineCodeClass =
  "font-mono text-sm bg-muted px-1.5 py-0.5 rounded";

export function normalizeTextValue(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return String(value);
}

export function renderInlineContent(
  text: unknown,
  children?: ReactNode,
): ReactNode {
  if (Children.count(children) > 0) {
    return children;
  }

  return normalizeTextValue(text);
}
