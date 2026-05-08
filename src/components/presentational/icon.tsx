"use client";

import type * as React from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

import { iconColorFamilies } from "@/components/catalog/icon";
import { cn } from "@/lib/utils";

type DynamicIconProps = React.ComponentProps<typeof DynamicIcon>;

const iconColorClasses = {
  default: "",
  muted: "text-muted-foreground",
  primary: "text-primary",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
} satisfies Record<(typeof iconColorFamilies)[number], string>;

export type IconProps = Omit<DynamicIconProps, "color" | "name"> & {
  color?: (typeof iconColorFamilies)[number];
  name: string;
};

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function resolveIconColorClass(color: IconProps["color"]) {
  if (!color) return "";
  if (!iconColorFamilies.includes(color)) return "";

  return iconColorClasses[color];
}

export function Icon({
  className,
  color,
  name,
  size = 16,
  ...props
}: IconProps) {
  const dynamicName = toKebabCase(name);

  if (!(dynamicName in dynamicIconImports)) {
    return null;
  }

  return (
    <DynamicIcon
      className={cn("shrink-0", resolveIconColorClass(color), className)}
      name={dynamicName as keyof typeof dynamicIconImports}
      size={size}
      {...props}
    />
  );
}
