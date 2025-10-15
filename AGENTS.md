# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app/...` (e.g., `src/app/products/page.tsx`, dynamic routes like `src/app/product/[slug]/page.tsx`). Some legacy pages and API routes exist under `src/app/pages/**`.
- UI and feature components in `src/components/` (`Home`, `Landing`, `admin`, `petugas`, `Detailpage`, `ui`).
- Services in `src/components/lib/services/*.service.ts` (e.g., `produk.service.ts`, `auth.service.ts`). Utilities in `src/lib/**` and `src/components/lib/utils/**`.
- Static assets in `public/` (images, icons, brands, banners). Key config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` — start dev server (Turbopack, port 3000).
- `npm run dev:3001` — dev server on port 3001.
- `npm run build` — production build.
- `npm run start` — run the built app.
- `npm run lint` — lint with ESLint.

## Coding Style & Naming Conventions
- TypeScript + React 19 + Next.js 15. Follow rules in `eslint.config.mjs`; fix warnings before merge.
- Indentation: 2 spaces. Keep imports ordered; remove unused code and types.
- Components: PascalCase files/exports (e.g., `ProductCard.tsx`). Hooks: `useX` (e.g., `use-mobile.ts`). Services: `*.service.ts`.
- Routes use folder-based `page.tsx` with dynamic `[param]` segments.
- Tailwind CSS utility-first; shared styles in `src/app/globals.css`.

## Testing Guidelines
- No test runner configured yet. If adding tests, prefer Vitest or Jest.
- Name tests `*.test.ts` or `*.test.tsx` next to source or under `__tests__/`.
- Focus on service logic and critical UI state; keep tests fast and deterministic.

## Commit & Pull Request Guidelines
- Use clear, imperative commits. Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- PRs: concise description, linked issues, relevant screenshots, and passing lint/build.
- Keep PRs focused and small; update docs when structure or APIs change.

## Security & Configuration Tips
- Store secrets in `.env.local` (never commit). Client-exposed vars must start with `NEXT_PUBLIC_`.
- Validate inputs in services and API routes; do not trust route params.
