# Repository Guidelines

This document guides contributors and agents working in this Next.js/React monorepo. Keep changes small, consistent, and production-ready.

## Project Structure & Module Organization
- App Router in `src/app/**` (e.g., `src/app/products/page.tsx`, dynamic `src/app/product/[slug]/page.tsx`). Legacy pages may exist under `src/app/pages/**`.
- UI/feature components in `src/components/` (e.g., `Home`, `Landing`, `admin`, `petugas`, `Detailpage`, `ui`).
- Services in `src/components/lib/services/*.service.ts` (e.g., `produk.service.ts`, `auth.service.ts`).
- Utilities in `src/lib/**` and `src/components/lib/utils/**`.
- Static assets in `public/`. Key config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` — start dev server (Turbopack, port 3000).
- `npm run dev:3001` — dev server on port 3001.
- `npm run build` — production build.
- `npm run start` — run the built app.
- `npm run lint` — lint with ESLint.
- Tests: no runner configured yet. If added, expose `npm test` or `npx vitest`.

## Coding Style & Naming Conventions
- TypeScript, React 19, Next.js 15, Tailwind CSS. Indentation: 2 spaces.
- Components use PascalCase (e.g., `ProductCard.tsx`).
- Hooks prefixed `use` (e.g., `use-mobile.ts`).
- Services end with `.service.ts`.
- Keep imports ordered; remove unused code/types. Folder-based routes via `page.tsx` and `[param]` segments.

## Testing Guidelines
- Prefer Vitest or Jest when adding tests.
- Name tests `*.test.ts` / `*.test.tsx` next to source or under `__tests__/`.
- Prioritize service logic and critical UI state; keep tests fast and deterministic.
- Example: `npx vitest run --coverage` (after adding config).

## Commit & Pull Request Guidelines
- Use clear, imperative commits; prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- PRs include a concise description, linked issues, relevant screenshots, and passing lint/build.
- Keep PRs focused and small; update docs when structure or APIs change.

## Security & Configuration Tips
- Store secrets in `.env.local` (never commit). Client env vars must start with `NEXT_PUBLIC_`.
- Validate inputs in services and API routes; do not trust route params.

## Agent-Specific Instructions
- Scope: applies to the entire repository.
- Keep patches minimal; match existing patterns and directories.
- Avoid unrelated refactors or new dependencies. Do not add license headers.
- When adding files, follow naming rules and prefer small, reviewable diffs.

