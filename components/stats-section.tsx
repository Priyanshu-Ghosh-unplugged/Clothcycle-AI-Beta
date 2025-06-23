import { getStats } from "@/lib/stats"

export async function StatsSection() {
  const stats = await getStats()

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">{stats.totalItems.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Items Listed</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-primary mb-2">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-primary mb-2">{stats.itemsSaved.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Items Saved</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-primary mb-2">{stats.co2Saved}kg</div>
            <div className="text-sm text-muted-foreground">CO₂ Saved</div>
          </div>
        </div>
      </div>
    </section>
  )
}
