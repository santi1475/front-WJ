import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a date string (like "YYYY-MM-DD") in the local timezone,
 * preventing the default JS behavior of treating it as UTC midnight
 * and then subtracting the local timezone offset.
 */
export function formatLocalDate(dateString?: string | null): string {
  if (!dateString) return "";

  // If it's a typical YYYY-MM-DD from Django
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[2].split("T")[0], 10); // Handle "2024-05-10T00:00:00Z" gracefully just in case

    return new Date(year, month, day).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Fallback for full ISO timestamps or unexpected formats
  return new Date(dateString).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns a Date object representing the given date string without timezone shift.
 */
export function parseLocalDate(dateString?: string | null): Date | null {
  if (!dateString) return null;
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2].split("T")[0], 10);
    return new Date(year, month, day);
  }
  return new Date(dateString);
}
