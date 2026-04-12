import { z } from "zod";
import type { BaseComponentProps } from "@json-render/react";
import { shadcnComponentDefinitions } from "@/components/catalog/shadcn/catalog";
import { shadcnComponents } from "@/components/catalog/shadcn/components";
import {
  inlineCodeClass,
  normalizeTextValue,
  renderInlineContent,
} from "@/lib/text";

const inlineTextPropsSchema = z.object({
  text: z.string(),
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
  text: z.string().optional(),
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
  return <shadcnComponents.Link props={props} emit={emit} on={on} />;
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
