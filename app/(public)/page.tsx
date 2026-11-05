import { HomeHero } from "@/components/public/home-hero"
import { JsonLd } from "@/components/public/json-ld"
import type { Metadata } from "next"
import { getCompanyPublicInfoCached } from "@/lib/get-company-settings-cached"
import { buildHomepageJsonLd } from "@/lib/seo/homepage-json-ld"
import { buildHomepageMetadata } from "@/lib/seo/homepage-metadata"
import {
  DEFAULT_HOMEPAGE_H1,
  getHomepageSettingsCached,
} from "@/lib/seo/load-homepage-settings"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomepageSettingsCached()
  return buildHomepageMetadata(settings)
}

export default async function HomePage() {
  const [settings, company] = await Promise.all([
    getHomepageSettingsCached(),
    getCompanyPublicInfoCached(),
  ])

  const jsonLd = buildHomepageJsonLd({ settings, company })

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeHero
        title={settings.h1 || DEFAULT_HOMEPAGE_H1}
        description={settings.description}
        videoUrl={settings.coverVideo || null}
        posterUrl={settings.coverImage || null}
      />
    </>
  )
}
