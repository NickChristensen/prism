import { Children, type ReactNode } from "react";
import { z } from "zod";
import type { BaseComponentProps } from "@json-render/react";
import { shadcnComponents, shadcnComponentDefinitions } from "@json-render/shadcn";

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

export const inlineCodeClass = "font-mono text-sm bg-muted px-1.5 py-0.5 rounded";

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

const inlineTextPropsSchema = z.object({
  text: dynamicTextValueSchema,
});

type InlineTextProps = z.infer<typeof inlineTextPropsSchema>;

export function InlineText({ props }: BaseComponentProps<InlineTextProps>) {
  return <>{normalizeTextValue(props.text)}</>;
}

export const inlineTextDefinition = {
  props: inlineTextPropsSchema,
  description:
    "Plain inline text fragment for use inside Text or other inline components.",
  example: {
    text: "This is plain inline text. ",
  },
};

const inlineContainerPropsSchema = z.object({
  text: dynamicTextValueSchema.optional(),
});

type InlineContainerProps = z.infer<typeof inlineContainerPropsSchema>;

export function InlineBold({
  props,
  children,
}: BaseComponentProps<InlineContainerProps>) {
  return <strong>{renderInlineContent(props.text, children)}</strong>;
}

export const inlineBoldDefinition = {
  props: inlineContainerPropsSchema,
  slots: ["default"],
  description:
    "Bold inline text. Use either text or nested inline children. Do not provide both.",
  example: {
    text: "bold",
  },
};

export function InlineItalic({
  props,
  children,
}: BaseComponentProps<InlineContainerProps>) {
  return <em>{renderInlineContent(props.text, children)}</em>;
}

export const inlineItalicDefinition = {
  props: inlineContainerPropsSchema,
  slots: ["default"],
  description:
    "Italic inline text. Use either text or nested inline children. Do not provide both.",
  example: {
    text: "italic",
  },
};

export function InlineCode({
  props,
  children,
}: BaseComponentProps<InlineContainerProps>) {
  return (
    <code className={inlineCodeClass}>
      {renderInlineContent(props.text, children)}
    </code>
  );
}

export const inlineCodeDefinition = {
  props: inlineContainerPropsSchema,
  slots: ["default"],
  description:
    "Inline code text. Use either text or nested inline children. Do not provide both.",
  example: {
    text: "npm run lint",
  },
};

export function InlineHighlight({
  props,
  children,
}: BaseComponentProps<InlineContainerProps>) {
  return <mark>{renderInlineContent(props.text, children)}</mark>;
}

export const inlineHighlightDefinition = {
  props: inlineContainerPropsSchema,
  slots: ["default"],
  description:
    "Highlighted inline text. Use either text or nested inline children. Do not provide both.",
  example: {
    text: "highlighted",
  },
};

export function InlineStrikethrough({
  props,
  children,
}: BaseComponentProps<InlineContainerProps>) {
  return <del>{renderInlineContent(props.text, children)}</del>;
}

export const inlineStrikethroughDefinition = {
  props: inlineContainerPropsSchema,
  slots: ["default"],
  description:
    "Deleted or struck-through inline text. Use either text or nested inline children. Do not provide both.",
  example: {
    text: "deleted",
  },
};

const inlineLinkPropsSchema = shadcnComponentDefinitions.Link.props;

type InlineLinkProps = z.infer<typeof inlineLinkPropsSchema>;

export function InlineLink({
  props,
  emit,
  on,
}: BaseComponentProps<InlineLinkProps>) {
  return (
    <shadcnComponents.Link
      props={props}
      emit={emit}
      on={on}
    />
  );
}

export const inlineLinkDefinition = {
  props: inlineLinkPropsSchema,
  description:
    "Inline hyperlink. Same props and behavior as Link, but intended for use inside Text.",
  example: {
    href: "https://example.com",
    label: "Read more",
  },
};
