import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { renderInlineMarkdown } from "@/lib/text-markdown";

export const listPropsSchema = z.object({
  items: z.array(z.string()),
});

type ListProps = z.infer<typeof listPropsSchema>;

export const bulletListDefinition = {
  props: listPropsSchema,
  description:
    "Bulleted unordered list of short text items. Each item supports the same inline markdown as Text.",
};

export const numberedListDefinition = {
  props: listPropsSchema,
  description:
    "Numbered ordered list of short text items. Each item supports the same inline markdown as Text.",
};

export function BulletList({ props }: BaseComponentProps<ListProps>) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm">
      {props.items.map((item, index) => (
        <li
          key={index}
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}
        />
      ))}
    </ul>
  );
}

export function NumberedList({ props }: BaseComponentProps<ListProps>) {
  return (
    <ol className="list-decimal space-y-2 pl-5 text-sm">
      {props.items.map((item, index) => (
        <li
          key={index}
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}
        />
      ))}
    </ol>
  );
}
