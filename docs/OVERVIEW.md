## ClothCycle AI

**Smart Wardrobe & Fashion Sustainability Buddy**

### Problem

Fast fashion leads to overflowing closets and textile waste—most clothes go unworn and end up in landfills.

---

### AI Core Features

1. **Wardrobe Digitization**

   * Scan garments via photos or upload purchase receipts.
2. **Usage Analytics & Styling Suggestions**

   * Track how often you wear each item.
   * Recommend mix‑and‑match outfits to refresh your look without new purchases.
3. **Trend & Eco‑Score Alerts**

   * Flag pieces tied to unsustainable brands or fleeting trends.
4. **Lifecycle Guidance**

   * When items sit unworn, AI suggests donating, reselling, or upcycling projects with step‑by‑step guides.

---

### Web3 Incentives

* **GreenTokens**: Earn for donating, reselling, or completing upcycle challenges.
* **Eco‑Style NFTs**: Mint badges for reaching style milestones (e.g., “30 wears without buying new”).
* **Decentralized Closet Ledger**: Immutable on‑chain record of your wardrobe’s lifecycle, boosting resale trust.

---

### User Flow

1. **Onboard**: Snap 10–20 items; AI tags color, brand, and fabric.
2. **Daily Outfit**: App logs wear; suggests fresh combinations.
3. **Idle Alerts**: After 4+ weeks unworn, AI pops donation/upcycle options.
4. **Rewards**: Complete a donation → receive GreenTokens; mint an upcycle NFT.

---

### 🛠️ Tech Stack & Architecture

* **Monorepo Structure**:

  * `/app` – Next.js (Frontend & API Routes)
  * `/ai` – Gemini integration and AI utilities
  * `/db` – Supabase schemas & client config
  * `/contracts` – Solidity smart contracts using Foundry (Forge)
  * `/scripts` – Deployment & build scripts
* **Frontend & Backend**: Next.js handles server-side rendering, API routes, and client UI.
* **Database**: Supabase for authentication, user data, and wardrobe metadata.
* **AI**: Google Gemini for vision (garment recognition) and language (styling & guidance).
* **Blockchain**: Solidity contracts deployed on Base network via Foundry, IPFS for NFT metadata.
* **Dev Ops**: CI/CD pipelines for testing contracts and deploying Next.js app.

---

**Why ClothCycle AI?**
Reduces textile waste, empowers users with style confidence, and gamifies sustainability—bridging fashion and eco‑impact seamlessly.
