"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import type { ManagedImage } from "@/lib/types"
import { uploadCategoryCoverImage, uploadImage } from "@/lib/actions/admin"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { FolderOpen, Loader2, Upload, X } from "lucide-react"

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
  removeBackground?: boolean
  allowRemoveBackgroundToggle?: boolean
}

function isSvgFile(file: File): boolean {
  if (file.name.toLowerCase().endsWith(".svg")) return true
  const type = file.type.toLowerCase()
  return type === "image/svg+xml" || type === "image/svg"
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  removeBackground = false,
  allowRemoveBackgroundToggle = false,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [useRemoveBackground, setUseRemoveBackground] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryQuery, setGalleryQuery] = useState("")
  const [galleryItems, setGalleryItems] = useState<ManagedImage[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const effectiveRemoveBackground = removeBackground || useRemoveBackground

  async function openGallery() {
    setGalleryOpen(true)
    if (galleryItems.length > 0) return

    setGalleryLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("managed_images")
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) throw error

      const uniqueByUrl = new Map<string, ManagedImage>()
      for (const row of ((data ?? []) as ManagedImage[])) {
        const imageUrl = row.image_url?.trim()
        if (!imageUrl || uniqueByUrl.has(imageUrl)) continue
        uniqueByUrl.set(imageUrl, row)
      }

      setGalleryItems([...uniqueByUrl.values()])
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not load gallery"
      )
    } finally {
      setGalleryLoading(false)
    }
  }

  function galleryLabel(item: ManagedImage) {
    if (item.scope_type === "category") return "Category"
    if (item.scope_type === "subcategory") return "Subcategory"
    if (item.scope_type === "content_block") return item.block_type ?? "Sub-block"
    if (item.scope_type === "reusable_section_node") {
      return item.block_type ? `Section · ${item.block_type}` : "Reusable section"
    }
    if (item.scope_type === "price_list_item") return "Price list"
    if (item.scope_type === "blog_post") return "Blog cover"
    if (item.scope_type === "blog_image") return "Blog gallery"
    if (item.scope_id === "homepage_cover_image") return "Homepage cover"
    return "Site setting"
  }

  const filteredGalleryItems = galleryItems.filter((item) => {
    const q = galleryQuery.trim().toLowerCase()
    if (!q) return true
    return (
      item.image_url.toLowerCase().includes(q) ||
      item.scope_type.toLowerCase().includes(q) ||
      (item.block_type ?? "").toLowerCase().includes(q) ||
      galleryLabel(item).toLowerCase().includes(q)
    )
  })

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (effectiveRemoveBackground && isSvgFile(file)) {
      toast.error("Background removal is not available for SVG. Turn the toggle off.")
      if (fileRef.current) fileRef.current.value = ""
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const url = effectiveRemoveBackground
        ? await uploadCategoryCoverImage(formData)
        : await uploadImage(formData)
      onChange(url)
    } catch (err) {
      console.error("Upload failed:", err)
      toast.error(
        err instanceof Error ? err.message : "Upload failed"
      )
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium">{label}</label>
        {allowRemoveBackgroundToggle ? (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Remove background</span>
            <Switch
              checked={useRemoveBackground}
              onCheckedChange={setUseRemoveBackground}
              disabled={uploading}
              size="sm"
            />
          </label>
        ) : null}
      </div>

      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)_50%_/_20px_20px] dark:bg-[repeating-conic-gradient(#262626_0%_25%,#171717_0%_50%)_50%_/_20px_20px]">
          <Image
            src={value}
            alt=""
            fill
            className={effectiveRemoveBackground ? "object-contain" : "object-cover"}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border-2 border-dashed p-6 text-center">
          {uploading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload a new image or pick from the gallery.
              </p>
            </>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void openGallery()}
              disabled={uploading}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Choose from gallery
            </Button>
          </div>
        </div>
      )}

      <Input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL"
        className="text-xs"
      />

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Gallery of used images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={galleryQuery}
              onChange={(e) => setGalleryQuery(e.target.value)}
              placeholder="Search by type, block, or URL"
            />

            {galleryLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredGalleryItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No images in the gallery yet.
              </p>
            ) : (
              <ScrollArea className="h-[65vh] pr-3">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGalleryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="overflow-hidden rounded-lg border text-left transition hover:border-primary/50 hover:bg-muted/40"
                      onClick={() => {
                        onChange(item.image_url)
                        setGalleryOpen(false)
                      }}
                    >
                      <div className="relative aspect-video bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)_50%_/_20px_20px] dark:bg-[repeating-conic-gradient(#262626_0%_25%,#171717_0%_50%)_50%_/_20px_20px]">
                        <Image
                          src={item.image_url}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-sm font-medium">{galleryLabel(item)}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground break-all">
                          {item.image_url}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
