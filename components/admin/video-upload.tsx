"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadVideo } from "@/lib/actions/admin"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function VideoUpload({
  value,
  onChange,
  label = "Background video",
}: Props) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const url = await uploadVideo(formData)
      onChange(url)
      toast.success("Video uploaded")
    } catch (err) {
      console.error("Video upload failed:", err)
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {value ? (
        <div className="relative w-full overflow-hidden rounded-lg border bg-muted aspect-video">
          <video
            src={value}
            className="h-full w-full object-cover"
            muted
            playsInline
            controls
            preload="metadata"
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
                Upload an MP4 or WebM video for the homepage background.
              </p>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload video
          </Button>
        </div>
      )}

      <Input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste a direct video URL (.mp4 / .webm)"
        className="text-xs"
      />
    </div>
  )
}
