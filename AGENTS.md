# Repository Guidelines

This document guides contributors and agents working in this Next.js/React codebase. Follow these conventions to keep changes consistent, reviewable, and production-ready.

## Project Structure & Module Organization
- App Router lives in `src/app/...` (e.g., `src/app/products/page.tsx`), dynamic routes like `src/app/product/[slug]/page.tsx`. Legacy pages/API may exist under `src/app/pages/**`.
- UI/feature components in `src/components/` (`Home`, `Landing`, `admin`, `petugas`, `Detailpage`, `ui`).
- Services in `src/components/lib/services/*.service.ts` (e.g., `produk.service.ts`, `auth.service.ts`); utilities in `src/lib/**` and `src/components/lib/utils/**`.
- Static assets in `public/`. Key config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` — start dev server (Turbopack, port 3000).
- `npm run dev:3001` — dev server on port 3001.
- `npm run build` — production build.
- `npm run start` — run the built app.
- `npm run lint` — lint with ESLint.

## Coding Style & Naming Conventions
- TypeScript + React 19 + Next.js 15. Tailwind CSS. Indentation: 2 spaces.
- Components: PascalCase files/exports (e.g., `ProductCard.tsx`). Hooks: `useX` (e.g., `use-mobile.ts`). Services: `*.service.ts`.
- Keep imports ordered; remove unused code and types. Routes use folder-based `page.tsx` with dynamic `[param]` segments.

## Testing Guidelines
- No test runner configured yet. If adding tests, prefer Vitest or Jest.
- Name tests `*.test.ts` or `*.test.tsx` next to source or under `__tests__/`.
- Prioritize service logic and critical UI state; keep tests fast and deterministic.

## Commit & Pull Request Guidelines
- Use clear, imperative commits; prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- PRs: concise description, linked issues, relevant screenshots, and passing lint/build.
- Keep PRs focused and small; update docs when structure or APIs change.

## Security & Configuration Tips
- Store secrets in `.env.local` (never commit). Client-exposed env vars must start with `NEXT_PUBLIC_`.
- Validate inputs in services and API routes; do not trust route params.

## Agent-Specific Instructions
- Scope: This file applies to the entire repository tree.
- Keep patches minimal and targeted; match existing patterns and directories.
- Avoid unrelated refactors or new dependencies. Do not add license headers.
- When adding files, follow naming rules above and prefer small, reviewable diffs.

