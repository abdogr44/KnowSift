# Development Guide

## Recommended Node.js Version

We recommend using **Node.js 18**. Other versions may work, but the project is tested primarily with Node 18.

## Linting and Formatting

Use pnpm to run the lint and format commands:

```bash
pnpm lint    # runs ESLint across the workspace
pnpm format  # runs Prettier to format files
```

## Testing

The repository plans to use **Jest** for unit tests and **Playwright** for end-to-end testing. When tests are in place, run them with:

```bash
pnpm test       # Jest unit tests
pnpm test:e2e   # Playwright end-to-end tests
```

## Branching and Pull Requests

- Create a feature branch for each change.
- Run linting, formatting, and tests before opening a pull request.
- Keep pull requests focused and small when possible.
- Submit PRs to the `main` branch and wait for review before merging.
