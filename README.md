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
* **AI Integration**: Custom proxy services for OpenAI, Claude, and Perplexity

## Installation

1. Clone the repository:

```cd
git clone https://github.com/amanvermadev/lexiconai.git
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
```

4. Run the development server:

```cd
npm run dev
```

## API Key Handling

API keys are never stored in plain text. They are encrypted using AES-GCM before saving to the database.

## Scripts

* `npm run dev` Start dev server
* `npm run build` Create production build
* `npm start` Run production server
