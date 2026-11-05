"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteEmblem } from "@/components/public/site-emblem"
import type { Category, Subcategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const MAX_VISIBLE_CATEGORIES = 7

type Props = {
  categories: (Category & { subcategories: Subcategory[] })[]
}

export function Header({ categories }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES)
  const hiddenCategories = categories.slice(MAX_VISIBLE_CATEGORIES)
  /** Transparent white overlay only on the fullscreen homepage video. */
  const isHomeOverlay = pathname === "/" && !open
  const solid = !isHomeOverlay

  const ghostNavClass = solid
    ? "text-sm font-medium text-muted-foreground hover:text-foreground"
    : "text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"

  const iconGhostClass = solid
    ? undefined
    : "text-white hover:bg-white/10 hover:text-white"

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        solid
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 text-lg font-normal tracking-tight transition-colors hover:opacity-90",
              solid ? "text-foreground" : "text-white"
            )}
          >
            <SiteEmblem
              className={cn(
                "h-9 w-9 lg:h-10 lg:w-10 transition-colors",
                solid ? "text-brand" : "text-white"
              )}
              decorative
            />
            <span className="flex flex-col gap-0 leading-none">
              <span className="text-lg font-normal leading-none tracking-tight">
                SIDHE
              </span>
              <span className="text-xs font-medium leading-none tracking-[0.14em]">
                WELLBEING
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {visibleCategories.map((cat) => (
              <CategoryNavItem
                key={cat.id}
                category={cat}
                linkClasses={ghostNavClass}
              />
            ))}

            {hiddenCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className={ghostNavClass} />
                  }
                >
                  More
                  <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[16rem] p-2"
                >
                  {hiddenCategories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      render={<Link href={`/${cat.slug}`} />}
                    >
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div
              className={cn(
                "mx-1.5 h-5 w-px",
                solid ? "bg-border/50" : "bg-white/25"
              )}
            />

            <ThemeToggle className={iconGhostClass} />

            <Link href="/contact">
              <Button variant="ghost" className={ghostNavClass}>
                Contact
              </Button>
            </Link>

            <Link href="/pricing" className="ml-1">
              <Button
                variant="brand"
                size="sm"
                className={
                  solid
                    ? undefined
                    : "border border-white/40 bg-white text-zinc-950 hover:bg-white/90 hover:text-zinc-950"
                }
              >
                Upcoming events
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle className={iconGhostClass} />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={iconGhostClass}
                  />
                }
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle className="text-lg font-normal px-4 pb-2">
                  Menu
                </SheetTitle>
                <nav className="flex flex-col gap-0.5 px-4">
                  {categories.map((cat) => {
                    if (isHomeCategory(cat)) {
                      return (
                        <Link
                          key={cat.id}
                          href="/"
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        >
                          Home
                        </Link>
                      )
                    }

                    return (
                      <div key={cat.id}>
                        <Link
                          href={`/${cat.slug}`}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories?.length > 0 && (
                          <div className="ml-3 border-l border-border pl-3">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/${cat.slug}/${sub.slug}`}
                                onClick={() => setOpen(false)}
                                className="block px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <div className="border-t border-border my-3" />
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Blog
                  </Link>
                  <Link href="/pricing" onClick={() => setOpen(false)}>
                    <Button variant="brand" className="w-full mt-2">
                      Upcoming events
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function isHomeCategory(category: Category) {
  return category.slug.trim().toLowerCase() === "home"
}

function CategoryNavItem({
  category,
  linkClasses,
}: {
  category: Category & { subcategories: Subcategory[] }
  linkClasses: string
}) {
  if (isHomeCategory(category)) {
    return (
      <Link href="/">
        <Button variant="ghost" className={linkClasses}>
          Home
        </Button>
      </Link>
    )
  }

  if (!category.subcategories || category.subcategories.length === 0) {
    return (
      <Link href={`/${category.slug}`}>
        <Button variant="ghost" className={linkClasses}>
          {category.name}
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className={linkClasses} />}
      >
        {category.name}
        <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[16rem] p-2">
        {category.subcategories.map((sub) => (
          <DropdownMenuItem
            key={sub.id}
            render={<Link href={`/${category.slug}/${sub.slug}`} />}
          >
            {sub.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
