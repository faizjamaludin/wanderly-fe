# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Build
npm run build        # Type-check with vue-tsc, then build with Vite

# Preview production build
npm run preview
```

There is no lint or test command configured — only `dev`, `build`, and `preview` scripts exist.

## Architecture

**Stack:** Vue 3 + TypeScript + Vite + Tailwind CSS v4 + Pinia + Vue Router

### Routing

All routes are nested under a single `DashboardLayout` parent at `/`. Route modules live in `src/routes/modules/` and are imported into `src/routes/router.ts`. Adding a new feature area means creating a new module file and spreading it into the children array in `router.ts`.

Current routes:
- `/` → Dashboard
- `/mytrip` → My Trips list
- `/new-trip` → New trip creation flow (multi-step form)

### UI Components (`src/components/ui/`)

UI primitives are based on **shadcn-vue** (style: `new-york`, base: `reka-ui`). Each component lives in its own folder with a barrel `index.ts`. Use the `cn()` utility from `@/lib/utils` (which combines `clsx` + `tailwind-merge`) for conditional class composition.

Forms use **vee-validate** with **zod** for schema validation. The `FormField` / `FormItem` / `FormLabel` / `FormMessage` components wrap vee-validate's `FieldContextKey` injection — always use `FormField` with `v-slot="{ componentField }"` and spread `v-bind="componentField"` onto the input.

### Sidebar

The sidebar is data-driven: navigation items are declared in `src/components/sidebar/config.ts` as a `mainSidebar` array of groups. Active state is derived from `useRoute().path` compared against each item's `url`. To add a nav item, edit `config.ts` only.

### New Trip Flow

The multi-step creation form lives in `src/views/my-trips/new-trip/`. Each step is a separate component (`TripDetails.vue`, `CollaboratorAccomodation.vue`, `Budget.vue`). The parent `NewTrip.vue` currently renders one step directly — step orchestration is not yet wired up.

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js`). Custom design tokens are declared in `src/style.css` under `@theme`:

| Token | Value |
|---|---|
| `background-brand` | `#f7f5f0` (page background) |
| `primary-brand` | `#2d6a4f` (green primary) |
| `secondary-brand` | `#e8f4ee` (green tint, active sidebar bg) |
| `text-primary` | `#1a1917` |
| `text-muted` | `#6b6860` |
| `text-caption` | `#a09e97` |

### Path Aliases

`@` resolves to `src/`. Always use `@/` imports rather than relative paths when importing across feature boundaries.
