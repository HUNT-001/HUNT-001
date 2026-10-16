# Portfolio — Tanush Pavan V

The personal site: a cinematic Home scroll plus routed depth pages, built from the
approved design mockup. Next.js (App Router) · TypeScript · Tailwind · Framer Motion · Lenis.

## Run it

```bash
cd portfolio
npm install
npm run dev        # http://localhost:3000
```

Build / preview production:

```bash
npm run build
npm start
```

## Deploy (Vercel)

Point Vercel at this repo with **Root Directory = `portfolio`**. Framework preset: Next.js.
It serves with no env vars at your domain (e.g. tanushpavan.vercel.app).

**Optional — live AI in the Q&A widget.** The `/contact` widget answers instantly from a curated
knowledge base (`src/lib/qa.ts`). To upgrade it to live, AI-generated answers grounded on the same
facts, add a Vercel env var:

```
ANTHROPIC_API_KEY = sk-ant-...        # required to enable AI mode
ANTHROPIC_MODEL   = claude-sonnet-4-5 # optional override
```

Without the key, the widget quietly stays in "instant" (knowledge-base) mode — nothing breaks.

## What's built

- **Home (`/`)** — the full scroll, responsive: Hero (night-lake backdrop) → domain marquee →
  Focus grid (9 domains, animated technical backplane, hover-reveal flows) → Featured work →
  Experience timeline (hover-alive, institution monograms) → Recognition (trophy wins + telemetry
  axis) → Writing → Contact.
- **Routed pages** — `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`, `/lab`, `/about`,
  `/contact`, `/resume`, `/uses`, `/now`, `/wins`. These currently render a consistent shell with
  real data where available and an "in progress" marker where the full page is still to come.

## Where things live

- `src/lib/content.ts` — **single source of truth** for domains, projects, experience, wins, posts.
  Edit here and every section updates.
- `src/components/sections/*` — the Home sections.
- `src/app/globals.css` — the design system (tokens, section styles, responsive rules).
- `public/` — avatar-hero (night-lake), avatar-portrait, candid photo.

## Next up

Case-study pages, the MDX blog wired to the repo's `blogs/` folder, the Lab demos
(live Dream Log first), a web résumé + PDF, and the live Q&A widget on `/contact`.
