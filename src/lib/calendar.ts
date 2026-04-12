import {
  compareAsc,
  differenceInCalendarDays,
  differenceInMinutes,
  format,
  isEqual,
  startOfDay,
  parseISO,
} from "date-fns";

const MINUTES_PER_DAY = 24 * 60;

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

export function isAllDayEvent(startTime: string, endTime: string): boolean {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  return (
    isEqual(start, startOfDay(start)) &&
    isEqual(end, startOfDay(end)) &&
    differenceInCalendarDays(end, start) >= 1 &&
    getMinutesBetween(startTime, endTime) >= MINUTES_PER_DAY
  );
}
