"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadToCloudinary } from "@/lib/cloudinary"

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const imageUrl = await uploadToCloudinary(file)
      setImageUrl(imageUrl)
      onUpload(imageUrl)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  if (imageUrl) {
    return (
      <Card className="relative">
        <div className="relative aspect-square">
          <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded item" fill className="object-cover rounded-lg" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-dashed p-8 text-center cursor-pointer transition-colors border-muted-foreground/25 hover:border-primary hover:bg-primary/5">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {uploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center" onClick={triggerFileSelect}>
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Upload item photo</p>
          <p className="text-sm text-muted-foreground mb-4">Click to select an image</p>
          <Button type="button" variant="outline">
            Choose File
          </Button>
        </div>
      )}
    </Card>
  )
}
