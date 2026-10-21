# Prince Gajnani — Portfolio

A dark, motion-heavy personal site for a software engineering profile. Built with
Next.js 16 (App Router), Tailwind v4, Motion, Lenis, and a hand-written WebGL
background.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Editing content

**Everything you'll want to change lives in [`src/lib/data.ts`](src/lib/data.ts).**
Projects, experience, skills, achievements, links, and the copy blocks are all
plain objects there — no need to touch components to update the site.

- `projects` — the four featured builds. Each has a pull-quote, summary,
  engineering bullets, stack chips, and a repo link. Adding a fifth just works;
  the index numbers come from the `index` field.
- `labBuilds` — the smaller repos in the draggable rail.
- `experience` / `skillGroups` / `achievements` / `stats` — self-explanatory.
- `latencyCurve` — baseline percentiles the "Under load" simulator scales from.

### Updating the résumé

The PDF lives at `public/Prince-Gajnani-Resume.pdf` and is linked from the hero
and the contact section via `person.resume`. To publish a new version, overwrite
that file keeping the same name — nothing else needs to change. It opens in a
new tab rather than force-downloading, so it can be read on a phone without
committing to a download.

## Design system

One accent (ember `#FF4A1C`) on a warm near-black canvas, in the spirit of
bamlab.ch. Three typefaces: Space Grotesk for display and UI, JetBrains Mono for
labels and data, Instrument Serif italic for pull-quotes.

Tokens live in the `@theme` block of [`src/app/globals.css`](src/app/globals.css)
along with the fluid `display-xl/lg/md`, `label`, and `shell` utilities that the
whole layout keys off. Change the accent there and it propagates everywhere.

## Structure

```
src/
  app/            layout (fonts, metadata), globals.css, page
  lib/            data.ts (all content), hooks.ts
  components/
    fx/           the interaction layer
    sections/     Hero, About, Work, Engine, Path, Achievements, Contact
```

### The interaction layer (`components/fx`)

| File | What it does |
| --- | --- |
| `ShaderField` | Full-bleed WebGL noise field: domain-warped fbm, pointer-reactive, with a CSS fallback |
| `Preloader` | Counter + rotating greetings, exits as a staggered column wipe |
| `IntroProvider` | Gates the hero entrance on the preloader, with a failsafe timeout |
| `Cursor` | Two-part cursor; swells into a labelled pill over `data-cursor` elements |
| `SmoothScroll` | Lenis, plus anchor-link handling. Disabled under reduced motion |
| `Magnetic` | Pulls its child toward the pointer |
| `Reveal` | `MaskText`, `FadeUp`, `Stagger`, `SectionLabel` scroll-in primitives |
| `Counter`, `Marquee`, `Grain`, `ScrollProgress` | Supporting effects |

Add `data-cursor="Label"` to any element to set the custom cursor's label on
hover.

### "Under load"

The Engine section is a live simulator, not a static chart. It scales the
baseline percentiles by an M/M/1 queueing factor (`1 / (1 - ρ)`) weighted
per-percentile, so p50 stays flat while p99.9 runs away as utilisation climbs —
the point the Matching Engine Analyser exists to make. It is labelled
**simulated** in the UI; the numbers are a model, not a benchmark log. Swap in
real measurements via `latencyCurve` if you'd rather show captured data.

## Accessibility & performance

- Everything respects `prefers-reduced-motion`: no preloader, no smooth scroll,
  no custom cursor, and the shader renders a static frame.
- The custom cursor only engages on `(pointer: fine)` devices.
- `MaskText` splits headings into per-word spans for the reveal, so each exposes
  an `sr-only` copy of the intact sentence for screen readers and copy-paste.
- The shader renders at ~55% of CSS pixels, pauses when scrolled offscreen or
  when the tab is hidden, and falls back to CSS if it can't hold frame rate.

## Deploying

Push to GitHub and import on Vercel — it's a stock Next.js app with no env vars
or server dependencies. Fonts are self-hosted at build time via `next/font`, so
there are no runtime third-party requests.
