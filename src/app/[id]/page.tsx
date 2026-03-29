import { promises as fs } from "node:fs";
import path from "node:path";
import { nestedToFlat } from "@json-render/core";
import { notFound } from "next/navigation";
import { PrismRenderer } from "@/components/prism-renderer";

const PRISM_MEDIA_DIR = path.join(process.env.HOME ?? "", ".openclaw", "media", "prism");

async function loadSpec(id: string) {
  const filePath = path.join(PRISM_MEDIA_DIR, `${id}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (parsed?.root && typeof parsed.root === "object" && !parsed?.elements) {
      return nestedToFlat(parsed.root);
    }

    return parsed;
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
