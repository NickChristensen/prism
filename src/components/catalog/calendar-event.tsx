import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { CalendarEvent as CalendarEventView } from "@/components/presentational/calendar-event";

export const calendarEventPropsSchema = z.object({
  summary: z.string().min(1),
  start: z.iso.datetime(),
  end: z.iso.datetime(),
  all_day: z.boolean().default(false),
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
    all_day: false,
    location: "Zoom",
    backgroundColor: "#0088ff",
  },
};

export function CalendarEvent({
  props,
}: BaseComponentProps<CalendarEventProps>) {
  return <CalendarEventView {...(props as CalendarEventProps)} />;
}
