import { SnipframeEmbed } from "@/components/public/snipframe-embed"

export function SnipframeSection() {
  const embedApi = process.env.NEXT_PUBLIC_SNIPFRAME_EMBED_API?.trim()
  const host = process.env.NEXT_PUBLIC_SNIPFRAME_HOST?.trim()
  if (!embedApi || !host) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pt-24">
      <div className="grid gap-10 md:gap-14 lg:grid-cols-12 lg:items-stretch lg:gap-8">
        <div className="flex min-w-0 items-center lg:col-span-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-normal tracking-tight text-foreground md:text-3xl lg:leading-tight">
              More insights
            </h3>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We asked AI....
            </p>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <SnipframeEmbed />
        </div>
      </div>
    </section>
  )
}
