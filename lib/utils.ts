import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** First letter uppercase, rest lowercase — for CAPS names from CMS. */
export function toSentenceCase(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return value
  const lower = trimmed.toLocaleLowerCase("en")
  return lower.charAt(0).toLocaleUpperCase("en") + lower.slice(1)
}
