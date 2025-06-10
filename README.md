# KnowSift


KnowSift is an AI-powered browser and YouTube extension designed to turn passive video watching into active learning. The project aims to summarize, organize, and track insights from business-related videos so professionals can capture key takeaways with ease.

## Project Goals

- Provide concise summaries of YouTube content using AI
- Allow users to collect notes and highlights across videos
- Build a searchable knowledge base for repeated reference

## Planned Structure

```
/packages          Monorepo workspace for all code
  extension/      Browser extension source
  api/            Server-side API and services
  ui/             Shared UI components
```

This repository will use pnpm workspaces to manage the packages.

## Tech Stack

- **TypeScript** and **React** for front‑end development
- **Node.js** with **Express** for backend services
- **Prisma** with **PostgreSQL** for data management
- **Vite** for fast bundling and development
- **pnpm** for package management

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```

These commands will evolve as the monorepo grows, but they provide a basic workflow for now.

## Contributing

Community involvement is welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.
=======
An AI-powered browser &amp; YouTube extension that summarizes, organizes, and tracks insights from business-related YouTube videos — turning passive watching into active learning.
Paste a YouTube link, get a concise summary, action points, tags, and spaced-repetition cards.

