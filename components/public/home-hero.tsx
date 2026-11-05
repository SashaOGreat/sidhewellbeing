import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  title: string
  description?: string | null
  videoUrl?: string | null
  posterUrl?: string | null
}

export function HomeHero({
  title,
  description,
  videoUrl,
  posterUrl,
}: Props) {
  const videoSrc = videoUrl?.trim() || ""
  const poster = posterUrl?.trim() || undefined

  return (
    <section className="relative flex min-h-dvh w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-zinc-950" aria-hidden>
        {videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
          >
            <source src={videoSrc} />
          </video>
        ) : null}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-28 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-normal leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-lg font-normal leading-relaxed text-white/90 md:mt-8 md:text-xl">
              {description}
            </p>
          ) : null}

          <div className="mt-10 md:mt-12">
            <Button
              size="lg"
              className="h-14 px-8 text-base md:h-16 md:px-10 md:text-lg"
              nativeButton={false}
              render={<Link href="/pricing" />}
            >
              Upcoming events
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
