import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Leaf, Lightbulb, TrendingUp } from "lucide-react"

interface AIInsightsProps {
  insights: {
    clothingType?: string
    condition?: string
    sustainabilityScore?: number
    tags?: string[]
    upcycleIdeas?: string[]
    styleTips?: string[]
    brandAnalysis?: {
      brand?: string
      sustainabilityRating?: string
      fastFashionRisk?: number
    }
  }
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Item Type</h4>
            <Badge variant="outline">{insights.clothingType || "Unknown"}</Badge>
          </div>
          <div>
            <h4 className="font-medium mb-2">Condition</h4>
            <Badge variant="outline">{insights.condition || "Good"}</Badge>
          </div>
        </div>

        {/* Sustainability Score */}
        {insights.sustainabilityScore !== undefined && (
          <div>
            <div className="flex items-center mb-2">
              <Leaf className="h-4 w-4 mr-2 text-green-500" />
              <h4 className="font-medium">Sustainability Score</h4>
            </div>
            <div className="flex items-center space-x-3">
              <Progress value={insights.sustainabilityScore} className="flex-1" />
              <span className="font-medium">{insights.sustainabilityScore}/100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {insights.sustainabilityScore >= 80
                ? "Excellent choice for sustainable fashion!"
                : insights.sustainabilityScore >= 60
                  ? "Good sustainable option"
                  : "Consider the environmental impact"}
            </p>
          </div>
        )}

        {/* Brand Analysis */}
        {insights.brandAnalysis && (
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              <h4 className="font-medium">Brand Analysis</h4>
            </div>
            <div className="space-y-2">
              {insights.brandAnalysis.brand && (
                <p>
                  <strong>Brand:</strong> {insights.brandAnalysis.brand}
                </p>
              )}
              {insights.brandAnalysis.sustainabilityRating && (
                <p>
                  <strong>Sustainability Rating:</strong> {insights.brandAnalysis.sustainabilityRating}
                </p>
              )}
              {insights.brandAnalysis.fastFashionRisk !== undefined && (
                <div>
                  <p className="mb-1">
                    <strong>Fast Fashion Risk:</strong>
                  </p>
                  <Progress value={insights.brandAnalysis.fastFashionRisk} className="h-2" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcycle Ideas */}
        {insights.upcycleIdeas && insights.upcycleIdeas.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
              <h4 className="font-medium">Upcycle Ideas</h4>
            </div>
            <ul className="space-y-1">
              {insights.upcycleIdeas.map((idea, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {idea}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Style Tips */}
        {insights.styleTips && insights.styleTips.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Style Tips</h4>
            <ul className="space-y-1">
              {insights.styleTips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
