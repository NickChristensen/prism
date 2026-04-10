"use client";

import type { ReactElement, ReactNode } from "react";
import type { BaseComponentProps, EventHandle } from "@json-render/react";
import { shadcnComponents, type ShadcnProps } from "@json-render/shadcn";

type ShadcnComponentName = keyof typeof shadcnComponents;

type JsonRenderShadcnAdapterProps<K extends ShadcnComponentName> =
  ShadcnProps<K> & {
    children?: ReactNode;
    emit?: BaseComponentProps<ShadcnProps<K>>["emit"];
    on?: BaseComponentProps<ShadcnProps<K>>["on"];
    bindings?: BaseComponentProps<ShadcnProps<K>>["bindings"];
    loading?: BaseComponentProps<ShadcnProps<K>>["loading"];
  };

type JsonRenderShadcnAdapter<K extends ShadcnComponentName> = (
  props: JsonRenderShadcnAdapterProps<K>,
) => ReactElement;

const defaultEventHandle: EventHandle = {
  emit: () => {},
  shouldPreventDefault: false,
  bound: false,
};

const defaultEmit: BaseComponentProps["emit"] = () => {};
const defaultOn: BaseComponentProps["on"] = () => defaultEventHandle;

function adaptJsonRenderShadcnComponent<K extends ShadcnComponentName>(
  name: K,
): JsonRenderShadcnAdapter<K> {
  const Component =
    shadcnComponents[name] as unknown as (
      props: BaseComponentProps<ShadcnProps<K>>,
    ) => ReactElement;

  return function JsonRenderShadcnComponent({
    children,
    emit,
    on,
    bindings,
    loading,
    ...props
  }: JsonRenderShadcnAdapterProps<K>) {
    return (
      <Component
        props={props as ShadcnProps<K>}
        emit={emit ?? defaultEmit}
        on={on ?? defaultOn}
        bindings={bindings}
        loading={loading}
      >
        {children}
      </Component>
    );
  };
}

export const jsonRenderShadcn = {
  Card: adaptJsonRenderShadcnComponent("Card"),
  Stack: adaptJsonRenderShadcnComponent("Stack"),
  Grid: adaptJsonRenderShadcnComponent("Grid"),
  Separator: adaptJsonRenderShadcnComponent("Separator"),
  Tabs: adaptJsonRenderShadcnComponent("Tabs"),
  Accordion: adaptJsonRenderShadcnComponent("Accordion"),
  Collapsible: adaptJsonRenderShadcnComponent("Collapsible"),
  Dialog: adaptJsonRenderShadcnComponent("Dialog"),
  Drawer: adaptJsonRenderShadcnComponent("Drawer"),
  Carousel: adaptJsonRenderShadcnComponent("Carousel"),
  Table: adaptJsonRenderShadcnComponent("Table"),
  Heading: adaptJsonRenderShadcnComponent("Heading"),
  Text: adaptJsonRenderShadcnComponent("Text"),
  Image: adaptJsonRenderShadcnComponent("Image"),
  Avatar: adaptJsonRenderShadcnComponent("Avatar"),
  Badge: adaptJsonRenderShadcnComponent("Badge"),
  Alert: adaptJsonRenderShadcnComponent("Alert"),
  Progress: adaptJsonRenderShadcnComponent("Progress"),
  Skeleton: adaptJsonRenderShadcnComponent("Skeleton"),
  Spinner: adaptJsonRenderShadcnComponent("Spinner"),
  Tooltip: adaptJsonRenderShadcnComponent("Tooltip"),
  Popover: adaptJsonRenderShadcnComponent("Popover"),
  Input: adaptJsonRenderShadcnComponent("Input"),
  Textarea: adaptJsonRenderShadcnComponent("Textarea"),
  Select: adaptJsonRenderShadcnComponent("Select"),
  Checkbox: adaptJsonRenderShadcnComponent("Checkbox"),
  Radio: adaptJsonRenderShadcnComponent("Radio"),
  Switch: adaptJsonRenderShadcnComponent("Switch"),
  Slider: adaptJsonRenderShadcnComponent("Slider"),
  Button: adaptJsonRenderShadcnComponent("Button"),
  Link: adaptJsonRenderShadcnComponent("Link"),
  DropdownMenu: adaptJsonRenderShadcnComponent("DropdownMenu"),
  Toggle: adaptJsonRenderShadcnComponent("Toggle"),
  ToggleGroup: adaptJsonRenderShadcnComponent("ToggleGroup"),
  ButtonGroup: adaptJsonRenderShadcnComponent("ButtonGroup"),
  Pagination: adaptJsonRenderShadcnComponent("Pagination"),
};
