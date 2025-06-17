import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Types for our database
export interface User {
  id: string
  name?: string
  email: string
  email_verified?: string
  image?: string
  wallet_address?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  description?: string
  image_url?: string
  owner_id: string
  price: number
  is_donation: boolean
  category?: string
  size?: string
  brand?: string
  condition?: string
  eco_score: number
  ai_tags?: string[]
  status: "available" | "sold" | "donated" | "removed"
  created_at: string
  updated_at: string
  owner?: User
}

export interface Transaction {
  id: string
  post_id: string
  buyer_id?: string
  seller_id?: string
  amount: number
  platform_fee: number
  delivery_fee: number
  total_amount: number
  status: "pending" | "completed" | "cancelled" | "refunded"
  transaction_type: "donation" | "sale"
  created_at: string
  updated_at: string
  post?: Post
  buyer?: User
  seller?: User
}

export interface Fees {
  id: string
  platform_fee_percentage: number
  default_delivery_fee: number
  created_at: string
  updated_at: string
}
