import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isSameDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "";
  
  const nameParts = name.split(" ");
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (
    nameParts[0].charAt(0).toUpperCase() + 
    nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  );
}

export function formatDate(date: string | Date, formatString: string = "MMM d, yyyy"): string {
  if (!date) return "";
  
  if (typeof date === "string") {
    return format(parseISO(date), formatString);
  }
  
  return format(date, formatString);
}

export function formatTime(date: string | Date, formatString: string = "h:mm a"): string {
  if (!date) return "";
  
  if (typeof date === "string") {
    return format(parseISO(date), formatString);
  }
  
  return format(date, formatString);
}

export function formatDateTime(date: string | Date): string {
  if (!date) return "";
  
  if (typeof date === "string") {
    return format(parseISO(date), "MMM d, yyyy | h:mm a");
  }
  
  return format(date, "MMM d, yyyy | h:mm a");
}

export function isToday(date: string | Date): boolean {
  if (!date) return false;
  
  if (typeof date === "string") {
    return isSameDay(parseISO(date), new Date());
  }
  
  return isSameDay(date, new Date());
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function generateCalendarDays(year: number, month: number): Array<{ date: number; currentMonth: boolean }> {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const days = [];
  
  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      currentMonth: false
    });
  }
  
  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      currentMonth: true
    });
  }
  
  // Next month's days
  const remainingDays = 42 - days.length; // 6 rows * 7 columns
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      currentMonth: false
    });
  }
  
  return days;
}

export function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "";
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const diffMs = end.getTime() - start.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  if (diffHrs === 1) return "1 hour";
  if (diffHrs < 1) {
    const diffMins = diffMs / (1000 * 60);
    return `${diffMins} minutes`;
  }
  
  const hours = Math.floor(diffHrs);
  const minutes = Math.floor((diffHrs - hours) * 60);
  
  if (minutes === 0) return `${hours} hours`;
  return `${hours}.${minutes} hours`;
}
