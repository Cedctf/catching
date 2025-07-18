import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine and merge Tailwind CSS classes
 * @param {...any} inputs - Class names to combine
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}