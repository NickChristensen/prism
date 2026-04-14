import { z } from "zod";

export const iconColorFamilies = [
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "green",
  "indigo",
  "lime",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "teal",
  "violet",
  "yellow",
] as const;

export const iconPropsSchema = z.object({
  name: z
    .string()
    .min(1)
    .describe(
      "Canonical Lucide icon name in kebab-case, for example calendar, mail, chart-column, dumbbell, or triangle-alert.",
    ),
  size: z.number().int().min(12).max(96).optional(),
  color: z.enum(iconColorFamilies).optional(),
});

export type IconProps = z.infer<typeof iconPropsSchema>;

export const iconDefinition = {
  props: iconPropsSchema,
  description:
    "Lucide icon using a canonical kebab-case name such as calendar, mail, or chart-column. Omitting color inherits text color.",
};
