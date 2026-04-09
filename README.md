# Pokémon Explorer

A production-quality Content Explorer built with Next.js 15, TypeScript, and Tailwind CSS, powered by the [PokéAPI](https://pokeapi.co) — no API key required.

## Live Demo

> Deployed on Cloudflare Pages: **[pokee-1de.pages.dev](https://pokee-1de.pages.dev/)**

---

## Setup

```bash
git clone https://github.com/Aladefaruk/poke.git
cd content-explorer
npm install
npm run dev   # http://localhost:3000
```

No API key needed. PokéAPI is completely free and open.

---

## API Choice: PokéAPI

PokéAPI was chosen because:
- Completely free with no API key or account required — zero setup friction
- Rich, stable REST API with paginated Pokémon lists and detailed per-Pokémon data
- High-quality official artwork images via the PokeAPI sprites GitHub CDN
- Multiple filter dimensions (type, sort) enabling a meaningful UI
- Well-documented and widely used — good signal for real-world patterns

---

## Architecture Decisions

### Folder Structure

```
app/                    # Next.js App Router pages
  api/pokemon/          # Route handler (TanStack Query target)
  pokemon/              # Listing page (SSR)
  pokemon/[id]/         # Detail page (SSG + on-demand ISR)
components/             # Pure UI components, co-located with their logic
hooks/                  # Custom React hooks (usePokemon, useDebounce)
lib/                    # API abstraction (pokeapi.ts), utilities, providers
types/                  # Shared TypeScript interfaces
__tests__/              # Vitest + RTL tests
```

### Server vs Client Rendering

- **Listing page (`/pokemon`)**: Server Component that fetches only the type list server-side (for the filter dropdown), then returns immediately. The grid is populated client-side by `PokemonExplorer` via TanStack Query.
- **Interactive layer (`PokemonExplorer`)**: Client Component that takes over after hydration. Search/filter/pagination state lives here, driven by TanStack Query hitting `/api/pokemon`. URL is kept in sync via `useSearchParams` + `router.replace` so results are shareable.
- **Detail page (`/pokemon/[id]`)**: Rendered on-demand at the edge on first request. 

### Why Pagination over Infinite Scroll

Pagination was chosen because:
1. **Shareability**: A URL like `?page=5` is bookmarkable and shareable. Infinite scroll loses position on refresh.
2. **Performance**: Rendering 20 items at a time keeps DOM size bounded. Infinite scroll accumulates DOM nodes.
3. **Accessibility**: Keyboard users and screen readers navigate paginated content more predictably.

### State Management

No global state library was needed. State is co-located:
- URL search params = source of truth for shareable state (query, type, page, sort)
- `useState` in `PokemonExplorer` for controlled inputs (before debounce fires)
- TanStack Query for server state (caching, deduplication, background refetch)

### API Abstraction

All `fetch()` calls are in `lib/pokeapi.ts`. Components never call `fetch()` directly — they either receive data as props (Server Components) or call hooks that hit `/api/pokemon` (Client Components). This makes the API layer independently testable and swappable.

### Search Behaviour

PokéAPI has no fuzzy search endpoint. Search matches exact Pokémon names (e.g. `pikachu`, `charizard`). The empty state copy communicates this to the user. With more time, a client-side prefix filter over the full name list would be a better UX.

---

## Performance Optimizations

### 1. `next/image` with explicit dimensions and `priority`
Every `<Image>` has explicit `sizes` and `fill` props. Above-the-fold cards (first 4) and the detail page sprite use `priority={true}` to trigger `<link rel="preload">`, directly improving LCP.

### 2. `next/font` for Inter
`Inter` is loaded via `next/font/google` with `display: swap` and `subsets: ["latin"]`. This self-hosts the font, eliminates the render-blocking Google Fonts request, and prevents layout shift (CLS = 0 from font swap).


### 3. Cloudflare Cache-Control headers on API route
The `/api/pokemon` route handler returns:
```
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```
This lets Cloudflare's edge cache serve repeated identical queries (same search term, same page) for 60 seconds, with stale content served for up to 5 minutes while revalidating in the background.

### 5. Route-level code splitting via `dynamic` (implicit)
`PokemonExplorer` is a Client Component imported into a Server Component page. Next.js automatically code-splits it into a separate JS chunk that is only loaded after the server-rendered HTML is painted. Heavy client-side logic (TanStack Query, debounce, URL sync) doesn't block the initial render.

### 6. `scrollbar-gutter: stable`
Prevents the 15px layout shift that occurs when navigating between pages with/without a scrollbar — a common CLS source.

---

## Trade-offs & Known Limitations

| Area | Decision | What I'd do with more time |
|---|---|---|
| **Images on Cloudflare** | `next/image` optimisation requires a Node.js server. On Cloudflare Workers `unoptimized: true` is set so images are served directly from the GitHub sprites CDN. | Configure a Cloudflare Images loader for resizing and WebP conversion. |
| **Search UX** | PokéAPI has no search endpoint — only exact name lookup. | Fetch the full name list once, cache it, and do client-side prefix filtering for a proper typeahead experience. |
| **Type filter performance** | Filtering by type fetches all members of that type (up to 200) in parallel, then paginates client-side. | Cache type member lists at the edge to avoid the fan-out on every request. |
| **Edge runtime** | `generateStaticParams` was removed as it is incompatible with the edge runtime. All pages render on-demand and rely on Cloudflare's CDN cache. | Pre-render popular Pokémon at build time using a Node.js runtime target. |
| **Error reporting** | `console.error` only. | Integrate Sentry with `captureException` in error boundaries. |
| **Accessibility audit** | Manual checks only. | Run `axe-core` in CI and fix all violations before shipping. |

---

## Testing

```bash
npm test          
npm run test:watch  
```

Tests cover:
- `Pagination` — 11 tests: rendering, ARIA attributes, click handlers, ellipsis logic, 500-page cap
- `SearchBar` — 8 tests: rendering, controlled input, clear button, accessibility
- `lib/utils` — 14 tests: all formatting functions and `clamp`

---

## Deployment: Cloudflare Pages

Deployed via Cloudflare Pages connected to GitHub. Every push to `main` triggers a new deploy automatically.

| Field | Value |
|---|---|
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Node.js version | `20` |
| Compatibility flag | `nodejs_compat` |

No environment variables required. PokéAPI is fully public.
