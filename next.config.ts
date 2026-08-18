import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      /** Cover upload via Server Actions (default 1 MB). */
      bodySizeLimit: "8mb",
    },
  },
  async redirects() {
    return [
      { source: "/admin/obsah", destination: "/admin/content", permanent: false },
      {
        source: "/admin/obsah/kategoria/:categoryId/podkategoria/:subcategoryId",
        destination:
          "/admin/content/category/:categoryId/subcategory/:subcategoryId",
        permanent: false,
      },
      {
        source: "/admin/obsah/kategoria/:categoryId",
        destination: "/admin/content/category/:categoryId",
        permanent: false,
      },
      { source: "/kontakt", destination: "/contact", permanent: true },
      { source: "/cennik", destination: "/pricing", permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    /** Values used in <Image quality={…}> (Next.js 16 requires an explicit list). */
    qualities: [75, 100],
    /** fill + object-cover in aspect-[2/3] needs a higher resolution than the layout width. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 828],
  },
}

export default nextConfig
