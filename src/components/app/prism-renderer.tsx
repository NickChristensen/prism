"use client";

import { JSONUIProvider, Renderer } from "@json-render/react";
import { registry } from "@/lib/registry";

type PrismSpec = Parameters<typeof Renderer>[0]["spec"] & {
  state?: Record<string, unknown>;
};

export function PrismRenderer({ spec }: { spec: unknown }) {
  const prismSpec = spec as PrismSpec;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JSONUIProvider
        registry={registry}
        initialState={prismSpec?.state ?? {}}
      >
        <Renderer spec={prismSpec} registry={registry} />
      </JSONUIProvider>
    </main>
  );
}
