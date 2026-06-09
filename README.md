# gerardocolegio.dev — Developer Portfolio

A maximalist, GSAP-powered developer portfolio for **Gerardo "Benji" Colegio**.
Rebuilt from the original 2023 static Bootstrap site into a modern React app.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **GSAP 3** — ScrollTrigger, Flip, Draggable + Inertia, ScrambleText, plus a
  custom magnetic-cursor and smooth scrolling via **Lenis**
- Deployed to **GitHub Pages** at the apex domain `gerardocolegio.dev`

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-check + production bundle → dist/
npm run preview  # serve the built bundle locally
```

## Deploy

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. The custom domain is carried by
`public/CNAME`.

> One-time setup: in the repo, go to **Settings → Pages → Build and deployment →
> Source = "GitHub Actions"**.

## Editing content

All the stuff you'll want to change lives in a few files:

| What | Where |
| --- | --- |
| Project cards (titles, blurbs, tech, links, screenshots) | `src/data/projects.ts` |
| Social links + email | `src/data/socials.ts` |
| Bio copy | `src/sections/About.tsx` |
| Hero headline | `src/sections/Hero.tsx` |

Project screenshots live in `public/projects/`, photography in
`public/photography/`. The original 2023 site is preserved under `legacy/`.

## Project structure

```
src/
  components/   reusable UI (Nav, Cursor, Reveal, Icon, MagneticLink…)
  sections/     page sections (Hero, About, Projects, Playground, Photography…)
  hooks/        useSmoothScroll, useMagnetic
  lib/gsap.ts   central GSAP plugin registration + motion helpers
  data/         editable content (projects, socials)
```

All animations respect `prefers-reduced-motion` and the custom cursor / heavy
pins are disabled on touch devices.
