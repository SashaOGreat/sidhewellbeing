import { createClient } from "@/lib/supabase/server"
import { buildPriceListSections } from "@/lib/price-list"
import {
  PriceListContent,
  PriceListWithContactGrid,
} from "@/components/public/price-list-section"
import type { Category, PriceListItem, Subcategory } from "@/lib/types"
import type { Metadata } from "next"
import { getCompanyPublicInfoCached } from "@/lib/get-company-settings-cached"
import { buildMetaTitle } from "@/lib/site-config"

export const metadata: Metadata = {
  title: buildMetaTitle("Price list"),
  description: "Overview of services and prices by category and subcategory.",
}

export default async function PriceListPage() {
  const supabase = await createClient()

  const [categoriesRes, subcategoriesRes, itemsRes, company] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("subcategories").select("*").order("display_order"),
    supabase.from("price_list_items").select("*").order("display_order"),
    getCompanyPublicInfoCached(),
  ])

  const sections = buildPriceListSections(
    (categoriesRes.data as Category[]) ?? [],
    (subcategoriesRes.data as Subcategory[]) ?? [],
    (itemsRes.data as PriceListItem[]) ?? []
  )

  return (
    <div className="pb-16 pt-24 sm:pt-28 lg:pt-32">
      {sections.length === 0 ? (
        <PriceListWithContactGrid company={company}>
          <div className="rounded-2xl border bg-card px-6 py-10 text-sm text-muted-foreground shadow-sm">
            The price list is not filled in yet.
          </div>
        </PriceListWithContactGrid>
      ) : (
        <PriceListWithContactGrid company={company}>
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-normal tracking-tight">Price list</h1>
              <p className="mt-2 text-muted-foreground">
                Overview of services and prices by category and subcategory.
              </p>
            </div>
            <div className="space-y-12">
              {sections.map((section) => (
                <PriceListContent
                  key={section.category.id}
                  title={section.category.name}
                  items={section.items}
                  subcategories={section.subcategories.map(
                    ({ subcategory, items }) => ({
                      title: subcategory.name,
                      items,
                    })
                  )}
                />
              ))}
            </div>
          </div>
        </PriceListWithContactGrid>
      )}
    </div>
  )
}
