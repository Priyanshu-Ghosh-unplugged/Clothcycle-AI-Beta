import { Loader2, Recycle } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Recycle className="h-8 w-8 animate-spin" />
          <span className="text-2xl font-bold">ClothCycle AI</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg text-muted-foreground">Initializing...</span>
        </div>
      </div>
    </div>
  )
}
