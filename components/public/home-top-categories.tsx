import Image from "next/image"
import Link from "next/link"
import type { Category, Subcategory } from "@/lib/types"

type Cat = Category & { subcategories: Subcategory[] }

type Props = {
  categories: Cat[]
  variant?: "default" | "hero"
}

function CategoryIcon({ svg }: { svg: string | null }) {
  if (!svg?.trim()) return null

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center text-brand [&_svg]:h-7 [&_svg]:w-7 [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:text-brand [&_svg_path:not([fill=none])]:fill-brand [&_svg_circle:not([fill=none])]:fill-brand [&_svg_rect:not([fill=none])]:fill-brand [&_svg_polygon:not([fill=none])]:fill-brand [&_svg_polyline:not([fill=none])]:fill-brand"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function sortSubs(cat: Cat) {
  return [...(cat.subcategories ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  )
}

function SubcategoryOverlayCard({
  cat,
  sub,
  sizes,
}: {
  cat: Cat
  sub: Subcategory
  sizes: string
}) {
  return (
    <li>
      <Link
        href={`/${cat.slug}/${sub.slug}`}
        className="group block overflow-hidden rounded-xl border-2 border-border bg-background transition-colors hover:border-brand"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          {sub.cover_image_url ? (
            <Image
              src={sub.cover_image_url}
              alt=""
              fill
              quality={100}
              className="object-cover transition-transform duration-300"
              sizes={sizes}
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20"
              aria-hidden
            />
          )}
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-4 pt-16"
            aria-hidden
          />
          <p className="absolute inset-x-0 bottom-0 px-3 pb-4 text-left text-base font-normal leading-snug text-white drop-shadow-sm md:text-lg">
            {sub.name}
          </p>
        </div>
      </Link>
    </li>
  )
}

export function HomeTopCategories({
  categories,
  variant = "default",
}: Props) {
  if (categories.length === 0) return null

  const hero = variant === "hero"

  return (
    <section
      className={
        hero
          ? "text-foreground"
          : "border-border bg-muted pt-12 pb-16 text-foreground md:pt-16 dark:bg-background"
      }
    >
      <div className={hero ? "w-full" : "mx-auto w-full max-w-6xl px-4"}>
        <div className={hero ? "grid grid-cols-1 gap-8" : "grid grid-cols-1 gap-12 lg:gap-14"}>
          {categories.map((cat, index) => {
            const subs = sortSubs(cat)

            return (
              <div
                key={cat.id}
                className={
                  index > 0
                    ? hero
                      ? "border-t border-white/20 pt-8"
                      : "border-t border-border pt-10 lg:pt-12"
                    : undefined
                }
              >
                <Link
                  href={`/${cat.slug}`}
                  className="inline-flex items-center gap-3 rounded-lg transition-opacity hover:opacity-80"
                >
                  <CategoryIcon svg={cat.icon_svg} />
                  <h2
                    className={`text-xl font-normal tracking-tight md:text-2xl ${hero ? "text-white" : ""}`}
                  >
                    {cat.name}
                  </h2>
                </Link>

                {subs.length > 0 ? (
                  <ul className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
                    {subs.map((sub) => (
                      <SubcategoryOverlayCard
                        key={sub.id}
                        cat={cat}
                        sub={sub}
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 40vw, 640px"
                      />
                    ))}
                  </ul>
                ) : cat.cover_image_url ? (
                  <Link
                    href={`/${cat.slug}`}
                    className="mt-6 block max-w-xs overflow-hidden rounded-xl border border-border transition-colors hover:border-brand/40"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                      <Image
                        src={cat.cover_image_url}
                        alt=""
                        fill
                        quality={100}
                        className="object-cover"
                        sizes="640px"
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-16"
                        aria-hidden
                      />
                      <p className="absolute inset-x-0 bottom-0 px-4 pb-4 text-left text-base font-normal text-white drop-shadow-sm md:text-lg">
                        {cat.name}
                      </p>
                    </div>
                  </Link>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
