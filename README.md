# Sommaire - Transform PDFs into a beautiful reel of impactful summaries with the power of AI

![Project Image](https://www.sommaire.vercel.app/opengraph-image.jpg)

Sommaire is an AI-powered application that transforms PDFs into beautiful, structured summaries with key insights. Built with modern web technologies, it offers secure file processing, user management, and subscription-based access.

## ✨ Features

### Application Features

- Clear, structured summaries with key points and insights
- Beautiful, interactive summary viewer with progress tracking
- Secure file handling and processing
- Protected routes and API endpoints
- Flexible pricing plans (Basic and Pro)
- Webhook implementation for Stripe events
- User dashboard for managing summaries
- Responsive design for mobile and desktop
- Real-time updates and path revalidation
- Production-ready deployment
- Toast notifications for upload status, processing updates, and error handling
- Performance optimizations
- SEO-friendly summary generation

### Core Technologies

- _Next.js 15 App Router_ for server-side rendering, routing, and API endpoints
- _React_ for building interactive user interfaces
- _Clerk_ for secure authentication (Passkeys, Github, Google Sign-in)
- _GPT-4_ powered summarization with contextual understanding
- _Langchain_ for PDF parsing and text extraction
- _ShadeN UI_ for accessible, customizable React components
- _NeonDB (PostgreSQL)_ for serverless database storage
- _UploadThing_ for secure PDF uploads (up to 32MB)
- _Stripe_ for subscription management and payments
- _TypeScript_ for static typing
- _TailwindCSS 4_ for responsive styling

## 🚀 Getting Started

To get started with this project:

1. Fork the repo
2. Copy the .env.example variables into a separate .env.local file
3. Create the required credentials:
   - OpenAI API key
   - Clerk authentication
   - UploadThing configuration
   - Stripe payment setup
   - NeonDB database connection
