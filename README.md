# KnowSift

KnowSift is an AI-powered **web application** that summarizes, organizes, and tracks insights from business-related videos—turning passive watching into active learning. Paste a YouTube link to get a concise summary, actionable steps, tags, and spaced-repetition cards.

This repository is a **Next.js** monorepo managed with **pnpm** and **Turborepo**. The UI is styled with **Tailwind CSS**.

## Project Goals

- Provide concise summaries of YouTube content using AI
- Allow users to collect notes and highlights across videos
- Build a searchable knowledge base for repeated reference

## Repository Layout

```
/apps             Next.js applications
  web/            Public web app (Next.js 14 + Tailwind CSS)
/packages         Shared code consumed by the apps
  core-ai/        AI utilities
  scraper/        Data scraping helpers
```

The workspace is managed with **pnpm** and **Turborepo**.

## Tech Stack

- **Next.js 14** and **React** for web applications
- **Tailwind CSS** for styling
- **TypeScript** throughout the repo
- **pnpm** for package management
- **Turborepo** for task orchestration

## Getting Started

1. Copy `.env.example` to `.env.local`. It contains placeholder values for the
   environment variables used throughout the apps. Replace each placeholder with
   your own credentials:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`
   - `APIFY_TOKEN`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server for all apps:
   ```bash
   pnpm dev
   ```
   This runs `turbo dev`, which executes each workspace's `dev` script concurrently.

These commands will evolve as the monorepo grows, but they provide a basic workflow for now.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for full guidelines. In short:

- Use **Node.js 18**.
- Run `pnpm lint` and `pnpm format` before committing changes.
- Tests will use **Jest** and **Playwright** (`pnpm test` and `pnpm test:e2e`).
- Create feature branches and open pull requests against `main`.

## Contributing

Community involvement is welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.
