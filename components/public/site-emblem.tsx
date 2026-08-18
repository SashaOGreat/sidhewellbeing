import { AudioLines } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  /** If the logo is part of a link that already has text, leave true (hidden from screen readers). */
  decorative?: boolean
}

/**
 * Brand logo for the site.
 */
export function SiteEmblem({ className, decorative = true }: Props) {
  return (
    <AudioLines
      className={cn("shrink-0 text-brand", className)}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "SIDHE Wellbeing"}
    />
  )
}
