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
npm run build    # type-check + bundle + static story pages → dist/
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
| Theme and motion preferences | `src/lib/preferences.ts` |
| Career timeline and education | `src/data/experience.ts` |
| Simulated chat script and controls | `src/sections/StreamChat.tsx` |

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

Dark mode is the default. Settings offers light mode, five accent choices,
sound, and Full / Reduced / Follow device motion modes. Follow device is the
initial motion preference: the full experience runs unless the OS requests
reduced motion. Preferences are saved locally; changes do not remount the page.

The photo reels have a pause control, and native dialogs provide keyboard
focus management. The animated project rail also offers a grid view. Touch
devices and short viewports use the grid automatically.

The desktop project rail uses native CSS sticky positioning and measured
overflow. GSAP moves the cards without inserting pin spacers. Keyboard focus
reveals offscreen cards, and visitors can skip the rail or switch to a grid.

The career timeline combines the supplied PDF/Word résumé with the LinkedIn
experience text supplied by Gerardo. Dates are stored explicitly; overlapping
freelance work is preserved. Expand each chapter for responsibilities. The
original résumé files and personal contact details are not copied into public assets.

Stream chat is a local simulation with fictional usernames, a 100-message
buffer, and no Twitch connection or persistence. Supplied emotes live in
`public/emotes/`; each has a static WebP counterpart. Pause and reduced motion
stop automatic messages, GIFs, and particle effects. Offscreen/hidden tabs
also suspend the chat; active particles are capped at 32 and removed on finish.

## Public projects

`node scripts/generate-projects.mjs --metadata-only` refreshes public GitHub
metadata without requesting screenshots. Omit `--metadata-only` to also fetch
images. The generator explicitly excludes private repositories, forks, archives,
and the profile README. `CURATION` and `OVERRIDES` in `projects.ts` determine
what is actually displayed and survive regeneration. Review automatically
captured images: animation-heavy pages may be photographed before their reveal.

The featured project descriptions were based on public
documentation reviewed in September 2026. Development milestones are attributed
to those READMEs, not independently executed iOS builds. Update these claims as
the projects progress. Private work is not included.

Project stories use `/projects/<slug>/`. Writing has been removed from the site.
`scripts/build-pages.mjs` generates real static entry pages, per-page metadata,
readable fallback content, and a sitemap. Deploy the whole `dist/` directory so
GitHub Pages can serve direct visits and reloads. No hosting migration is needed.

BenjiBot (`src/lib/chatGuide.ts`) answers terminal-style commands and common
questions from public portfolio data. Try `!help`, `!projects`, `!stream`,
`!experience`, `!contact`, a project name, `!theme pink`, or `!goto photos`.
It is a local scripted guide, with no LLM/API calls or live Twitch status.
Ambient chatter continues while visitors ask questions. Scroll up to read
history without auto-following; use Jump to latest to catch up. Bot replies
are announced to assistive technology; simulated background chatter is not.

## Security maintenance

See [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for the September 2026 review,
implemented safeguards, and remaining hosting/provider controls. Run `npm audit`,
`npm run build`, and then `npm run test:security` before deployment. The security
tests inspect generated pages, so a current build is required. CI audits
dependencies and runs these checks; Dependabot proposes weekly updates.

Photo reels reserve each image’s dimensions before loading and preload their
frames when the gallery approaches the viewport. Keep the local preview server
running so uncached images can load.
