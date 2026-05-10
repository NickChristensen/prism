"use client";

import { useId } from "react";
import { z } from "zod";

const chartDatumSchema = z.object({
  label: z.string(),
  value: z.number(),
});

const chartAnnotationSchema = z.object({
  value: z.number(),
  label: z.string(),
});

export const chartPropsSchema = z.object({
  title: z.string().optional(),
  data: z.array(chartDatumSchema),
  annotation: chartAnnotationSchema.optional(),
});

export type ChartProps = z.infer<typeof chartPropsSchema>;

export const barGraphDefinition = {
  props: chartPropsSchema,
  description:
    "Vertical bar chart for compact comparisons across labeled numeric values. Use for counts, rankings, categories, and short time ranges. Optionally include an annotation line with a value and label.",
};

export const lineGraphDefinition = {
  props: chartPropsSchema,
  description:
    "Line chart with points for numeric trends over ordered labels. Use for time series, progress, changes, and small trend summaries. Optionally include an annotation line with a value and label.",
};

function AnnotationLine({
  label,
  value,
  top,
}: {
  label: string;
  value: number;
  top: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-10"
      style={{ top: `${top}%` }}
    >
      <div
        className="h-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, color-mix(in oklab, var(--primary) 50%, transparent) 0 4px, transparent 4px 8px)",
        }}
      />
      <span className="absolute bottom-[calc(100%+0.25rem)] left-0 inline-flex w-fit rounded-sm bg-background/80 p-1 text-[11px] font-medium leading-none text-primary">
        {label}: {value}
      </span>
    </div>
  );
}

export function BarGraph({ props }: { props: ChartProps }) {
  const data = props.data ?? [];
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const annotationTop =
    props.annotation && maxValue > 0
      ? 100 - Math.max(Math.min(props.annotation.value / maxValue, 1), 0) * 100
      : null;
  const barColors = [
    "bg-primary",
    "bg-primary/85",
    "bg-primary/70",
    "bg-primary/55",
  ];

  return (
    <div className="min-w-0 space-y-3">
      {props.title && <div className="text-sm font-medium">{props.title}</div>}
      <div className="relative flex h-44 items-end gap-2">
        {props.annotation && annotationTop !== null && (
          <AnnotationLine
            label={props.annotation.label}
            value={props.annotation.value}
            top={annotationTop}
          />
        )}
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
          >
            <div className="text-[11px] font-medium tabular-nums text-muted-foreground">
              {d.value}
            </div>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-md ${barColors[i % barColors.length]} transition-opacity group-hover:opacity-85`}
                style={{
                  height: `${Math.max((d.value / maxValue) * 100, 2)}%`,
                }}
              />
            </div>
            <div className="w-full truncate text-center text-[11px] text-muted-foreground">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineGraph({ props }: { props: ChartProps }) {
  const gradientId = useId().replace(/:/g, "");
  const data = props.data ?? [];
  const values = data.map((d) => d.value);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 1;
  const rawRange = maxValue - minValue || 1;
  const paddedMin = minValue - rawRange * 0.15;
  const paddedMax = maxValue + rawRange * 0.1;
  const range = paddedMax - paddedMin || 1;
  const annotationTop = props.annotation
    ? 100 -
      Math.max(Math.min((props.annotation.value - paddedMin) / range, 1), 0) *
        100
    : null;

  const width = 300;
  const height = 140;
  const padding = { top: 12, right: 12, bottom: 12, left: 12 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x =
      padding.left +
      (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2);
    const y =
      padding.top + chartHeight - ((d.value - paddedMin) / range) * chartHeight;

    return { x, y, ...d };
  });

  let smoothPath = "";
  let areaPath = "";

  if (points.length > 1) {
    const first = points[0];
    const last = points[points.length - 1];

    smoothPath = `M ${first.x} ${first.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpx = (curr.x + next.x) / 2;
      smoothPath += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
    }

    const bottomY = height - padding.bottom;
    areaPath = `${smoothPath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  } else if (points.length === 1) {
    const only = points[0];
    smoothPath = `M ${only.x} ${only.y}`;
  }

  return (
    <div className="min-w-0 space-y-3">
      {props.title && <div className="text-sm font-medium">{props.title}</div>}
      {points.length > 0 && (
        <div className="relative h-4">
          {points.map((p, i) => (
            <span
              key={`${p.label}-${i}-value`}
              className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tabular-nums text-muted-foreground"
              style={{ left: `${(p.x / width) * 100}%` }}
            >
              {p.value}
            </span>
          ))}
        </div>
      )}
      <div className="relative h-44 text-primary">
        {props.annotation && annotationTop !== null && (
          <AnnotationLine
            label={props.annotation.label}
            value={props.annotation.value}
            top={annotationTop}
          />
        )}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={padding.left}
              y1={padding.top + chartHeight * frac}
              x2={width - padding.right}
              y2={padding.top + chartHeight * frac}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
          {smoothPath && (
            <path
              d={smoothPath}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {points.map((p, i) => (
          <div
            key={`${p.label}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(p.x / width) * 100}%`,
              top: `${(p.y / height) * 100}%`,
            }}
          >
            <div className="size-2 rounded-full border-2 border-background bg-primary" />
          </div>
        ))}
      </div>
      {points.length > 0 && (
        <div className="relative h-4">
          {points.map((p, i) => (
            <span
              key={`${p.label}-${i}`}
              className="absolute -translate-x-1/2 text-[11px] text-muted-foreground"
              style={{ left: `${(p.x / width) * 100}%` }}
            >
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
