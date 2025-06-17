import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export interface GarmentAnalysis {
  category: string
  brand?: string
  condition: string
  ecoScore: number
  tags: string[]
  stylingTips: string[]
  upcycleIdeas: string[]
}

export async function analyzeGarment(imageUrl: string, description?: string): Promise<GarmentAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
    Analyze this clothing item image and provide a detailed assessment for a sustainable fashion app called ClothCycle AI.
    
    ${description ? `Additional context: ${description}` : ""}
    
    Please provide a JSON response with the following structure:
    {
      "category": "type of clothing (e.g., shirt, pants, dress, jacket)",
      "brand": "brand name if visible or recognizable (or null)",
      "condition": "excellent, good, fair, or poor",
      "ecoScore": "sustainability score from 1-100 based on material, brand ethics, longevity",
      "tags": ["array", "of", "relevant", "tags", "like", "cotton", "vintage", "formal"],
      "stylingTips": ["array of 3-5 styling suggestions"],
      "upcycleIdeas": ["array of 2-3 creative upcycling ideas if condition is fair/poor"]
    }
    
    Focus on sustainability, versatility, and helping users make the most of their wardrobe.
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageUrl.split(",")[1], // Remove data:image/jpeg;base64, prefix
          mimeType: "image/jpeg",
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    // Parse JSON response
    const analysis = JSON.parse(text.replace(/```json\n?|\n?```/g, ""))

    return analysis
  } catch (error) {
    console.error("AI analysis error:", error)

    // Fallback response
    return {
      category: "clothing",
      condition: "good",
      ecoScore: 50,
      tags: ["sustainable", "preloved"],
      stylingTips: ["Mix with neutral colors", "Layer for versatility"],
      upcycleIdeas: ["Add patches for personalization", "Alter fit for modern look"],
    }
  }
}

export async function generateOutfitIdeas(userPosts: any[]): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const itemsList = userPosts
      .map((post) => `${post.category || "item"}: ${post.title} (${post.condition || "good"} condition)`)
      .join("\n")

    const prompt = `
    Based on these clothing items from a user's sustainable wardrobe, suggest 5 creative outfit combinations:
    
    ${itemsList}
    
    Provide practical, stylish outfit ideas that maximize the use of existing pieces. Focus on:
    - Versatility and mix-and-match potential
    - Seasonal appropriateness
    - Different occasions (casual, work, evening)
    - Sustainable fashion principles
    
    Return as a simple array of strings, each describing one complete outfit.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the response and extract outfit ideas
    const outfits = text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 5)

    return outfits
  } catch (error) {
    console.error("Outfit generation error:", error)
    return [
      "Mix your favorite top with dark jeans for a classic look",
      "Layer pieces for a sophisticated ensemble",
      "Create contrast with light and dark pieces",
      "Add accessories to transform basic outfits",
      "Experiment with different textures and patterns",
    ]
  }
}
