import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const PRISM_MEDIA_DIR = path.join(
  process.env.HOME ?? "",
  ".openclaw",
  "media",
  "prism",
);

async function listSpecRoutes() {
  try {
    const entries = await fs.readdir(PRISM_MEDIA_DIR, { withFileTypes: true });
    const routes = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
        .map(async (entry) => {
          const filePath = path.join(PRISM_MEDIA_DIR, entry.name);
          const stats = await fs.stat(filePath);

          return {
            route: entry.name.slice(0, -".jsonl".length),
            modifiedAt: stats.mtimeMs,
          };
        }),
    );

    return routes.sort((left, right) => right.modifiedAt - left.modifiedAt);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export default async function HomePage() {
  const routes = await listSpecRoutes();

  return (
    <main className="py-16">
      <Card className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Prism</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Prism renders rich views for OpenClaw. Open a Prism link with an ID
            to see a generated page.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Available Routes
            </h2>
            <p className="text-sm text-muted-foreground">
              {routes.length} {routes.length === 1 ? "spec" : "specs"}
            </p>
          </div>

          {routes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
              No spec files found in <code>{PRISM_MEDIA_DIR}</code>.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {routes.map((route) => (
                <li key={route.route}>
                  <Link
                    href={`/${route.route}`}
                    className="flex rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="truncate font-mono">{route.route}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Card>
    </main>
  );
}
