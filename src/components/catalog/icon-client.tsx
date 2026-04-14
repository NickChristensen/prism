"use client";

import type { BaseComponentProps } from "@json-render/react";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { IconProps } from "@/components/catalog/icon";

export function Icon({ props }: BaseComponentProps<IconProps>) {
  if (!(props.name in dynamicIconImports)) {
    return null;
  }

  const color = props.color ? `var(--color-${props.color}-500)` : undefined;

  return (
    <DynamicIcon
      color={color}
      name={props.name as keyof typeof dynamicIconImports}
      size={props.size ?? 16}
    />
  );
}
