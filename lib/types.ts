export interface User {
  id: string
  name?: string
  email?: string
  avatar_url?: string
  wallet_address?: string
  bio?: string
  location?: string
  website?: string
  instagram_handle?: string
  green_tokens: number
  sustainability_score: number
  total_items_listed: number
  total_items_sold: number
  total_items_donated: number
  total_co2_saved: number
  is_verified: boolean
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  description: string
  imageUrl?: string
  price: number
  isDonation: boolean
  tags?: string[]
  ownerId: string
  owner?: User
  aiInsights?: AIInsights
  createdAt: string
  updatedAt: string
}

export interface AIInsights {
  clothingType?: string
  condition?: string
  sustainabilityScore?: number
  tags?: string[]
  upcycleIdeas?: string[]
  styleTips?: string[]
  suggestedTitle?: string
  description?: string
  brandAnalysis?: {
    brand?: string
    sustainabilityRating?: string
    fastFashionRisk?: number
  }
}

export interface Transaction {
  id: string
  postId: string
  buyerId: string
  sellerId: string
  amount: number
  platformFee: number
  deliveryFee: number
  type: "buy" | "claim" | "nft_mint"
  status: "pending" | "completed" | "cancelled"
  blockchain_tx_hash?: string
  green_tokens_earned: number
  co2_saved: number
  createdAt: string
}

export interface EcoBadge {
  id: string
  userId: string
  type: "eco_warrior" | "upcycle_master" | "donation_hero" | "sustainable_shopper" | "green_influencer"
  title: string
  description?: string
  points_awarded: number
  earnedAt: string
}

export interface WalletUser extends User {
  wallet_address: string // Make wallet required
}
