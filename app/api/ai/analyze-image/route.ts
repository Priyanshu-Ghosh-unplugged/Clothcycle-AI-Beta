import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Dummy AI analysis response
  return NextResponse.json({
    suggestedTitle: "AI Suggested Title",
    description: "AI generated description.",
    tags: ["ai", "suggested", "tag"],
  });
} 