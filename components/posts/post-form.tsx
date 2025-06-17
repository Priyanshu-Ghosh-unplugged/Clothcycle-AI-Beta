"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, Sparkles } from "lucide-react"
import { analyzeGarment, type GarmentAnalysis } from "@/lib/ai"

interface PostFormProps {
  initialData?: any
  isEditing?: boolean
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<GarmentAnalysis | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    isDonation: initialData?.is_donation || false,
    category: initialData?.category || "",
    size: initialData?.size || "",
    brand: initialData?.brand || "",
    condition: initialData?.condition || "",
    imageUrl: initialData?.image_url || "",
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAnalyzing(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target?.result as string
        setFormData((prev) => ({ ...prev, imageUrl: base64 }))

        // Analyze with AI
        const analysis = await analyzeGarment(base64, formData.description)
        setAiAnalysis(analysis)

        // Auto-fill form with AI suggestions
        setFormData((prev) => ({
          ...prev,
          category: analysis.category,
          brand: analysis.brand || prev.brand,
          condition: analysis.condition,
        }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Image upload error:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)

    try {
      const endpoint = isEditing ? `/api/posts/${initialData.id}` : "/api/posts"
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eco_score: aiAnalysis?.ecoScore || 50,
          ai_tags: aiAnalysis?.tags || [],
        }),
      })

      if (response.ok) {
        const post = await response.json()
        router.push(`/posts/${post.id}`)
      }
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Item" : "Add New Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Item Photo</Label>
            <div className="mt-2">
              {formData.imageUrl ? (
                <div className="relative">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="mt-4">
                    <Label htmlFor="image" className="cursor-pointer">
                      <span className="text-sm font-medium">Upload a photo</span>
                      <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </Label>
                  </div>
                  {analyzing && (
                    <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      AI analyzing your item...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Eco Score: {aiAnalysis.ecoScore}/100</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${aiAnalysis.ecoScore}%` }} />
                  </div>
                </div>

                {aiAnalysis.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Suggested Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiAnalysis.stylingTips.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Styling Tips:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {aiAnalysis.stylingTips.slice(0, 3).map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Vintage Denim Jacket"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Jacket, Dress, Shoes"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the item, its condition, and any special features..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData((prev) => ({ ...prev, size: e.target.value }))}
                placeholder="e.g., M, L, 32"
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Nike, Zara"
              />
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData((prev) => ({ ...prev, condition: e.target.value }))}
                placeholder="e.g., Excellent, Good"
              />
            </div>
          </div>

          {/* Donation Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="donation"
              checked={formData.isDonation}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDonation: checked }))}
            />
            <Label htmlFor="donation">Donate this item for free (recipient pays delivery only)</Label>
          </div>

          {/* Price */}
          {!formData.isDonation && (
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEditing ? "Update Item" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
