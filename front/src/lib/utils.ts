import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to round numbers to 2 decimal places
export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Utility function to format percentage with 2 decimal places
export function formatPercentage(value: number): string {
  return `${roundToTwoDecimals(value)}%`;
}

// Utility function to format decimal numbers
export function formatDecimal(value: number): string {
  return roundToTwoDecimals(value).toString();
}
