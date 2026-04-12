import { z } from "zod";
import type { BaseComponentProps } from "@json-render/react";
import { shadcnComponentDefinitions } from "@/components/catalog/shadcn/catalog";
import {
  dynamicTextValueSchema,
  inlineCodeClass,
  renderInlineContent,
} from "@/components/catalog/text-inline";

const textVariantSchema = shadcnComponentDefinitions.Text.props.shape.variant;

export const textPropsSchema = z.object({
  text: dynamicTextValueSchema.optional(),
  variant: textVariantSchema.optional(),
});

type TextProps = {
  text?: unknown;
  variant?: z.infer<typeof textVariantSchema>;
};

export function Text({ props, children }: BaseComponentProps<TextProps>) {
  const { text, variant } = props;
  const content = renderInlineContent(text, children);

  const textClass =
    variant === "caption"
      ? "text-xs"
      : variant === "muted"
        ? "text-sm text-muted-foreground"
        : variant === "lead"
          ? "text-xl text-muted-foreground"
          : variant === "code"
            ? inlineCodeClass
            : "text-sm";

  if (variant === "code") {
    return <code className={`${textClass} text-left`}>{content}</code>;
  }

  return <p className={`${textClass} text-left`}>{content}</p>;
}

export const textDefinition = {
  props: textPropsSchema,
  slots: ["default"],
  description:
    "Paragraph text. For simple text, set props.text. For inline formatting, add child elements in the default slot, usually alternating InlineText with inline components like InlineBold, InlineItalic, InlineCode, InlineHighlight, InlineStrikethrough, and InlineLink. Keep children inline-only; do not place block components inside Text.",
  example: {
    text: "Simple paragraph text",
    variant: "body",
  },
};
