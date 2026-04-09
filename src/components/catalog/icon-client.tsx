"use client";

import type { BaseComponentProps } from "@json-render/react";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { IconProps } from "@/components/catalog/icon";
import { cn } from "@/lib/utils";

export function Icon({ props }: BaseComponentProps<IconProps>) {
  if (!(props.name in dynamicIconImports)) {
    return null;
  }

  return (
    <DynamicIcon
      absoluteStrokeWidth={props.absoluteStrokeWidth}
      aria-hidden={props.label ? undefined : true}
      aria-label={props.label}
      className={cn("shrink-0", props.className)}
      color={props.color}
      name={props.name as keyof typeof dynamicIconImports}
      size={props.size ?? 16}
      strokeWidth={props.strokeWidth}
    />
  );
}
