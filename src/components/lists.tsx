import type { BaseComponentProps } from "@json-render/react";
import { cn } from "@/lib/utils";

type ListProps = {
  items: string[];
  className?: string;
};

export function BulletList({ props }: BaseComponentProps<ListProps>) {
  return (
    <ul className={cn("list-disc space-y-2 pl-5 text-sm", props.className)}>
      {props.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function NumberedList({ props }: BaseComponentProps<ListProps>) {
  return (
    <ol className={cn("list-decimal space-y-2 pl-5 text-sm", props.className)}>
      {props.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
}
