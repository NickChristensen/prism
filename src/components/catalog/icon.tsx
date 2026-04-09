import { z } from "zod";

export const iconPropsSchema = z.object({
  name: z
    .string()
    .min(1)
    .describe(
      "Canonical Lucide icon name in kebab-case, for example calendar, mail, chart-column, dumbbell, or triangle-alert.",
    ),
  size: z.number().int().min(12).max(96).optional(),
  strokeWidth: z.number().min(0.5).max(3).optional(),
  absoluteStrokeWidth: z.boolean().optional(),
  color: z.string().optional(),
  className: z.string().optional(),
  label: z.string().optional(),
});

export type IconProps = z.infer<typeof iconPropsSchema>;

export const iconDefinition = {
  props: iconPropsSchema,
  description:
    "Lucide icon rendered from a canonical kebab-case icon name such as calendar, mail, chart-column, dumbbell, or triangle-alert.",
};
