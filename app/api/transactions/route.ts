import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { postId, type } = body

    const supabase = createServerClient()

    // Get post details
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .eq("status", "available")
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Prevent self-transactions
    if (post.owner_id === session.user.id) {
      return NextResponse.json({ error: "Cannot transact with your own item" }, { status: 400 })
    }

    // Get fee structure
    const { data: fees } = await supabase.from("fees").select("*").single()

    const platformFeePercentage = fees?.platform_fee_percentage || 5
    const deliveryFee = fees?.default_delivery_fee || 5.99

    let amount = 0
    let platformFee = 0
    let totalAmount = deliveryFee

    if (type === "purchase" && !post.is_donation) {
      amount = post.price
      platformFee = (amount * platformFeePercentage) / 100
      totalAmount = amount + platformFee + deliveryFee
    }

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        post_id: postId,
        buyer_id: session.user.id,
        seller_id: post.owner_id,
        amount,
        platform_fee: platformFee,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        transaction_type: post.is_donation ? "donation" : "sale",
        status: "pending",
      })
      .select()
      .single()

    if (transactionError) {
      return NextResponse.json({ error: transactionError.message }, { status: 500 })
    }

    // Update post status
    await supabase
      .from("posts")
      .update({ status: post.is_donation ? "donated" : "sold" })
      .eq("id", postId)

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
