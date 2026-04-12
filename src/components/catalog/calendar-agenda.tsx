import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";
import { calendarEventPropsSchema } from "@/components/catalog/calendar-event";
import { CalendarEvent } from "@/components/presentational/calendar-event";
import {
  compareCalendarStarts,
  formatCalendarDuration,
  formatCalendarDayHeading,
  getCalendarDayKey,
  getMinutesBetween,
} from "@/lib/calendar";

export const calendarAgendaPropsSchema = z.object({
  events: z.array(calendarEventPropsSchema),
});

type CalendarAgendaProps = z.infer<typeof calendarAgendaPropsSchema>;

export const calendarAgendaDefinition = {
  props: calendarAgendaPropsSchema,
  description:
    "Use for a chronological set of events when you want to show a schedule, agenda, or multiple calendar events rather than a single event. Pass an events array with ISO datetimes; Events are rendered grouped by day, and sorted chronologically.",
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
    <div className="flex py-1 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
      <span className="text-sm text-muted-foreground">
        {formatCalendarDuration(minutes)}
      </span>
    </div>
  );
}

type CalendarAgendaEvent = CalendarAgendaProps["events"][number];

function CalendarDay({ events }: { events: CalendarAgendaEvent[] }) {
  const sortedEvents = [...events].sort(compareCalendarStarts);

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
          <CalendarEvent
            key={`${item.event.start}-${item.event.summary}-${index}`}
            {...item.event}
          />
        ),
      )}
    </div>
  );
}

function DateHeading({ date }: { date: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {formatCalendarDayHeading(date)}
    </p>
  );
}

export function CalendarAgenda({
  props,
}: BaseComponentProps<CalendarAgendaProps>) {
  const eventsByDay = new Map<string, CalendarAgendaEvent[]>();

  for (const event of props.events) {
    const dayKey = getCalendarDayKey(event.start);
    const dayEvents = eventsByDay.get(dayKey);

    if (dayEvents) {
      dayEvents.push(event);
    } else {
      eventsByDay.set(dayKey, [event]);
    }
  }

  const dayGroups = [...eventsByDay.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const showDayHeadings = dayGroups.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {dayGroups.map(([day, events]) => (
        <div key={day} className="flex flex-col gap-2">
          {showDayHeadings ? (
            <DateHeading date={events[0]?.start ?? day} />
          ) : null}
          <CalendarDay events={events} />
        </div>
      ))}
    </div>
  );
}
