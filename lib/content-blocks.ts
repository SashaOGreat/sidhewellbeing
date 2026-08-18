import type {
  ContentBlock,
  ContentBlockType,
  GridLayoutId,
  SubBlockType,
} from "@/lib/types"

export const GRID_LAYOUT_IDS: GridLayoutId[] = [
  "1",
  "2",
  "3",
  "4",
  "2x2",
  "3x3",
]

export const GRID_LAYOUT_LABELS: Record<GridLayoutId, string> = {
  "1": "1 column",
  "2": "2 columns",
  "3": "3 columns",
  "4": "4 columns",
  "2x2": "2×2 grid",
  "3x3": "3×3 grid",
}

/** Number of cells in a grid layout. */
export function gridLayoutCellCount(layout: GridLayoutId): number {
  switch (layout) {
    case "1":
      return 1
    case "2":
      return 2
    case "3":
      return 3
    case "4":
      return 4
    case "2x2":
      return 4
    case "3x3":
      return 9
    default: {
      const _x: never = layout
      return _x
    }
  }
}

export function isGridLayoutId(v: string): v is GridLayoutId {
  return (GRID_LAYOUT_IDS as readonly string[]).includes(v)
}

/** Tailwind classes for the public site (responsive columns). */
export function publicGridColsClass(layout: GridLayoutId): string {
  switch (layout) {
    case "1":
      return "grid-cols-1"
    case "2":
      return "grid-cols-1 md:grid-cols-2"
    case "3":
      return "grid-cols-1 md:grid-cols-3"
    case "4":
      return "grid-cols-2 md:grid-cols-4"
    case "2x2":
      return "grid-cols-2"
    case "3x3":
      return "grid-cols-2 md:grid-cols-3"
    default: {
      const _e: never = layout
      return _e
    }
  }
}

/** Admin editor: grid matching the selected layout (column count is obvious at a glance). */
export function adminEditorGridColsClass(layout: GridLayoutId): string {
  switch (layout) {
    case "1":
      return "grid-cols-1"
    case "2":
      return "grid-cols-1 sm:grid-cols-2"
    case "3":
      return "grid-cols-1 sm:grid-cols-3"
    case "4":
      return "grid-cols-2 sm:grid-cols-4"
    case "2x2":
      return "grid-cols-2"
    case "3x3":
      return "grid-cols-2 sm:grid-cols-3"
    default: {
      const _e: never = layout
      return _e
    }
  }
}

/** Smaller type and spacing for a dense 3×3 grid. */
export function gridCompactContentClass(layout: GridLayoutId): string {
  if (layout !== "3x3") return ""
  return [
    "gap-3 md:gap-6",
    "[&_h2]:!text-lg [&_h2]:md:!text-xl",
    "[&_h3]:!text-sm [&_h3]:md:!text-base",
    "[&_p]:!text-xs [&_p]:md:!text-sm",
    "[&_.flex-col.gap-2]:!gap-0",
  ].join(" ")
}

export function getGridLayout(block: ContentBlock): GridLayoutId | null {
  if (block.block_type !== "grid") return null
  const d = block.data as Record<string, unknown>
  const raw = d.layout
  if (typeof raw === "string" && isGridLayoutId(raw)) return raw
  return null
}

export function getGridHasBackground(block: ContentBlock): boolean {
  if (block.block_type !== "grid") return false
  const d = block.data as Record<string, unknown>
  return d.has_background === true
}

export function gridBackgroundClass(hasBackground: boolean): string {
  return hasBackground
    ? "rounded-2xl bg-muted p-5 md:p-12"
    : ""
}

const GRID_PUBLIC_BG_BASE = "bg-muted p-5 md:p-12"

/**
 * Public grid background; two or more consecutive backgrounds join visually
 * (top / bottom / no rounding in the middle of the chain).
 */
export function gridPublicBackgroundClass(
  hasBackground: boolean,
  previousHadBackground: boolean | null,
  nextHadBackground: boolean | null
): string {
  if (!hasBackground) return ""

  const prev = previousHadBackground === true
  const next = nextHadBackground === true

  if (prev && next) return GRID_PUBLIC_BG_BASE
  if (prev) return `${GRID_PUBLIC_BG_BASE} rounded-b-2xl !pt-4`
  if (next) return `${GRID_PUBLIC_BG_BASE} rounded-t-2xl !pb-4`
  return `${GRID_PUBLIC_BG_BASE} rounded-2xl`
}

/**
 * Public grids: first uses `mt-18`; two consecutive backgrounds skip top margin;
 * two consecutive without background use `mt-8`; otherwise `mt-18`.
 */
export function gridPublicTopMarginClass(
  hasBackground: boolean,
  previousHadBackground: boolean | null
): string {
  if (previousHadBackground === null) return "mt-18"
  if (hasBackground && previousHadBackground) return ""
  if (!hasBackground && !previousHadBackground) return "mt-8"
  return "mt-18"
}

