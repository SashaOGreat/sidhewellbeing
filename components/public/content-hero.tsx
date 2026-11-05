import Image from "next/image"
import {
  HeroBreadcrumbs,
  type HeroBreadcrumbItem,
} from "@/components/public/hero-breadcrumbs"

type Props = {
  title: string
  description?: string | null
  imageUrl?: string | null
  breadcrumbs?: HeroBreadcrumbItem[]
}

/**
 * Hero for category and subcategory pages.
 * Sharp cover image; title overlaps into the image without a fade overlay.
 */
export function ContentHero({ title, description, imageUrl, breadcrumbs }: Props) {
  const src = imageUrl?.trim() || ""

  return (
    <section className="relative min-h-[min(56vh,520px)] overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(56vh,520px)] bg-muted"
        aria-hidden
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : null}
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-6 pt-[calc(min(56vh,520px)-11rem)] md:pb-8 md:pt-[calc(min(56vh,520px)-14rem)]">
        {breadcrumbs?.length ? <HeroBreadcrumbs items={breadcrumbs} /> : null}
        <h1 className="text-4xl font-normal tracking-tight text-foreground md:text-5xl lg:text-6xl lg:leading-[1.05] xl:text-7xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
