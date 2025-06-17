import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import type { Post } from "@/lib/supabase"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={post.image_url || "/placeholder.svg?height=300&width=300"}
            alt={post.title}
            fill
            className="object-cover"
          />
          {post.is_donation && <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Free</Badge>}
          {post.eco_score > 70 && (
            <Badge className="absolute top-2 right-2 bg-emerald-500 hover:bg-emerald-600">Eco-Friendly</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {post.category && (
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            )}
            {post.size && (
              <Badge variant="outline" className="text-xs">
                Size {post.size}
              </Badge>
            )}
          </div>
          {!post.is_donation && <span className="font-bold text-lg">${post.price}</span>}
        </div>

        {post.ai_tags && post.ai_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.ai_tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/posts/${post.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>

        {post.is_donation ? (
          <Button size="sm" className="flex-1">
            <Heart className="h-4 w-4 mr-2" />
            Claim Free
          </Button>
        ) : (
          <Button size="sm" className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