export function isRootGridBlock(block: ContentBlock): boolean {
  return block.parent_id === null && block.block_type === "grid"
}

export function isSubBlock(block: ContentBlock): block is ContentBlock & {
  block_type: SubBlockType
} {
  return (
    block.parent_id !== null &&
    (block.block_type === "heading" ||
      block.block_type === "text_block" ||
      block.block_type === "icon_heading_text" ||
      block.block_type === "image_heading_text_centered" ||
      block.block_type === "heading_text_image_right" ||
      block.block_type === "media_left_text_right")
  )
}

/** Sub-blocks sorted by cell, then order within the cell. */
export function sortChildBlocks(children: ContentBlock[]): ContentBlock[] {
  return [...children].sort((a, b) => {
    if (a.cell_index !== b.cell_index) return a.cell_index - b.cell_index
    const o = a.display_order - b.display_order
    return o !== 0 ? o : a.id.localeCompare(b.id)
  })
}

export function groupChildBlocksByParent(
  blocks: ContentBlock[]
): Map<string, ContentBlock[]> {
  const m = new Map<string, ContentBlock[]>()
  for (const b of blocks) {
    if (!b.parent_id) continue
    const list = m.get(b.parent_id) ?? []
    list.push(b)
    m.set(b.parent_id, list)
  }
  for (const [, list] of m) {
    sortChildBlocks(list)
  }
  return m
}

export const SUB_BLOCK_TYPES: SubBlockType[] = [
  "heading",
  "text_block",
  "icon_heading_text",
  "image_heading_text_centered",
  "heading_text_image_right",
  "media_left_text_right",
]

/** Types shown in the Components catalogue / sidebar (no grid). */
export const KOMPONENT_CATALOG_TYPES: SubBlockType[] = [
  "heading",
  "text_block",
  "icon_heading_text",
  "image_heading_text_centered",
  "heading_text_image_right",
  "media_left_text_right",
]

export const CONTENT_BLOCK_LABELS: Record<SubBlockType, string> = {
  heading: "Heading",
  text_block: "Text block",
  icon_heading_text: "Icon + heading + text",
  image_heading_text_centered: "Centered image + heading + text",
  heading_text_image_right: "Heading + text + image on the right",
  media_left_text_right: "2 columns: image left, text right",
}

export type ContentBlockLayout = "full" | "grid"

/**
 * @deprecated No longer applies to sub-blocks in grids; kept only for old imports.
 */
export const CONTENT_BLOCK_LAYOUT: Record<SubBlockType, ContentBlockLayout> = {
  heading: "full",
  text_block: "grid",
  icon_heading_text: "grid",
  image_heading_text_centered: "grid",
  heading_text_image_right: "grid",
  media_left_text_right: "grid",
}

export const CONTENT_BLOCK_DATA_FIELDS: Record<
  SubBlockType,
  { key: string; label: string; required?: boolean }[]
> = {
  heading: [
    { key: "title", label: "Heading" },
    { key: "cta_label", label: "CTA button text" },
    { key: "cta_url", label: "CTA URL" },
  ],
  text_block: [
    { key: "heading", label: "Card heading" },
    { key: "content", label: "Text" },
    { key: "cta_label", label: "CTA button text" },
    { key: "cta_url", label: "CTA URL" },
  ],
  icon_heading_text: [
    { key: "icon_url", label: "Icon URL" },
    { key: "icon_size", label: "Icon width (px)" },
    { key: "heading", label: "Heading" },
    { key: "content", label: "Text" },
    { key: "cta_label", label: "CTA button text" },
    { key: "cta_url", label: "CTA URL" },
  ],
  image_heading_text_centered: [
    { key: "image_url", label: "Image URL" },
    { key: "image_size", label: "Image width (px)" },
    { key: "heading", label: "Heading" },
    { key: "content", label: "Text" },
    { key: "cta_label", label: "CTA button text" },
    { key: "cta_url", label: "CTA URL" },
  ],
  heading_text_image_right: [
    { key: "heading", label: "Heading" },
    { key: "content", label: "Text" },
    { key: "image_url", label: "Image URL" },
    { key: "image_size", label: "Image width (px)" },
    { key: "cta_label", label: "CTA button text" },
    { key: "cta_url", label: "CTA URL" },
  ],
  media_left_text_right: [
    { key: "image_url", label: "Image URL" },
    { key: "image_size", label: "Image width (px)" },
    { key: "heading", label: "Heading" },
    { key: "content", label: "Text" },
    { key: "cta_label", label: "CTA button text" },
    { key: "cta_url", label: "CTA URL" },
  ],
}

const SAMPLE_ISO = "1970-01-01T00:00:00.000Z"

