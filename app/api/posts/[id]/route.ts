import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const supabase = createServerClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      owner:users(id, name, email, image)
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = createServerClient()

    // Verify ownership
    const { data: existingPost } = await supabase.from("posts").select("owner_id").eq("id", params.id).single()

    if (!existingPost || existingPost.owner_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, description, imageUrl, price, isDonation, category, size, brand, condition, eco_score, ai_tags } =
      body

    const { data: post, error } = await supabase
      .from("posts")
      .update({
        title,
        description,
        image_url: imageUrl,
        price: isDonation ? 0 : price,
        is_donation: isDonation,
        category,
        size,
        brand,
        condition,
        eco_score,
        ai_tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServerClient()

  // Verify ownership
  const { data: existingPost } = await supabase.from("posts").select("owner_id").eq("id", params.id).single()

  if (!existingPost || existingPost.owner_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabase.from("posts").update({ status: "removed" }).eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
