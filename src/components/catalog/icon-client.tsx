"use client";

import type { BaseComponentProps } from "@json-render/react";
import type { IconProps } from "@/components/catalog/icon";
import { Icon as PresentationalIcon } from "@/components/presentational/icon";

export function Icon({ props }: BaseComponentProps<IconProps>) {
  return (
    <PresentationalIcon
      color={props.color}
      name={props.name}
      size={props.size}
    />
  );
}
