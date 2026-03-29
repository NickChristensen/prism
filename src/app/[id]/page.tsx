import { promises as fs } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { PrismRenderer } from "@/components/prism-renderer";

const PRISM_MEDIA_DIR = path.join(process.env.HOME ?? "", ".openclaw", "media", "prism");

async function loadSpec(id: string) {
  const filePath = path.join(PRISM_MEDIA_DIR, `${id}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
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
