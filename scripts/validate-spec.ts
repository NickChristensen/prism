#!/usr/bin/env npx tsx

import { readFileSync } from "node:fs";
import { applySpecPatch, type JsonPatch, type Spec } from "@json-render/core";
import { catalog } from "../src/lib/catalog";

function usage(): never {
  console.error("Usage: npm run validate-spec -- <path-to-spec.jsonl>");
  process.exit(2);
}

function loadSpec(filePath: string): unknown {
  const raw = readFileSync(filePath, "utf8");
  const spec: Spec = { root: "", elements: {} };

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
      const patchPath =
        typeof patch.path === "string" ? patch.path : "<unknown>";

      throw new Error(
        `Failed to apply patch in ${filePath}:${lineNumber} (${JSON.stringify({ op, path: patchPath })})\n${message}`,
      );
    }
  }

  return spec;
}

function main(): void {
  const filePath = process.argv[2];

  if (!filePath) {
    usage();
  }

  try {
    const spec = loadSpec(filePath);
    const result = catalog.validate(spec);

    if (result.success) {
      process.exit(0);
    }

    const issues = result.error?.issues ?? [];

    console.error(
      JSON.stringify(
        {
          success: false,
          issues,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

main();
