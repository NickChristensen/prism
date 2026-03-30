import { promises as fs } from "node:fs";
import path from "node:path";
import { applySpecPatch } from "@json-render/core";
import { notFound } from "next/navigation";
import { PrismRenderer } from "@/components/app/prism-renderer";

const PRISM_MEDIA_DIR = path.join(process.env.HOME ?? "", ".openclaw", "media", "prism");

async function loadSpec(id: string) {
  const filePath = path.join(PRISM_MEDIA_DIR, `${id}.jsonl`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spec: any = {};
    for (const line of raw.split("\n").map((l) => l.trim()).filter(Boolean)) {
      applySpecPatch(spec, JSON.parse(line));
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
