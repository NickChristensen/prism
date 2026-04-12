"use client";

import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { File, Square } from "lucide-react";
import { Badge } from "../ui/badge";

export const todoListItemSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  tags: z.array(z.string()).optional(),
  project: z.string().optional(),
  area: z.string().optional(),
  carried_over: z.number().int().nonnegative().optional(),
  has_notes: z.boolean().optional(),
});

export const todoListPropsSchema = z.object({
  items: z.array(todoListItemSchema),
});

export type TodoListProps = z.infer<typeof todoListPropsSchema>;

export const todoListDefinition = {
  props: todoListPropsSchema,
  description:
    "Todo list with an array of items, each carrying title plus optional tags, project, area, and notes flag.",
};

export function TodoList({ props }: BaseComponentProps<TodoListProps>) {
  const dimmedIconClasses = "opacity-30 shrink-0";

  return (
    <div className="flex flex-col gap-2">
      {props.items.map((item) => (
        <div key={item.uuid} className="flex gap-2 items-center">
          <Square size={14} className={dimmedIconClasses} />
          <div className="shrink overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="text-sm truncate">{item.title}</p>
              {item.has_notes && (
                <File size={12} className={dimmedIconClasses} />
              )}
              {item.tags &&
                item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-muted-foreground shrink-0"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            {item.project || item.area ? (
              <p className="text-xs text-muted-foreground">
                {item.project || item.area}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
