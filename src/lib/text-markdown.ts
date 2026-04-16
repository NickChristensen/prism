import MarkdownIt from "markdown-it";
import markdownItMark from "markdown-it-mark";

const linkClass =
  "text-primary underline-offset-4 hover:underline text-sm font-medium";
const inlineCodeClass = "font-mono text-sm bg-muted px-1.5 py-0.5 rounded";
const inlineHighlightClass = "bg-yellow-200/70 text-foreground px-0.5 rounded";

type RendererToken = {
  content?: string;
  attrSet?: (name: string, value: string) => void;
  attrJoin?: (name: string, value: string) => void;
};

type RendererSelf = {
  renderToken: (
    tokens: RendererToken[],
    idx: number,
    options: Record<string, unknown>,
  ) => string;
};

const inlineMarkdown = MarkdownIt("zero", {
  html: false,
  linkify: false,
})
  .enable(["escape", "backticks", "strikethrough", "emphasis", "link", "entity"])
  .use(markdownItMark);

inlineMarkdown.renderer.rules.code_inline = (
  tokens: RendererToken[],
  idx: number,
) => {
  const content = inlineMarkdown.utils.escapeHtml(tokens[idx]?.content ?? "");
  return `<code class="${inlineCodeClass}">${content}</code>`;
};

inlineMarkdown.renderer.rules.link_open = (
  tokens: RendererToken[],
  idx: number,
  options: Record<string, unknown>,
  _env: unknown,
  self: RendererSelf,
) => {
  const token = tokens[idx];
  token?.attrSet?.("class", linkClass);
  token?.attrJoin?.("rel", "noreferrer");
  return self.renderToken(tokens, idx, options);
};

inlineMarkdown.renderer.rules.mark_open = () => {
  return `<mark class="${inlineHighlightClass}">`;
};

export function renderInlineMarkdown(text: string): string {
  return inlineMarkdown.renderInline(text);
}
