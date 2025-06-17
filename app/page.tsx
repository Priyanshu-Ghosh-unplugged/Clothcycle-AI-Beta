import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, TrendingUp, Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Sustainable Fashion
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Make Your Wardrobe
            <span className="block text-primary">Sustainable & Smart</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Digitize your closet, get AI-powered styling tips, and join a community that's making fashion more
            sustainable—one garment at a time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link href="/donate">Donate Items</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <Sparkles className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get personalized styling tips, outfit suggestions, and sustainability scores for every item in your
              wardrobe.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Heart className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Donate & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Give your unused items a second life by donating them to community members who will love them.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <TrendingUp className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Sustainable Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Buy and sell pre-loved fashion with transparent fees and eco-friendly shipping options.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 rounded-2xl p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Making Fashion Sustainable</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Items Donated</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">5K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50%</div>
              <div className="text-muted-foreground">Waste Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">How ClothCycle AI Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your relationship with fashion in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold">Upload & Analyze</h3>
            <p className="text-muted-foreground">
              Take photos of your clothes and let our AI analyze their sustainability, condition, and styling potential.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold">Get Smart Suggestions</h3>
            <p className="text-muted-foreground">
              Receive personalized outfit ideas, styling tips, and recommendations for items to donate or sell.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold">Share & Earn</h3>
            <p className="text-muted-foreground">
              Donate items for free or sell them in our marketplace. Earn rewards for sustainable fashion choices.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground rounded-2xl p-8 text-center space-y-6">
        <div className="space-y-4">
          <Leaf className="h-16 w-16 mx-auto" />
          <h2 className="text-3xl font-bold">Ready to Transform Your Wardrobe?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of fashion-conscious individuals who are making their wardrobes more sustainable with
            ClothCycle AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/auth/signup">Get Started Free</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <Link href="/marketplace">Browse Items</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
