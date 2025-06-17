import { Suspense } from "react"
import { MarketplaceContent } from "./marketplace-content"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function MarketplaceLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-square" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground mt-2">Discover pre-loved fashion and sustainable style</p>
      </div>

      <Suspense fallback={<MarketplaceLoading />}>
        <MarketplaceContent />
      </Suspense>
    </div>
  )
}
