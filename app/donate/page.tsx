import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DonateContent } from "./donate-content"

export default async function DonatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/donate")
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Donate Items</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Give your pre-loved fashion a second life by donating to community members. Recipients only pay for delivery,
          making sustainable fashion accessible to everyone.
        </p>
      </div>

      <DonateContent />
    </div>
  )
}
