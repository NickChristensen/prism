import { Children, type ReactNode } from "react";
import { z } from "zod";

export const dynamicTextValueSchema: z.ZodType = z.lazy(() =>
  z.union([
    z.string(),
    z.object({ $state: z.string() }),
    z.object({ $item: z.string() }),
    z.object({ $bindState: z.string() }),
    z.object({ $bindItem: z.string() }),
    z.object({ $template: z.string() }),
    z.object({
      $computed: z.string(),
      args: z.record(z.string(), z.unknown()).optional(),
    }),
    z.object({
      $cond: z.unknown(),
      $then: dynamicTextValueSchema,
      $else: dynamicTextValueSchema,
    }),
  ]),
);

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
