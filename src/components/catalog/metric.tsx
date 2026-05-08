import { z } from "zod";

export const metricPropsSchema = z.object({
  label: z.string(),
  value: z.string(),
  change: z.string().optional(),
  changeType: z.enum(["positive", "negative", "neutral"]).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export type MetricProps = z.infer<typeof metricPropsSchema>;

export const metricDefinition = {
  props: metricPropsSchema,
  description:
    "Key metric or stat display. Shows a large value with label and optional change indicator. Use for dashboard KPIs, health stats, finance summaries, workout totals, and briefing numbers.",
  example: {
    label: "Total Revenue",
    value: "125,000",
    prefix: "$",
    change: "+12.5%",
    changeType: "positive",
  },
};

export function Metric({ props }: { props: MetricProps }) {
  const changeClass =
    props.changeType === "positive"
      ? "text-green-600 dark:text-green-400"
      : props.changeType === "negative"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  return (
    <div className="min-w-0 space-y-1">
      <div className="truncate text-sm text-muted-foreground">
        {props.label}
      </div>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="min-w-0 text-2xl font-semibold tracking-normal tabular-nums">
          {props.prefix}
          {props.value}
          {props.suffix}
        </span>
        {props.change && (
          <span className={`text-sm font-medium tabular-nums ${changeClass}`}>
            {props.change}
          </span>
        )}
      </div>
    </div>
  );
}
