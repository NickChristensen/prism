#!/usr/bin/env npx tsx
/**
 * Sync the json-render system prompt to the Prism skill file.
 * Replaces content between <!-- begin/end json-render system prompt --> markers.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { catalog } from "../src/lib/catalog";

const SKILL_PATH = process.argv[2] ||
  join(homedir(), ".openclaw", "skills", "prism", "SKILL.md");

const BEGIN_MARKER = "<!-- begin json-render system prompt -->";
const END_MARKER = "<!-- end json-render system prompt -->";

function syncPrompt(): void {
  let content: string;

  try {
    content = readFileSync(SKILL_PATH, "utf-8");
  } catch (error) {
    console.error(`Error reading ${SKILL_PATH}:`, error);
    process.exit(1);
  }

  const beginIndex = content.indexOf(BEGIN_MARKER);
  const endIndex = content.indexOf(END_MARKER);

  if (beginIndex === -1) {
    console.error(`Error: Could not find begin marker "${BEGIN_MARKER}" in ${SKILL_PATH}`);
    process.exit(1);
  }

  if (endIndex === -1) {
    console.error(`Error: Could not find end marker "${END_MARKER}" in ${SKILL_PATH}`);
    process.exit(1);
  }

  if (endIndex <= beginIndex) {
    console.error(`Error: End marker appears before begin marker in ${SKILL_PATH}`);
    process.exit(1);
  }

  // Everything up to and including the begin marker
  const beforePrompt = content.slice(0, beginIndex + BEGIN_MARKER.length);
  // Everything from the end marker onward
  const afterPrompt = content.slice(endIndex);

  const newPrompt = catalog.prompt();

  const newContent = `${beforePrompt}\n\n${newPrompt}\n\n${afterPrompt}`;

  try {
    writeFileSync(SKILL_PATH, newContent);
    console.log(`✓ Synced prompt to ${SKILL_PATH}`);
  } catch (error) {
    console.error(`Error writing ${SKILL_PATH}:`, error);
    process.exit(1);
  }
}

syncPrompt();
