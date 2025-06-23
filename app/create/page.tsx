import { Navbar } from "@/components/navbar"
import { CreatePostForm } from "@/components/create-post-form"
import { Footer } from "@/components/footer"
import { WalletRequired } from "@/components/wallet-required"

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WalletRequired message="Connect your wallet to list items and earn rewards">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">List Your Item</h1>
              <p className="text-muted-foreground text-lg">
                Upload your clothing item and let our AI help you create the perfect listing
              </p>
            </div>

            <CreatePostForm />
          </div>
        </main>
      </WalletRequired>
      <Footer />
    </div>
  )
}
