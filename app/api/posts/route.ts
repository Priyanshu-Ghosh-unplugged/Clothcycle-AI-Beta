import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const donations = searchParams.get("donations")
  const sales = searchParams.get("sales")

  const supabase = createServerClient()

  let query = supabase
    .from("posts")
    .select(`
      *,
      owner:users(id, name, email, image)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  if (donations === "true") {
    query = query.eq("is_donation", true)
  } else if (sales === "true") {
    query = query.eq("is_donation", false)
  }

  const { data: posts, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, imageUrl, price, isDonation, category, size, brand, condition, eco_score, ai_tags } =
      body

    const supabase = createServerClient()

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title,
        description,
        image_url: imageUrl,
        owner_id: session.user.id,
        price: isDonation ? 0 : price,
        is_donation: isDonation,
        category,
        size,
        brand,
        condition,
        eco_score: eco_score || 50,
        ai_tags: ai_tags || [],
        status: "available",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
