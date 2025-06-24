# Clothcycle AI Beta

A sustainable fashion platform powered by AI. Make your wardrobe more sustainable, social, and smart with AI-powered insights.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Clothcycle-AI-Beta
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the project root and add the following variables:

## Environment Variables

| Variable Name                              | Description                       |
|--------------------------------------------|-----------------------------------|
| NEXT_PUBLIC_FIREBASE_API_KEY               | Your Firebase API key             |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN           | Your Firebase Auth domain         |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID            | Your Firebase project ID          |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET        | Your Firebase storage bucket      |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID   | Your Firebase messaging sender ID |
| NEXT_PUBLIC_FIREBASE_APP_ID                | Your Firebase app ID              |

Example `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Firebase Setup

- Go to [Firebase Console](https://console.firebase.google.com/), create a project, and add a web app.
- Copy your config values into `.env.local` as shown above.
- Enable **Authentication** (Email/Password, Google) and **Firestore Database** in the Firebase Console.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm start` — Start the production server

## License

MIT
