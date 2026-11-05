"use client"

import { usePathname } from "next/navigation"

/** Hides footer chrome on the fullscreen homepage. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/") return null
  return children
}
