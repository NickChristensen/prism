import { Clock, MapPin } from "lucide-react";
import {
  formatCalendarTime,
  getMinutesBetween,
  isAllDayEvent,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 64;
const ALL_DAY_HEIGHT = 48;

function getHeight(minutes: number): number {
  return Math.max((minutes / 60) * HOUR_HEIGHT, 16) + 16;
}

function getShadeScale(color: string) {
  const whiteFormats = ["#ffffff", "#fff", "#ffffff00", "white"];
  color = whiteFormats.includes(color) ? "var(--muted-foreground)" : color;
  return {
    background: `color-mix(in oklab, var(--background) 82%, ${color} 18%)`,
    border: `color-mix(in oklab, var(--background) 50%, ${color} 50%)`,
    stripe: color,
    text: `color-mix(in oklab, var(--foreground) 25%, ${color} 75%)`,
  };
}

export type CalendarEventProps = {
  summary: string;
  start: string;
  end: string;
  location?: string;
  backgroundColor: string;
};

export function CalendarEvent({
  summary,
  start,
  end,
  location,
  backgroundColor = "var(--primary)",
}: CalendarEventProps) {
  const allDay = isAllDayEvent(start, end);
  const height = allDay
    ? ALL_DAY_HEIGHT
    : getHeight(getMinutesBetween(start, end));
  const shades = getShadeScale(backgroundColor);
  const iconWrapperClasses = "flex items-center gap-0.5";
  const iconClasses = "w-2.5 h-2.5 shrink-0";
  const layoutInline = allDay || height < 48;
  return (
    <div
      className="rounded-lg overflow-hidden flex p-2 border text-xs/snug"
      style={{
        borderColor: shades.border,
        backgroundColor: shades.background,
        color: shades.text,
        height,
      }}
    >
      <div
        className="w-1 shrink-0 rounded-sm"
        style={{ backgroundColor: shades.stripe }}
      />

      <div
        className={cn(
          "pl-2 grow shrink-0",
          layoutInline && "flex gap-2 items-center",
        )}
      >
        <p className="font-bold">{summary}</p>
        {allDay || (
          <div className={iconWrapperClasses}>
            <Clock className={iconClasses} />
            <p>
              {formatCalendarTime(start)} - {formatCalendarTime(end)}
            </p>
          </div>
        )}
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
          <p className="truncate">{location.split("\n")[0]}</p>
        </div>
      )}
    </div>
  );
}
