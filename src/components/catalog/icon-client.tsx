"use client";

import type { IconProps } from "@/components/catalog/icon";
import { Icon as PresentationalIcon } from "@/components/presentational/icon";

const iconSizePx = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export function Icon({ props }: { props: IconProps }) {
  return (
    <PresentationalIcon
      color={props.color}
      name={props.name}
      size={iconSizePx[props.size ?? "md"]}
    />
  );
}
