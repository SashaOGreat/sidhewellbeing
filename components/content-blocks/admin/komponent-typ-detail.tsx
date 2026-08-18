import { ContentBlockBody } from "@/components/content-blocks/content-block-body"
import {
  CONTENT_BLOCK_DATA_FIELDS,
  CONTENT_BLOCK_LABELS,
  sampleContentBlock,
} from "@/lib/content-blocks"
import type { SubBlockType } from "@/lib/types"

type Props = {
  blockType: SubBlockType
}

/**
 * Shared template for Components → type detail (`data` fields + preview).
 * New type: add `typ/<slug>/page.tsx` that only wraps this component with a `blockType` constant.
 */
export function KomponentTypDetail({ blockType }: Props) {
  const sample = sampleContentBlock(blockType)
  const fields = CONTENT_BLOCK_DATA_FIELDS[blockType]

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-normal">{CONTENT_BLOCK_LABELS[blockType]}</h1>
      </div>

      <div>
        <ul className="text-sm space-y-1.5 border rounded-lg p-4 bg-card">
          {fields.map((f) => (
            <li key={f.key} className="flex flex-wrap gap-x-2">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{f.key}</code>
              <span>{f.label}</span>
              {f.required ? (
                <span className="text-xs text-destructive flex items-center">
                  required
                </span>
              ) : (
                <span className="text-xs text-muted-foreground flex items-center">
                  optional
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-normal mb-2">Preview as on the site</h2>
        <p className="text-xs text-muted-foreground mb-3">
          In a grid cell — the sub-block always spans the full cell width.
        </p>
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted overflow-hidden">
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto rounded-lg border bg-card p-6 lg:p-8 shadow-sm">
              <ContentBlockBody block={sample} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
