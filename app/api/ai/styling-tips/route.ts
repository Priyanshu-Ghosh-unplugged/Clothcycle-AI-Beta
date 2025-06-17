import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, description, tags } = body

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
    As a sustainable fashion stylist, provide 5 practical styling tips for this clothing item:
    
    Category: ${category || "clothing item"}
    Description: ${description || "No description provided"}
    Tags: ${tags?.join(", ") || "No tags"}
    
    Focus on:
    - Versatile styling options
    - Sustainable fashion principles
    - Mix-and-match possibilities
    - Seasonal adaptability
    - Occasion-appropriate styling
    
    Provide concise, actionable tips that help the user maximize the item's potential in their wardrobe.
    Return as a simple list of tips, one per line.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the response into individual tips
    const tips = text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter((tip) => tip.length > 0)
      .slice(0, 5)

    return NextResponse.json({ tips })
  } catch (error) {
    console.error("AI styling tips error:", error)

    // Fallback tips
    const fallbackTips = [
      "Layer this piece with neutral basics for a versatile look",
      "Mix textures and patterns to create visual interest",
      "Accessorize thoughtfully to transform the outfit for different occasions",
      "Consider the color palette when pairing with other items",
      "Experiment with different silhouettes to find your best fit",
    ]

    return NextResponse.json({ tips: fallbackTips })
  }
}
