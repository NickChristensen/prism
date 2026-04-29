"use client";

import type * as React from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

import { iconColorFamilies } from "@/components/catalog/icon";

type DynamicIconProps = React.ComponentProps<typeof DynamicIcon>;

export type IconProps = Omit<DynamicIconProps, "name"> & {
  color?: DynamicIconProps["color"] | (typeof iconColorFamilies)[number];
  name: string;
};

function resolveIconColor(color: IconProps["color"]) {
  if (
    typeof color === "string" &&
    iconColorFamilies.includes(color as (typeof iconColorFamilies)[number])
  ) {
    return `var(--color-${color}-500)`;
  }

  return undefined;
}

export function Icon({ color, name, size = 16, ...props }: IconProps) {
  if (!(name in dynamicIconImports)) {
    return null;
  }

  return (
    <DynamicIcon
      color={resolveIconColor(color)}
      name={name as keyof typeof dynamicIconImports}
      size={size}
      {...props}
    />
  );
}
