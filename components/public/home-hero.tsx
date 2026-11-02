import Image from "next/image"
import { HomeTopCategories } from "@/components/public/home-top-categories"
import type { Category, Subcategory } from "@/lib/types"

type TopCategory = Category & { subcategories: Subcategory[] }

type Props = {
  title: string
  description?: string | null
  imageUrl?: string | null
  topCategories?: TopCategory[]
}

export function HomeHero({
  title,
  description,
  imageUrl,
  topCategories,
}: Props) {
  const customSrc = imageUrl?.trim()
  const src = customSrc || ""
  const columns = topCategories?.slice(0, 4) ?? []

  return (
    <>
      <section className="relative flex min-h-[75vh] w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950" aria-hidden>
          {src ? (
            <Image
              src={src}
              alt=""
              fill
              priority
              quality={100}
              className="object-cover object-center"
              sizes="100vw"
            />
          ) : null}
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pt-54 pb-16">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl font-normal leading-[1.05] tracking-tight text-white sm:text-3xl md:text-6xl">
              {title}
            </h1>

            {description ? (
              <p className="mx-auto mt-6 max-w-xl text-2xl font-normal leading-relaxed text-white/90 md:mt-8 lg:mx-0">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {columns.length > 0 ? <HomeTopCategories categories={columns} /> : null}
    </>
  )
}
