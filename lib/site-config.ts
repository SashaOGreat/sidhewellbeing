export const DEFAULT_SITE_NAME = "SIDHE Wellbeing"

export const DEFAULT_SITE_DESCRIPTION =
  "Wellbeing, balance, and care for a better quality of life."

/** Public site / company name in the title. E.g. NEXT_PUBLIC_SITE_NAME=SIDHE Wellbeing */
export function getSiteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || DEFAULT_SITE_NAME
}

/** Root URL without a trailing slash. E.g. NEXT_PUBLIC_SITE_URL=https://www.example.com */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "").replace(/\/$/, "")
}

export function joinWithPipe(...parts: (string | null | undefined)[]): string {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" | ")
}

/** Page segments plus an optional site name from ENV (not hard-coded). */
export function buildMetaTitle(...segments: string[]): string {
  const siteName = getSiteName()
  const all = siteName ? [...segments, siteName] : segments
  return joinWithPipe(...all)
}

export function absoluteSitePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const base = getSiteUrl()
  return base ? `${base}${normalized}` : normalized
}
