# LexiconAI (WIP)

LexiconAI is a full-stack AI chat platform similar to ChatGPT, supporting multiple AI providers like OpenAI, Claude and Perplexity. It features real-time responses, chat histories, API key storage, and a clean modern UI built with React and Tailwind CSS.

## Features

* Multi-provider AI support
* Real-time chat responses
* Dynamic chat history and sidebar
* Secure encrypted API key storage (AES-GCM)
* Authentication via NextAuth
* Full-stack architecture using Next.js App Router
* MongoDB database powered by Mongoose
* Modern UI with Tailwind CSS

## Tech Stack

* **Frontend**: Next.js, Tailwind CSS, JavaScript
* **Backend**: Next.js App Router APIs, Node.js
* **Database**: MongoDB with Mongoose
* **Auth**: NextAuth
* **Encryption**: AES-GCM
* **AI Integration**: Custom proxy services for OpenAI, Claude, Perplexity, and Gemini

## Installation

1. Clone the repository:

```cd
git clone https://github.com/amanvermaweb/lexiconai.git
cd lexiconai
```

2. Install dependencies:

```cd
npm install
```

3. Create `.env.local`:

```txt
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your-mongodb-uri
ENCRYPTION_KEY=32-byte-key
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Authentication notes

LexiconAI supports:

* **Email + password** via NextAuth Credentials provider (stored in MongoDB).
* **GitHub OAuth** via NextAuth GitHub provider.
* **Google OAuth** via NextAuth Google provider.

To enable Google sign-in, create a Google OAuth app in the Google Cloud Console, add the callback URL
`http://localhost:3000/api/auth/callback/google`, and set the Google client ID/secret in `.env.local`.
For GitHub, use `http://localhost:3000/api/auth/callback/github` as the callback URL.

1. Run the development server:

```cd
npm run dev
```

## Deployment checklist

* Set production env vars (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `MONGODB_URI`, `ENCRYPTION_KEY`, `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
* Update OAuth callback URLs to your production domain.
* Run `npm run build` and confirm it succeeds.
* Deploy with Node.js 18+ and ensure your host can reach MongoDB.

## API Key Handling

API keys are never stored in plain text. They are encrypted using AES-GCM before saving to the database.

## Scripts

* `npm run dev` Start dev server
* `npm run build` Create production build
* `npm start` Run production server
