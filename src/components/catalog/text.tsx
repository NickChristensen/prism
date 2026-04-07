import { Fragment, type ReactNode } from "react";
import { z } from "zod";
import type { BaseComponentProps } from "@json-render/react";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";

const textVariantSchema = shadcnComponentDefinitions.Text.props.shape.variant;

const dynamicTextValueSchema: z.ZodType = z.lazy(() =>
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

type RuntimeInlineNode =
  | string
  | { type: "strong"; text: unknown }
  | { type: "em"; text: unknown }
  | { type: "code"; text: unknown }
  | { type: "mark"; text: unknown }
  | { type: "del"; text: unknown }
  | { type: "a"; href: unknown; text: unknown };

const inlineTextTagSchema = <TType extends string>(type: TType) =>
  z.object({
    type: z.literal(type),
    text: dynamicTextValueSchema,
  });

const inlineContentSchema = z.union([
  z.string(),
  inlineTextTagSchema("strong"),
  inlineTextTagSchema("em"),
  inlineTextTagSchema("code"),
  inlineTextTagSchema("mark"),
  inlineTextTagSchema("del"),
  z.object({
    type: z.literal("a"),
    href: dynamicTextValueSchema,
    text: dynamicTextValueSchema,
  }),
]);

export const textPropsSchema = z.object({
  content: z.array(inlineContentSchema),
  variant: textVariantSchema.optional(),
  text: dynamicTextValueSchema.optional(),
});

type RuntimeTextProps = {
  content?: RuntimeInlineNode[];
  text?: unknown;
  variant?: z.infer<typeof textVariantSchema>;
};

const inlineCodeClass = "font-mono text-sm bg-muted px-1.5 py-0.5 rounded";
const linkClass =
  "text-primary underline-offset-4 hover:underline text-sm font-medium";

function normalizeTextValue(value: unknown): string {
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

function normalizeContent(props: RuntimeTextProps): RuntimeInlineNode[] {
  if (Array.isArray(props.content)) {
    return props.content;
  }

  if (props.text == null) {
    return [];
  }

  return [normalizeTextValue(props.text)];
}

function renderInlineNode(node: RuntimeInlineNode, key: string): ReactNode {
  if (typeof node === "string") {
    return <Fragment key={key}>{node}</Fragment>;
  }

  switch (node.type) {
    case "strong":
      return <strong key={key}>{normalizeTextValue(node.text)}</strong>;
    case "em":
      return <em key={key}>{normalizeTextValue(node.text)}</em>;
    case "code":
      return (
        <code key={key} className={inlineCodeClass}>
          {normalizeTextValue(node.text)}
        </code>
      );
    case "mark":
      return <mark key={key}>{normalizeTextValue(node.text)}</mark>;
    case "del":
      return <del key={key}>{normalizeTextValue(node.text)}</del>;
    case "a":
      return (
        <a key={key} href={normalizeTextValue(node.href)} className={linkClass}>
          {normalizeTextValue(node.text)}
        </a>
      );
  }
}

export function Text({ props }: BaseComponentProps<RuntimeTextProps>) {
  const content = normalizeContent(props);
  const { variant } = props;

  const textClass =
    variant === "caption"
      ? "text-xs"
      : variant === "muted"
        ? "text-sm text-muted-foreground"
        : variant === "lead"
          ? "text-xl text-muted-foreground"
          : variant === "code"
            ? `${inlineCodeClass}`
            : "text-sm";

  const renderedContent = content.map((item, index) =>
    renderInlineNode(item, `inline-${index}`),
  );

  if (variant === "code") {
    return <code className={`${textClass} text-left`}>{renderedContent}</code>;
  }
  return <p className={`${textClass} text-left`}>{renderedContent}</p>;
}

export const textDefinition = {
  props: textPropsSchema,
  description:
    "Paragraph text with inline rich formatting. Use 'content' with strings and inline nodes like strong, em, code, mark, del, and a.",
  example: {
    content: [
      "This is ",
      {
        type: "strong",
        text: "bold",
      },
      ", this is ",
      {
        type: "mark",
        text: "highlighted",
      },
      ", this is ",
      {
        type: "del",
        text: "deleted",
      },
      ", and this is ",
      {
        type: "a",
        href: "https://example.com",
        text: "a link",
      },
      ".",
    ],
  },
};