export function sampleContentBlock(blockType: SubBlockType): ContentBlock {
  const base = {
    id: `sample-${blockType}`,
    category_id: null,
    subcategory_id: null,
    parent_id: null,
    cell_index: 0,
    block_type: blockType as ContentBlockType,
    display_order: 0,
    created_at: SAMPLE_ISO,
    updated_at: SAMPLE_ISO,
  }
  if (blockType === "heading") {
    return {
      ...base,
      data: { title: "Sample heading", cta_label: "Contact us", cta_url: "/contact" },
    }
  }
  if (blockType === "icon_heading_text") {
    return {
      ...base,
      data: {
        icon_url: "/underline_double.svg",
        icon_size: 50,
        heading: "Block heading",
        content: "Optional description under the heading.",
        cta_label: "Learn more",
        cta_url: "/contact",
      },
    }
  }
  if (blockType === "image_heading_text_centered") {
    return {
      ...base,
      data: {
        image_url: "",
        image_size: 100,
        heading: "Block heading",
        content: "Optional text under the heading.",
        cta_label: "Learn more",
        cta_url: "/contact",
      },
    }
  }
  if (blockType === "heading_text_image_right") {
    return {
      ...base,
      data: {
        heading: "Block heading",
        content: "Block text. The image is aligned to the right.",
        image_url: "",
        image_size: 70,
        cta_label: "Learn more",
        cta_url: "/contact",
      },
    }
  }
  if (blockType === "media_left_text_right") {
    return {
      ...base,
      data: {
        image_url: "",
        image_size: 100,
        heading: "Heading on the right",
        content: "Optional text in the right column.",
        cta_label: "Learn more",
        cta_url: "/contact",
      },
    }
  }
  return {
    ...base,
    data: {
      heading: "Optional card heading",
      content:
        "Sample block text. Use this for a service description, benefits, or a short paragraph.",
      cta_label: "Learn more",
      cta_url: "/contact",
    },
  }
}

export type HeadingBlockData = { title: string } & BlockCtaData
export type BlockCtaData = {
  ctaLabel?: string
  ctaUrl?: string
}
export type TextBlockData = { heading?: string; content: string } & BlockCtaData
export type IconHeadingTextData = {
  iconUrl?: string
  iconSize?: number
  heading?: string
  content?: string
} & BlockCtaData
export type ImageHeadingTextCenteredData = {
  imageUrl?: string
  imageSize?: number
  heading?: string
  content?: string
} & BlockCtaData
export type HeadingTextImageRightData = {
  heading?: string
  content?: string
  imageUrl?: string
  imageSize?: number
} & BlockCtaData
export type MediaLeftTextRightData = {
  imageUrl?: string
  imageSize?: number
  heading?: string
  content?: string
} & BlockCtaData

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : {}
}

function asOptionalString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined
}

function asOptionalSize(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return Math.round(v)
  if (typeof v === "string") {
    const n = parseInt(v, 10)
    if (Number.isFinite(n) && n > 0) return n
  }
  return undefined
}

export function getHeadingData(block: ContentBlock): HeadingBlockData {
  if (block.block_type !== "heading") return { title: "" }
  const d = asRecord(block.data)
  const title = typeof d.title === "string" ? d.title : ""
  return {
    title,
    ctaLabel: asOptionalString(d.cta_label),
    ctaUrl: asOptionalString(d.cta_url),
  }
}

export function getTextBlockData(block: ContentBlock): TextBlockData {
  if (block.block_type !== "text_block") return { content: "" }
  const d = asRecord(block.data)
  const heading = typeof d.heading === "string" ? d.heading : undefined
  const content = typeof d.content === "string" ? d.content : ""
  return {
    heading,
    content,
    ctaLabel: asOptionalString(d.cta_label),
    ctaUrl: asOptionalString(d.cta_url),
  }
}

export function getIconHeadingTextData(block: ContentBlock): IconHeadingTextData {
  if (block.block_type !== "icon_heading_text") return {}
  const d = asRecord(block.data)
  return {
    iconUrl: asOptionalString(d.icon_url),
    iconSize: asOptionalSize(d.icon_size),
    heading: asOptionalString(d.heading),
    content: asOptionalString(d.content),
    ctaLabel: asOptionalString(d.cta_label),
    ctaUrl: asOptionalString(d.cta_url),
  }
}

export function getImageHeadingTextCenteredData(
  block: ContentBlock
): ImageHeadingTextCenteredData {
  if (block.block_type !== "image_heading_text_centered") return {}
  const d = asRecord(block.data)
  return {
    imageUrl: asOptionalString(d.image_url),
    imageSize: asOptionalSize(d.image_size),
    heading: asOptionalString(d.heading),
    content: asOptionalString(d.content),
    ctaLabel: asOptionalString(d.cta_label),
    ctaUrl: asOptionalString(d.cta_url),
  }
}

