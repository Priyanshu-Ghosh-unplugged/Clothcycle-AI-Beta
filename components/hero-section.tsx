import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Recycle, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-bg">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Sustainable Fashion</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ClothCycle AI
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your wardrobe into a sustainable, smart ecosystem. Get AI-powered styling tips, earn eco-rewards,
            and join the circular fashion revolution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/marketplace">
              <Button size="lg" className="text-lg px-8">
                Explore Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline" className="text-lg px-8">
                List Your Items
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get smart styling tips and sustainability scores for every item
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Circular Economy</h3>
              <p className="text-sm text-muted-foreground">Donate, sell, or upcycle items to reduce fashion waste</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Get GreenTokens and eco-NFTs for sustainable actions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
