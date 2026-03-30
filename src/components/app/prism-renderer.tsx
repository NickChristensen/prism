"use client";

import { JSONUIProvider, Renderer } from "@json-render/react";
import { registry } from "@/lib/registry";

export function PrismRenderer({ spec }: { spec: unknown }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <JSONUIProvider registry={registry}>
        <Renderer spec={spec as Parameters<typeof Renderer>[0]["spec"]} registry={registry} />
      </JSONUIProvider>
    </main>
  );
}
