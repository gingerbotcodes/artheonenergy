# Artheon Energy Scrolltelling Site

Marketing website for Artheon Energy's RG-16X battery regeneration service.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

Site runs at `http://localhost:5173` by default.

## Scripts

- `npm run dev` starts Vite dev server.
- `npm run lint` runs ESLint.
- `npm run build` compiles TypeScript project references and builds production assets.
- `npm run preview` serves the production build locally.

## Project Structure

- `src/App.tsx` main scrolltelling layout and chapter content.
- `src/components/BatteryGraphic.tsx` scroll-reactive RG-16X battery visualization.
- `src/components/Header.tsx` top navigation, mobile menu, and progress indicator.
- `src/components/Footer.tsx` contact CTA and callback form.
- `src/index.css` design tokens, typography, and global styles.

## Notes

- The website is designed as a single-page narrative with anchor-based section navigation.
- Form submission is currently front-end only and shows a success acknowledgement message.
