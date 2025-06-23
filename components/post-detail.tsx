"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AIInsights } from "@/components/ai-insights"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Heart, Share2, MessageCircle, ShoppingBag, Gift } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleTransaction = async (type: "buy" | "claim") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          type,
          amount: post.isDonation ? 0 : post.price,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: post.isDonation ? "Item claimed successfully!" : "Purchase completed!",
        })
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Section */}
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={post.imageUrl || "/placeholder.svg?height=600&width=600"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? "text-red-500" : ""}
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {post.isDonation ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-lg px-3 py-1">Free</Badge>
            ) : (
              <div className="text-3xl font-bold text-primary">${post.price}</div>
            )}
          </div>

          <p className="text-muted-foreground text-lg mb-4">{post.description}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Owner Info */}
          <Card className="mb-6">
            <CardContent className="flex items-center space-x-4 p-4">
              <Avatar>
                <AvatarImage src={post.owner?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.owner?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.owner?.name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(post.owner?.createdAt || post.createdAt).getFullYear()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            className="w-full text-lg py-6"
            onClick={() => handleTransaction(post.isDonation ? "claim" : "buy")}
            disabled={isProcessing}
          >
            {post.isDonation ? (
              <>
                <Gift className="h-5 w-5 mr-2" />
                Claim Item
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Buy Now
              </>
            )}
          </Button>

          {!post.isDonation && (
            <p className="text-sm text-muted-foreground mt-2 text-center">Includes 5% platform fee + delivery costs</p>
          )}
        </div>

        {/* AI Insights */}
        {post.aiInsights && <AIInsights insights={post.aiInsights} />}
      </div>
    </div>
  )
}
