import { z } from "zod";

export const iconColorFamilies = [
  "default",
  "muted",
  "primary",
  "success",
  "warning",
  "danger",
] as const;

export const iconPropsSchema = z.object({
  name: z
    .string()
    .min(1)
    .describe(
      "Lucide icon name in PascalCase, for example Calendar, Mail, ChartColumn, Dumbbell, or TriangleAlert.",
    ),
  size: z.enum(["sm", "md", "lg"]).optional(),
  color: z.enum(iconColorFamilies).optional(),
});

export type IconProps = z.infer<typeof iconPropsSchema>;

export const iconDefinition = {
  props: iconPropsSchema,
  description:
    "Lucide icon by PascalCase name. Examples: MapPin, Mail, Globe, Calendar, Star, Heart, Check, X, ArrowRight, Phone, Building, Clock, Shield, Zap, Users, Eye, Download, Upload, Search, Filter, Settings, Bell, ChevronRight, ExternalLink, Info, TriangleAlert, CircleCheck, CircleX. Use in horizontal Stacks with Text for icon+label patterns. Never use emoji; always use Icon.",
};
