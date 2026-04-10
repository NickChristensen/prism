import { Clock, MapPin } from "lucide-react";
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 64;

function toDate(value: string): Date {
  return new Date(value);
}

function getEventDuration(startTime: string, endTime: string): number {
  const start = toDate(startTime);
  const end = toDate(endTime);

  return Math.max((end.getTime() - start.getTime()) / 60000, 0);
}

function getHeight(minutes: number): number {
  return Math.max((minutes / 60) * HOUR_HEIGHT, 16) + 16;
}

function getShadeScale(color: string) {
  return {
    background: `color-mix(in oklab, white 82%, ${color} 18%)`,
    border: `color-mix(in oklab, white 50%, ${color} 50%)`,
    stripe: color,
    text: `color-mix(in oklab, black 25%, ${color} 75%)`,
  };
}

function formatTime(value: string) {
  const date = toDate(value);
  const hour = date.getHours();
  const min = date.getMinutes();
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";

  return min === 0
    ? `${displayHour} ${ampm}`
    : `${displayHour}:${min.toString().padStart(2, "0")} ${ampm}`;
}

export const calendarEventPropsSchema = z.object({
  summary: z.string().min(1),
  start: z.iso.datetime(),
  end: z.iso.datetime(),
  location: z.string().optional(),
  backgroundColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
});

export type CalendarEventProps = z.infer<typeof calendarEventPropsSchema>;

export const calendarEventDefinition = {
  props: calendarEventPropsSchema,
  description:
    "Use for a single scheduled event when you want to show one appointment, meeting, reminder, or reservation on its own. Best when the UI needs details for one event rather than a sequence of events. Provide ISO start and end, plus the calendar or event's backgroundColor as a hex string.",
  example: {
    summary: "Project Sync",
    start: "2026-04-09T09:00:00-05:00",
    end: "2026-04-09T09:30:00-05:00",
    location: "Zoom",
    backgroundColor: "#0088ff",
  },
};

export function CalendarEventView({
  summary,
  start,
  end,
  location,
  backgroundColor,
}: CalendarEventProps) {
  const height = getHeight(getEventDuration(start, end));
  const shades = getShadeScale(backgroundColor);
  const iconWrapperClasses = "flex items-center gap-0.5";
  const iconClasses = "w-2.5 h-2.5 shrink-0";
  const layoutInline = height < 48;

  return (
    <div
      className="rounded-lg overflow-hidden flex p-2 border"
      style={{
        borderColor: shades.border,
        backgroundColor: shades.background,
        color: shades.text,
        height,
      }}
    >
      {/* Internal left stripe */}
      <div
        className="w-1 shrink-0 rounded-sm"
        style={{ backgroundColor: shades.stripe }}
      />

      {/* Content */}
      <div
        className={cn(
          "pl-2 grow shrink-0",
          layoutInline && "flex gap-2 items-center",
        )}
      >
        <p className="text-xs/snug font-bold">{summary}</p>
        <div className={iconWrapperClasses}>
          <Clock className={iconClasses} />
          <p className="text-xs/snug">
            {formatTime(start)} - {formatTime(end)}
          </p>
        </div>
      </div>
      {location && (
        <div
          className={cn(
            iconWrapperClasses,
            "pl-2 shrink grow-0",
            layoutInline ? "self-center" : "self-start",
          )}
        >
          <MapPin className={iconClasses} />
          <p className="text-xs/snug truncate">{location.split("\n")[0]}</p>
        </div>
      )}
    </div>
  );
}

export function CalendarEvent({
  props,
}: BaseComponentProps<CalendarEventProps>) {
  return <CalendarEventView {...props} />;
}
