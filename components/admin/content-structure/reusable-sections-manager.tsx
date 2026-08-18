"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  assignSectionToRegion,
  createReusableSection,
  removeSectionFromRegion,
} from "@/lib/actions/admin"
import type { ReusableSection, SiteRegionItem, SiteRegionKey } from "@/lib/types"
import { toast } from "sonner"
import Link from "next/link"

type Props = {
  sections: ReusableSection[]
  afterHeroItems: SiteRegionItem[]
  beforeFooterItems: SiteRegionItem[]
}

export function ReusableSectionsManager({
  sections,
  afterHeroItems,
  beforeFooterItems,
}: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [pending, startTransition] = useTransition()

  const assignedAfterHero = new Set(afterHeroItems.map((x) => x.section_id))
  const assignedBeforeFooter = new Set(beforeFooterItems.map((x) => x.section_id))

  function handleCreate() {
    startTransition(async () => {
      try {
        const fd = new FormData()
        fd.set("name", name)
        fd.set("description", description)
        await createReusableSection(fd)
        setName("")
        setDescription("")
        toast.success("Section created")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not create")
      }
    })
  }

  function toggleSection(
    regionKey: SiteRegionKey,
    sectionId: string,
    nextAssigned: boolean,
    order: number
  ) {
    startTransition(async () => {
      try {
        if (nextAssigned) {
          await assignSectionToRegion(regionKey, sectionId, order)
        } else {
          await removeSectionFromRegion(regionKey, sectionId)
        }
        toast.success("Setting saved")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not save")
      }
    })
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-normal">New reusable section</h2>
        <div className="space-y-2 max-w-xl">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2 max-w-xl">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <Button type="button" onClick={handleCreate} disabled={pending}>
          Create section
        </Button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-normal">Region `after_hero`</h2>
        <p className="text-sm text-muted-foreground">
          Checked sections appear right after the HERO on public pages.
        </p>
        <div className="space-y-2">
          {sections.map((section, index) => {
            const isAssigned = assignedAfterHero.has(section.id)
            return (
              <label
                key={`after-hero-${section.id}`}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">{section.name}</div>
                  {section.description ? (
                    <div className="text-sm text-muted-foreground">
                      {section.description}
                    </div>
                  ) : null}
                  <Link
                    href={`/admin/content/globalne-bloky/${section.id}`}
                    className="text-sm underline underline-offset-4"
                  >
                    Edit section content
                  </Link>
                </div>
                <input
                  type="checkbox"
                  checked={isAssigned}
                  onChange={(e) =>
                    toggleSection("after_hero", section.id, e.target.checked, index)
                  }
                  disabled={pending}
                />
              </label>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-normal">Region `before_footer`</h2>
        <p className="text-sm text-muted-foreground">
          Checked sections appear before the footer on every public page.
        </p>
        <div className="space-y-2">
          {sections.map((section, index) => {
            const isAssigned = assignedBeforeFooter.has(section.id)
            return (
              <label
                key={`before-footer-${section.id}`}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">{section.name}</div>
                  {section.description ? (
                    <div className="text-sm text-muted-foreground">
                      {section.description}
                    </div>
                  ) : null}
                  <Link
                    href={`/admin/content/globalne-bloky/${section.id}`}
                    className="text-sm underline underline-offset-4"
                  >
                    Edit section content
                  </Link>
                </div>
                <input
                  type="checkbox"
                  checked={isAssigned}
                  onChange={(e) =>
                    toggleSection("before_footer", section.id, e.target.checked, index)
                  }
                  disabled={pending}
                />
              </label>
            )
          })}
        </div>
      </section>
    </div>
  )
}
