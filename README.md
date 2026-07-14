# Artheon Energy Website

Marketing website for Artheon Energy's solar EPC, EV charging, and battery regeneration services.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Site runs at `http://localhost:5173` by default.

## Scripts

- `npm run dev` starts Vite dev server.
- `npm run lint` runs ESLint.
- `npm run build` compiles the app and generates SEO-ready HTML for every public route.
- `npm run seo:check` validates route metadata, canonicals, structured data, sitemap coverage, and social images.
- `npm run preview` serves the production build locally.

## Project Structure

- `src/App.tsx` page content, routing, forms, and navigation.
- `src/seo.ts` runtime route metadata and structured data.
- `scripts/generate-seo-pages.mjs` build-time route HTML generator.
- `scripts/validate-seo.mjs` production SEO validator.
- `src/components/BatteryGraphic.tsx` scroll-reactive battery visualization.
- `src/components/Header.tsx` top navigation, mobile menu, and progress indicator.
- `src/components/Footer.tsx` contact CTA and callback form.
- `src/index.css` design tokens, typography, and global styles.

## Public Routes

- `/` solar EPC and EV charging homepage.
- `/regeneration` battery regeneration service.
- `/blog` and `/blog/:slug` educational content.
- `/terms` terms and conditions.

Each route receives unique titles, descriptions, canonicals, social metadata, and JSON-LD. `public/sitemap.xml` and `public/robots.txt` are deployed at the site root.

## Web3Forms Setup

1. Create or open your account at [Web3Forms](https://web3forms.com/).
2. Copy your access key.
3. Set `VITE_WEB3FORMS_ACCESS_KEY` in `.env`.
4. Restart dev server after updating `.env`.
