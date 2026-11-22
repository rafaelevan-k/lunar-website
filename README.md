# Lunar Website

The public showcase site for [Lunar](https://github.com/rafaelevan-k/lunar), a Dynamic Island for Windows 11.
Frontend only: every page is prerendered and served from Vercel.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lenis · next-intl · lucide-react ·
Playwright + axe · npm · Vercel Hobby

## Develop

```powershell
npm ci
npm run dev
```

Open http://localhost:3000.

Before committing:

```powershell
npm run lint
npm run format:check
npm run typecheck
npm run build
```

End-to-end tests (install the browser once with `npx playwright install chromium`):

```powershell
npm run test:e2e
```

## License

Not chosen yet (no LICENSE file). Lunar itself is Apache-2.0. Copyright 2026 Rafael Evan Kristanto.
