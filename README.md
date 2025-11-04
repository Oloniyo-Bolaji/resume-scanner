# YourResumeScanner 🦷

> An AI-powered résumé scanner that instantly checks your résumé against job descriptions, and gives you actionable insights to boost your chances of getting hired.

[Live Demo](https://yourresumescanner.vercel.app)

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Built With](#️-built-with)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Roadmap](#️-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## 🎯 About The Project

![YourResumeScanner Screenshot](public/screenshot.png)

**YourResumeScanner** is an AI-powered oral health companion that makes dental care information accessible to everyone. Whether you're curious about different types of teeth, seeking advice on dental hygiene, or have questions about oral health conditions, yourresumescanner provides instant, accurate, and easy-to-understand responses.

## ✨ Features

- 🚀 **Lightning-Fast Responses** - Powered by Groq's ultra-fast inference
- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 📱 **Mobile Optimized** - Seamless experience across all devices
- 📊 **Rich Formatting** - Beautiful markdown rendering with tables and lists
- 🔐 **Secure Authentication** - Google OAuth integration via NextAuth
- ♿ **Accessible** - Built with accessibility best practices

## 🛠️ Built With

### Core Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type Safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[ShadCN/UI](https://ui.shadcn.com/)** - UI Library 


### Backend & Database

- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Drizzle](https://orm.drizzle.team/docs/overview)** - Database ORM
- **[Vercel](https://vercel.com/)** - Hosting & deployment

### APIs & Integrations

- **[Groq API](https://groq.com/)** - AI language model (Llama 3.3 70B)
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **[Google Cloud Console](https://console.cloud.google.com/)** - Social login

### UI Libraries

- **[Lucide React](https://lucide.dev/guide/packages/lucide-react)** - Icon library

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
# Node.js v18 or higher
node --version  # Should be >= 18.0.0

# npm or yarn
npm --version   # or
yarn --version

# Git
git --version
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Oloniyo-Bolaji/yourresumescanner.git
cd yourresumescanner
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up your database**

```bash
# If using Prisma
npx drizzle-kit generate
npx drizzle-kit push
```

4. **Configure environment variables** (see below)

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yourresumescanner?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"  # Generate: openssl rand -base64 32

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Groq API
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Optional: App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Getting API Keys

#### 1. **Groq API Key**

- Visit [console.groq.com](https://console.groq.com)
- Sign up or log in
- Navigate to API Keys
- Create a new API key
- Copy and paste into `.env.local`

#### 2. **Google OAuth Credentials**

- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project or select existing
- Enable Google+ API
- Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
- Application type: **Web application**
- Add authorized JavaScript origins:
  - `http://localhost:3000`
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
- Copy Client ID and Client Secret to `.env.local`

#### 3. **NextAuth Secret**

```bash
# Generate a secure random string
openssl rand -base64 32
```

## 💻 Usage

1. Open yourresumescanner in your browser
2. Sign in with your Google account/email and password
3. Fill in the required details if available and Uplaod resume
4. Get instant AI-powered responses with beautiful formatting and interface

## 🗺️ Roadmap

### Completed ✅

- [x] Core chat functionality with Groq AI
- [x] Google OAuth authentication
- [x] Responsive mobile design

### Planned 📅

- [ ] 
- [ ] 


## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

Website: [https://yourresumescanner.vercel.app](https://yourresumescanner.vercel.app)

## 🙏 Acknowledgments

Special thanks to these amazing resources:

- **[Groq](https://groq.com/)** - Lightning-fast AI inference engine
- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Vercel](https://vercel.com/)** - Seamless deployment platform
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication made simple
