import { promises as fs } from "node:fs";
import path from "node:path";
import { applySpecPatch, type JsonPatch } from "@json-render/core";
import { notFound } from "next/navigation";
import { PrismRenderer } from "@/components/app/prism-renderer";

export const dynamic = "force-dynamic";

const PRISM_MEDIA_DIR = path.join(
  process.env.HOME ?? "",
  ".openclaw",
  "media",
  "prism",
);

async function loadSpec(id: string) {
  const filePath = path.join(PRISM_MEDIA_DIR, `${id}.jsonl`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spec: any = {};
    for (const [index, rawLine] of raw.split("\n").entries()) {
      const lineNumber = index + 1;
      const line = rawLine.trim();

      if (!line) {
        continue;
      }

      let patch: JsonPatch;

      try {
        patch = JSON.parse(line) as JsonPatch;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new SyntaxError(
          `Failed to parse JSONL in ${filePath}:${lineNumber}\n${message}`,
        );
      }

      try {
        applySpecPatch(spec, patch);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const op = typeof patch.op === "string" ? patch.op : "<unknown>";
        const path = typeof patch.path === "string" ? patch.path : "<unknown>";

        throw new Error(
          `Failed to apply patch in ${filePath}:${lineNumber} (${JSON.stringify({ op, path })})\n${message}`,
        );
      }
    }
    return spec;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      notFound();
    }

    throw error;
  }
}

export default async function PrismPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spec = await loadSpec(id);

  return <PrismRenderer spec={spec} />;
}
