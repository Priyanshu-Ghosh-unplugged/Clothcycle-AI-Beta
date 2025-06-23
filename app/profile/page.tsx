import { Navbar } from "@/components/navbar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileTabs } from "@/components/profile-tabs"
import { Footer } from "@/components/footer"
import { WalletRequired } from "@/components/wallet-required"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WalletRequired message="Connect your wallet to view your profile and track your impact">
        <main className="container mx-auto px-4 py-8">
          <ProfileHeader />
          <ProfileTabs />
        </main>
      </WalletRequired>
      <Footer />
    </div>
  )
}
