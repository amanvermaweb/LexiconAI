# LexiconAI

LexiconAI is a full-stack AI chat platform similar to ChatGPT that supports multiple AI providers such as OpenAI, Claude, Perplexity, and Gemini.  
It features real-time responses, persistent chat history, encrypted API key storage, and a modern UI built with React and Tailwind CSS.

The project demonstrates a scalable architecture for building AI chat applications using the Next.js App Router and server-side API proxies.

## Features

- Multi-provider AI support
- Real-time chat responses
- Persistent chat history with sidebar navigation
- Secure encrypted API key storage using AES-GCM
- Authentication using NextAuth
- Modular API architecture with server-side proxy services
- Modern responsive UI built with Tailwind CSS
- MongoDB database integration with Mongoose

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS

### Backend

- Next.js API routes
- Node.js

### Database

- MongoDB
- Mongoose

### Authentication

- NextAuth

### Security

- AES-GCM encryption for API keys

### AI Providers

- OpenAI
- Claude
- Perplexity
- Gemini

## Installation

Clone the repository:

```bash
git clone https://github.com/amanvermaweb/lexiconai.git
cd lexiconai
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env.local
```

## Authentication

LexiconAI supports the following authentication methods:

### Credentials Authentication

Email and password accounts stored in MongoDB.

### GitHub OAuth

Use the callback URL:

```text
http://localhost:3000/api/auth/callback/github
```

### Google OAuth

Use the callback URL:

```text
http://localhost:3000/api/auth/callback/google
```

## Running the Project

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deployment Checklist

Before deploying:

- Set production environment variables
- Update OAuth callback URLs
- Run production build

```bash
npm run build
```

## Security

User API keys are never stored in plaintext.

All keys are encrypted using **AES-GCM encryption** before being stored in the database.

## Scripts

```bash
npm run dev
npm run build
npm start
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup, pull request checklist, and contribution guidelines.
All participants are expected to follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

[MIT License](./LICENSE)
