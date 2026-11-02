import Image from "next/image"
import Link from "next/link"
import type { Category, Subcategory } from "@/lib/types"
import { toSentenceCase } from "@/lib/utils"

type Cat = Category & { subcategories: Subcategory[] }

type Props = {
  categories: Cat[]
  variant?: "default" | "hero"
}

function CategoryCard({ cat, sizes }: { cat: Cat; sizes: string }) {
  const imageUrl =
    cat.cover_image_url?.trim() ||
    [...(cat.subcategories ?? [])].sort(
      (a, b) => a.display_order - b.display_order
    )[0]?.cover_image_url

  return (
    <li>
      <Link
        href={`/${cat.slug}`}
        className="group block overflow-hidden rounded-xl border-2 border-border bg-background transition-colors hover:border-brand"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
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
            {toSentenceCase(cat.name)}
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
      <div className={hero ? "w-full" : "mx-auto w-full max-w-6xl px-4 -mt-36"}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
