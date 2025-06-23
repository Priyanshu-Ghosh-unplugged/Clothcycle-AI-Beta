export interface Stats {
  totalItems: number
  totalUsers: number
  itemsSaved: number
  co2Saved: number
}

export async function getStats(): Promise<Stats> {
  // In production, this would query Supabase for real stats
  // For now, return mock data
  return {
    totalItems: 1247,
    totalUsers: 892,
    itemsSaved: 634,
    co2Saved: 2840,
  }
}
