"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, ShoppingCart, Edit, Trash2, User, Calendar, Tag, Ruler, Award, Sparkles, Loader2 } from "lucide-react"
import type { Post } from "@/lib/supabase"

interface PostDetailProps {
  post: Post & {
    owner: {
      id: string
      name?: string
      email: string
      image?: string
    }
  }
}

export function PostDetail({ post }: PostDetailProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiTips, setAiTips] = useState<string[]>([])
  const [showAiTips, setShowAiTips] = useState(false)

  const isOwner = session?.user?.id === post.owner_id
  const canInteract = session && !isOwner

  const handleTransaction = async (type: "donation" | "purchase") => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          type,
        }),
      })

      if (response.ok) {
        const transaction = await response.json()
        router.push(`/transactions/${transaction.id}`)
      }
    } catch (error) {
      console.error("Transaction error:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadAiTips = async () => {
    if (aiTips.length > 0) {
      setShowAiTips(!showAiTips)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/ai/styling-tips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: post.category,
          description: post.description,
          tags: post.ai_tags,
        }),
      })

      const data = await response.json()
      setAiTips(data.tips || [])
      setShowAiTips(true)
    } catch (error) {
      console.error("AI tips error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={post.image_url || "/placeholder.svg?height=600&width=600"}
              alt={post.title}
              fill
              className="object-cover"
            />
            {post.is_donation && (
              <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">Free Item</Badge>
            )}
            {post.eco_score > 70 && (
              <Badge className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600">
                <Award className="h-3 w-3 mr-1" />
                Eco-Friendly
              </Badge>
            )}
          </div>

          {/* AI Styling Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                AI Styling Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={loadAiTips} disabled={loading} className="w-full">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {showAiTips ? "Hide" : "Get"} Styling Tips
              </Button>

              {showAiTips && aiTips.length > 0 && (
                <div className="mt-4 space-y-2">
                  {aiTips.map((tip, index) => (
                    <div key={index} className="text-sm p-3 bg-muted rounded-lg">
                      {tip}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center justify-between">
              {post.is_donation ? (
                <span className="text-2xl font-bold text-green-600">Free</span>
              ) : (
                <span className="text-2xl font-bold">${post.price}</span>
              )}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.owner.image || ""} />
                  <AvatarFallback>{post.owner.name?.charAt(0) || post.owner.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.owner.name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">Item owner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {post.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {post.category && (
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Category:</span> {post.category}
                    </span>
                  </div>
                )}

                {post.size && (
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Size:</span> {post.size}
                    </span>
                  </div>
                )}

                {post.brand && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Brand:</span> {post.brand}
                    </span>
                  </div>
                )}

                {post.condition && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Condition:</span> {post.condition}
                    </span>
                  </div>
                )}
              </div>

              {/* Eco Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sustainability Score</span>
                  <span className="text-sm font-bold">{post.eco_score}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${post.eco_score}%` }}
                  />
                </div>
              </div>

              {/* AI Tags */}
              {post.ai_tags && post.ai_tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">AI-Generated Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {post.ai_tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isOwner ? (
              <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/posts/${post.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Item
                  </Link>
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </Button>
              </div>
            ) : canInteract ? (
              <div className="space-y-3">
                {post.is_donation ? (
                  <Button onClick={() => handleTransaction("donation")} disabled={loading} className="w-full" size="lg">
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <Heart className="h-4 w-4 mr-2" />
                    Claim This Item (Free + Delivery)
                  </Button>
                ) : (
                  <Button onClick={() => handleTransaction("purchase")} disabled={loading} className="w-full" size="lg">
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now - ${post.price}
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  {post.is_donation
                    ? "You'll only pay for delivery (typically $5.99)"
                    : "Price includes platform fee and delivery"}
                </p>
              </div>
            ) : (
              <Button asChild className="w-full" size="lg">
                <Link href="/auth/signin">Sign In to {post.is_donation ? "Claim" : "Purchase"}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
