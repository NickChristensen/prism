## Design Context

### Users
Prism has a single primary user: Nick. Prism pages are opened from Telegram after an agent decides a response would benefit from a richer UI than Telegram's text-first interface can provide. The experience typically begins in a Telegram chat, where the user prompts an agent. The agent then generates a Prism UI spec and returns a link, which opens inside Telegram's in-app fullscreen sheet browser.

The core job to be done is translating structured or information-dense agent output into a format that is faster to scan, easier to understand, and more pleasant to use than Telegram's limited inline formatting. Prism should make lists, threads, tables, sectioned summaries, and other structured views feel legible and native rather than improvised.

### Brand Personality
The product should feel modern, crisp, and clean. There is no heavy standalone brand layer to express, so the interface should lean into clarity, restraint, and precision rather than overt personality. The emotional goal is confidence and calm readability: the user should feel that the agent's output has been organized thoughtfully and presented with quiet polish.

### Aesthetic Direction
Prism should feel native-ish inside Telegram's in-app browser, with support for both light and dark themes. The existing shadcn theme is an established visual standard and should be preserved as the baseline system language rather than replaced with something more expressive or branded.

The visual direction should avoid anything garish, soft, pastel, ornamental, or serif-led. It should favor sharp hierarchy, disciplined spacing, straightforward surfaces, and a contemporary product UI sensibility. Pages should feel like a refined utility interface for AI-generated structured content, not like a marketing site or art-directed experiment.

### Design Principles
1. Prioritize structured clarity over decoration. Prism exists to make agent output easier to parse than Telegram text.
2. Preserve a native-ish product feel. Designs should sit comfortably inside Telegram's fullscreen browser in both light and dark contexts.
3. Use the existing shadcn theme as the default design system foundation. Extend it carefully; do not fight it for novelty's sake.
4. Keep the interface visually disciplined: modern, crisp, clean, and never soft, pastel, garish, or serif-driven.
5. Make dense information feel calm and legible through hierarchy, spacing, and component choice rather than visual effects.
