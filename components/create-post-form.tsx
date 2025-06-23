"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { AIInsights } from "@/components/ai-insights"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles } from "lucide-react"

export function CreatePostForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    isDonation: false,
    imageUrl: "",
    tags: [] as string[],
  })
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleImageUpload = async (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }))

    // Trigger AI analysis
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })

      if (response.ok) {
        const insights = await response.json()
        setAiInsights(insights)

        // Auto-fill form with AI suggestions
        setFormData((prev) => ({
          ...prev,
          title: insights.suggestedTitle || prev.title,
          description: insights.description || prev.description,
          tags: insights.tags || prev.tags,
        }))
      }
    } catch (error) {
      console.error("AI analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          aiInsights,
          price: formData.isDonation ? 0 : Number.parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        const post = await response.json()
        toast({
          title: "Success!",
          description: "Your item has been listed successfully.",
        })
        router.push(`/posts/${post.id}`)
      } else {
        throw new Error("Failed to create post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload onUpload={handleImageUpload} />
          {isAnalyzing && (
            <div className="flex items-center justify-center mt-4 p-4 bg-muted rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>AI is analyzing your image...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {aiInsights && <AIInsights insights={aiInsights} />}

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter item title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your item..."
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="donation"
              checked={formData.isDonation}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDonation: checked }))}
            />
            <Label htmlFor="donation">List as donation (free)</Label>
          </div>

          {!formData.isDonation && (
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
          )}

          {formData.tags.length > 0 && (
            <div>
              <Label>AI-Generated Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting || !formData.imageUrl}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Creating Post...
          </>
        ) : (
          "Create Post"
        )}
      </Button>
    </form>
  )
}