export function getHeadingTextImageRightData(
  block: ContentBlock
): HeadingTextImageRightData {
  if (block.block_type !== "heading_text_image_right") return {}
  const d = asRecord(block.data)
  return {
    heading: asOptionalString(d.heading),
    content: asOptionalString(d.content),
    imageUrl: asOptionalString(d.image_url),
    imageSize: asOptionalSize(d.image_size),
    ctaLabel: asOptionalString(d.cta_label),
    ctaUrl: asOptionalString(d.cta_url),
  }
}

export function getMediaLeftTextRightData(
  block: ContentBlock
): MediaLeftTextRightData {
  if (block.block_type !== "media_left_text_right") return {}
  const d = asRecord(block.data)
  return {
    imageUrl: asOptionalString(d.image_url),
    imageSize: asOptionalSize(d.image_size),
    heading: asOptionalString(d.heading),
    content: asOptionalString(d.content),
    ctaLabel: asOptionalString(d.cta_label),
    ctaUrl: asOptionalString(d.cta_url),
  }
}

export function buildContentBlockData(
  blockType: SubBlockType,
  form: {
    title?: string
    heading?: string
    content?: string
    iconUrl?: string
    iconSize?: number
    imageUrl?: string
    imageSize?: number
    ctaLabel?: string
    ctaUrl?: string
  }
): Record<string, unknown> {
  const ctaLabel = form.ctaLabel?.trim()
  const ctaUrl = form.ctaUrl?.trim()
  if (blockType === "heading") {
    return {
      title: form.title?.trim() ?? "",
      ...(ctaLabel ? { cta_label: ctaLabel } : {}),
      ...(ctaUrl ? { cta_url: ctaUrl } : {}),
    }
  }
  if (blockType === "text_block") {
    const heading = form.heading?.trim()
    return {
      ...(heading ? { heading } : {}),
      content: form.content ?? "",
      ...(ctaLabel ? { cta_label: ctaLabel } : {}),
      ...(ctaUrl ? { cta_url: ctaUrl } : {}),
    }
  }

  const heading = form.heading?.trim()
  const content = form.content?.trim()
  const iconUrl = form.iconUrl?.trim()
  const imageUrl = form.imageUrl?.trim()
  const iconSize = form.iconSize && form.iconSize > 0 ? Math.round(form.iconSize) : undefined
  const imageSize =
    form.imageSize && form.imageSize > 0 ? Math.round(form.imageSize) : undefined

  if (blockType === "icon_heading_text") {
    return {
      ...(iconUrl ? { icon_url: iconUrl } : {}),
      ...(iconSize ? { icon_size: iconSize } : {}),
      ...(heading ? { heading } : {}),
      ...(content ? { content } : {}),
      ...(ctaLabel ? { cta_label: ctaLabel } : {}),
      ...(ctaUrl ? { cta_url: ctaUrl } : {}),
    }
  }

  if (blockType === "image_heading_text_centered") {
    return {
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(imageSize ? { image_size: imageSize } : {}),
      ...(heading ? { heading } : {}),
      ...(content ? { content } : {}),
      ...(ctaLabel ? { cta_label: ctaLabel } : {}),
      ...(ctaUrl ? { cta_url: ctaUrl } : {}),
    }
  }

  if (blockType === "heading_text_image_right") {
    return {
      ...(heading ? { heading } : {}),
      ...(content ? { content } : {}),
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(imageSize ? { image_size: imageSize } : {}),
      ...(ctaLabel ? { cta_label: ctaLabel } : {}),
      ...(ctaUrl ? { cta_url: ctaUrl } : {}),
    }
  }

  return {
    ...(imageUrl ? { image_url: imageUrl } : {}),
    ...(imageSize ? { image_size: imageSize } : {}),
    ...(heading ? { heading } : {}),
    ...(content ? { content } : {}),
    ...(ctaLabel ? { cta_label: ctaLabel } : {}),
    ...(ctaUrl ? { cta_url: ctaUrl } : {}),
  }
}

export function validateContentBlockPayload(
  blockType: SubBlockType,
  data: Record<string, unknown>
): string | null {
  // Field content is fully optional — we only validate technical values (e.g. media size).
  if (blockType === "heading" || blockType === "text_block") return null
  const sizeRaw = data.icon_size ?? data.image_size
  if (sizeRaw !== undefined) {
    const n =
      typeof sizeRaw === "number" ? sizeRaw : parseInt(String(sizeRaw), 10)
    if (!Number.isFinite(n) || n <= 0) {
      return "Media size must be a positive number"
    }
  }
  return null
}

export function validateGridPayload(data: Record<string, unknown>): string | null {
  const layout = data.layout
  if (typeof layout !== "string" || !isGridLayoutId(layout)) {
    return "Select a grid layout"
  }
  return null
}
