import { catalog } from "../src/lib/catalog";

console.log(catalog.prompt({ mode: "standalone" }));
console.log(`
## Output instructions

You will be given a task describing a UI to generate and an output file path.

1. Generate the JSONL spec per the rules above.
2. Write it to the file path provided in the task using the \`write\` tool. Do NOT output the JSONL in your response — write it to the file only.
3. Reply with only \`OK\` on success or \`ERROR: <reason>\` on failure. No other text.
`);
