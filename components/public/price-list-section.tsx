import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  type CompanyPublicInfo,
  whatsAppMeUrl,
  withHttps,
} from "@/lib/company-site-settings"
import type { PriceListItem } from "@/lib/types"
import { cn } from "@/lib/utils"

type PriceListSubsection = {
  title: string
  items: PriceListItem[]
}

export type PriceListContentProps = {
  title: string
  items: PriceListItem[]
  subcategories?: PriceListSubsection[]
  whatsAppUrl?: string
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.96.52 3.8 1.44 5.4L2 22l4.93-1.55a10 10 0 0 0 5.11 1.39h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.77 14.05c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.26-4.78-4.2-4.93-4.39-.14-.19-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.67.79 1.95.93.28.14.47.21.54.33.07.12.07.69-.17 1.37z" />
    </svg>
  )
}

function PriceListBento({
  items,
  whatsAppUrl,
}: {
  items: PriceListItem[]
  whatsAppUrl?: string
}) {
  if (items.length === 0) return null

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, index) => {
        const imageUrl = (item.image_url ?? "").trim()
        const description = (item.description ?? "").trim()
        const price = (item.price ?? "").trim()
        const featured = items.length >= 3 && index % 3 === 0

        return (
          <li
            key={item.id}
            className={cn(featured && "sm:col-span-2")}
          >
            <article
              className={cn(
                "group flex h-full flex-col overflow-hidden rounded-xl border-2 border-border bg-background",
                "transition-colors hover:border-brand"
              )}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-muted",
                  featured ? "aspect-[2/1]" : "aspect-[4/3]"
                )}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes={
                      featured
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 720px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 360px"
                    }
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20"
                    aria-hidden
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 text-base font-normal leading-snug tracking-tight sm:text-lg">
                    {item.name}
                  </h3>
                  {price ? (
                    <p className="shrink-0 whitespace-nowrap text-sm font-medium tabular-nums text-brand sm:text-base">
                      {price}
                    </p>
                  ) : null}
                </div>
                {description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                ) : null}
                {whatsAppUrl ? (
                  <Button
                    variant="brand"
                    size="lg"
                    className="mt-auto h-12 w-full gap-2 text-base"
                    nativeButton={false}
                    render={
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <WhatsAppGlyph className="size-5" />
                    WhatsApp me
                  </Button>
                ) : null}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 22v-9.5h3.2l.5-3.7h-3.7V6.6c0-1.07.3-1.8 1.9-1.8h2V1.4C16.9 1.2 15.5 1 13.9 1 10.4 1 8 3 8 6.3v2.5H5v3.7h3V22h5.5z" />
    </svg>
  )
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ContactRow({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function CompanyContactLinks({
  company,
}: {
  company: CompanyPublicInfo
}) {
  const ig = withHttps(company.instagramUrl)
  const fb = withHttps(company.facebookUrl)

  return (
    <div className="space-y-4">
      {company.phone ? (
        <ContactRow icon={<Phone className="h-4 w-4" aria-hidden />}>
          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {company.phone}
          </a>
        </ContactRow>
      ) : null}

      {ig || fb ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {ig ? (
            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1 px-1 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <InstagramGlyph className="h-4 w-4 shrink-0" />
              Instagram
            </a>
          ) : null}
          {fb ? (
            <a
              href={fb}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1 px-1 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <FacebookGlyph className="h-4 w-4 shrink-0" />
              Facebook
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function PriceListContactBanner({
  company,
  stickySidebar = true,
  showMessageButton = true,
  children,
}: {
  company: CompanyPublicInfo
  /** Stays on the left while scrolling on the price list; turn off in the bottom CTA section. */
  stickySidebar?: boolean
  showMessageButton?: boolean
  children?: ReactNode
}) {
  return (
    <aside
      className={cn(stickySidebar && "lg:sticky lg:top-24")}
    >
      <div className="">
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0">
              <p className="font-normal tracking-tight">
                {company.displayName}
              </p>
              {company.tagline ? (
                <p className="mt-1 text-sm text-muted-foreground">{company.tagline}</p>
              ) : null}
            </div>
          </div>
        </div>

        <CompanyContactLinks company={company} />

        {showMessageButton ? (
          <Button
            variant="brand"
            className="mt-4"
            size="lg"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            <MessageCircle className="h-4 w-4" />
            Write a message
          </Button>
        ) : null}

        {children}
      </div>
    </aside>
  )
}

export function PriceListWithContactGrid({
  company,
  children,
}: {
  company: CompanyPublicInfo
  children: ReactNode
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
        <PriceListContactBanner company={company} />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

export function PriceListContent({
  title,
  items,
  subcategories = [],
  whatsAppUrl,
}: PriceListContentProps) {
  const hasCategoryItems = items.length > 0
  const hasSubcategories = subcategories.some((sub) => sub.items.length > 0)

  if (!hasCategoryItems && !hasSubcategories) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal tracking-tight">{title}</h2>
      </div>

      <div className="space-y-6">
        {hasCategoryItems ? (
          <PriceListBento items={items} whatsAppUrl={whatsAppUrl} />
        ) : null}

        {subcategories.map((subcategory) =>
          subcategory.items.length > 0 ? (
            <div key={subcategory.title} className="space-y-3">
              <h3 className="text-lg font-normal">{subcategory.title}</h3>
              <PriceListBento
                items={subcategory.items}
                whatsAppUrl={whatsAppUrl}
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}

/** Price list + contact banner in a grid (contact on the left, price list on the right). */
export function PriceListSection({
  company,
  title,
  items,
  subcategories = [],
}: Omit<PriceListContentProps, "whatsAppUrl"> & {
  company: CompanyPublicInfo
}) {
  const whatsAppUrl = whatsAppMeUrl(company.phone)
  const content = (
    <PriceListContent
      title={title}
      items={items}
      subcategories={subcategories}
      whatsAppUrl={whatsAppUrl}
    />
  )

  return (
    <PriceListWithContactGrid company={company}>{content}</PriceListWithContactGrid>
  )
}
