import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import {
  CalendarEventView,
  calendarEventPropsSchema,
} from "@/components/catalog/calendar-event";

function toDate(value: string): Date {
  return new Date(value);
}

function getMinutesBetween(startTime: string, endTime: string): number {
  const start = toDate(startTime);
  const end = toDate(endTime);

  return Math.max((end.getTime() - start.getTime()) / 60000, 0);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hourLabel = hours === 1 ? "hour" : "hours";

  if (remainingMinutes === 0) {
    return `${hours} ${hourLabel}`;
  }

  return `${hours} ${hourLabel} ${remainingMinutes} minutes`;
}

export const calendarAgendaPropsSchema = z.object({
  events: z.array(calendarEventPropsSchema),
});

type CalendarAgendaProps = z.infer<typeof calendarAgendaPropsSchema>;

export const calendarAgendaDefinition = {
  props: calendarAgendaPropsSchema,
  description:
    "Use for a chronological set of events when you want to show a schedule, agenda, or multiple calendar events rather than a single event. Pass an events array with ISO datetimes; the component sorts events by start time and inserts gap markers between them automatically.",
  example: {
    events: [
      {
        summary: "Project Sync",
        start: "2026-04-09T09:00:00-05:00",
        end: "2026-04-09T09:30:00-05:00",
        location: "Zoom",
        backgroundColor: "#0088ff",
      },
      {
        summary: "Lunch",
        start: "2026-04-09T12:00:00-05:00",
        end: "2026-04-09T13:00:00-05:00",
        backgroundColor: "#16a34a",
      },
    ],
  },
};

function GhostGap({ minutes }: { minutes: number }) {
  return (
    <div className="flex h-8 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
      <span className="text-sm text-muted-foreground">
        {formatDuration(minutes)}
      </span>
    </div>
  );
}

export function CalendarAgenda({
  props,
}: BaseComponentProps<CalendarAgendaProps>) {
  const sortedEvents = [...props.events].sort(
    (left, right) =>
      toDate(left.start).getTime() - toDate(right.start).getTime(),
  );

  const items: Array<
    | { type: "gap"; minutes: number }
    | { type: "event"; event: (typeof sortedEvents)[number] }
  > = [];

  sortedEvents.forEach((event, index) => {
    if (index > 0) {
      const previousEvent = sortedEvents[index - 1];
      const gapMinutes = getMinutesBetween(previousEvent.end, event.start);

      if (gapMinutes > 0) {
        items.push({
          type: "gap",
          minutes: gapMinutes,
        });
      }
    }

    items.push({
      type: "event",
      event,
    });
  });

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) =>
        item.type === "gap" ? (
          <GhostGap key={`gap-${index}`} minutes={item.minutes} />
        ) : (
          <CalendarEventView
            key={`${item.event.start}-${item.event.summary}-${index}`}
            {...item.event}
          />
        ),
      )}
    </div>
  );
}
