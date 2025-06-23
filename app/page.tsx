import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { FeaturedItems } from "@/components/featured-items"
import { StatsSection } from "@/components/stats-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted" />}>
          <FeaturedItems />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
