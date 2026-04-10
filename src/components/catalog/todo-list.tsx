"use client";

import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { File, Square } from "lucide-react";
import { jsonRenderShadcn } from "@/components/app/json-render-shadcn";

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
  const { Badge, Text } = jsonRenderShadcn;
  const iconClasses = "opacity-30 shrink-0";

  return (
    <div className="flex flex-col gap-2">
      {props.items.map((item) => (
        <div key={item.uuid} className="flex gap-2 items-center">
          <Square size={14} className={iconClasses} />
          <div>
            <div className="flex items-center gap-2">
              <Text text={item.title} variant="body" />
              {item.has_notes && <File size={12} className={iconClasses} />}
              {item.tags &&
                item.tags.map((tag) => (
                  <Badge key={tag} text={tag} variant="outline" />
                ))}
            </div>

            {item.project || item.area ? (
              <div className="text-muted-foreground">
                <Text
                  text={item.project || item.area || ""}
                  variant="caption"
                />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
