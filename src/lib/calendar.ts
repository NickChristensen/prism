import {
  compareAsc,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";

export function compareCalendarStarts(
  left: { start: string },
  right: { start: string },
): number {
  return compareAsc(parseISO(left.start), parseISO(right.start));
}

export function getMinutesBetween(startTime: string, endTime: string): number {
  return Math.max(
    differenceInMinutes(parseISO(endTime), parseISO(startTime)),
    0,
  );
}

export function getCalendarDayKey(value: string): string {
  return format(parseISO(value), "yyyy-MM-dd");
}

export function formatCalendarDayHeading(value: string): string {
  return format(parseISO(value), "EEE, MMM d");
}

export function formatCalendarTime(value: string): string {
  return format(parseISO(value), "h:mm a").replace(":00 ", " ");
}

export function formatCalendarDuration(minutes: number): string {
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
