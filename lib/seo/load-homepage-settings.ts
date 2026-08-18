import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { isLegacyPestCopy } from "@/lib/site-config"

const HOMEPAGE_SETTING_KEYS = [
  "homepage_h1",
  "homepage_description",
  "homepage_cover_image",
] as const

export type HomepageSettings = {
  h1: string
  description: string
  coverImage: string
}

export const DEFAULT_HOMEPAGE_H1 = "SIDHE Wellbeing"

export const DEFAULT_HOMEPAGE_DESCRIPTION =
  "Wellbeing, balance, and care for a better quality of life."

function resolveCopy(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim() ?? ""
  if (!trimmed || isLegacyPestCopy(trimmed)) {
    return fallback
  }
  return trimmed
}

export function resolveHomepageSettings(input: {
  h1?: string | null
  description?: string | null
  coverImage?: string | null
}): HomepageSettings {
  return {
    h1: resolveCopy(input.h1, DEFAULT_HOMEPAGE_H1),
    description: resolveCopy(input.description, DEFAULT_HOMEPAGE_DESCRIPTION),
    coverImage: input.coverImage?.trim() ?? "",
  }
}

export const getHomepageSettingsCached = unstable_cache(
  async (): Promise<HomepageSettings> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [...HOMEPAGE_SETTING_KEYS])

    const getValue = (key: (typeof HOMEPAGE_SETTING_KEYS)[number]) =>
      data?.find((row) => row.key === key)?.value?.trim() ?? ""

    return resolveHomepageSettings({
      h1: getValue("homepage_h1"),
      description: getValue("homepage_description"),
      coverImage: getValue("homepage_cover_image"),
    })
  },
  ["homepage-settings"],
  { tags: ["site-settings"] }
)
