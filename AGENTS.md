# bo-template

Backoffice template built with Next.js 16, Supabase Auth, and shadcn/ui. Designed as a scalable foundation for admin panels, dashboards, and internal tools.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — Run Biome (linting + formatting with auto-fix)
- `pnpm commit` — Interactive conventional commit via Commitizen

## Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Auth**: Supabase SSR (`@supabase/ssr`)
- **UI**: shadcn/ui (radix-nova style) + Tailwind CSS v4 (OKLCH color space)
- **Icons**: lucide-react
- **Language**: TypeScript (strict mode)
- **Linter/Formatter**: Biome 2.4 (tabs, double quotes, auto-organized imports)
- **Commits**: Conventional Commits enforced via Commitlint + Husky

### Directory Structure

```
app/
├── (auth)/              # Public auth routes (login, signup, callback)
├── (dashboard)/         # Protected routes with sidebar layout
├── layout.tsx           # Root layout
├── page.tsx             # Redirects to /dashboard
└── globals.css          # Theme tokens (OKLCH CSS vars)

components/
├── ui/                  # shadcn/ui primitives (DO NOT edit manually — use `pnpm shadcn add`)
├── app-sidebar.tsx      # Sidebar shell (receives user prop from server)
├── login-form.tsx       # Login form (client component + server action)
├── signup-form.tsx      # Signup form (client component + server action)
├── nav-main.tsx         # Main navigation items
├── nav-user.tsx         # User dropdown with logout
├── nav-projects.tsx     # Projects sidebar section
└── team-switcher.tsx    # Organization switcher

lib/
├── supabase/
│   ├── server.ts        # Server-side Supabase client (cookies-based)
│   ├── client.ts        # Browser-side Supabase client
│   ├── proxy.ts         # Middleware: session refresh + route guards
│   └── actions.ts       # Server actions: login, signup, logout
└── utils.ts             # cn() — clsx + tailwind-merge

hooks/
└── use-mobile.ts        # Viewport breakpoint hook (768px)

proxy.ts                 # Next.js 16 middleware entry point
```

### Routing Conventions

- **Route groups** `(auth)`, `(dashboard)` for layout separation without URL segments.
- **Protected routes**: The proxy middleware (`proxy.ts` → `lib/supabase/proxy.ts`) redirects unauthenticated users to `/login` and authenticated users away from auth pages.
- **New feature routes** go inside `(dashboard)/` with their own `page.tsx`. If a feature needs multiple pages, create a subfolder: `(dashboard)/settings/page.tsx`, `(dashboard)/settings/billing/page.tsx`.

### Auth Flow

```
Request → proxy.ts → updateSession() → supabase.auth.getUser()
  ├── No user + protected route → redirect /login
  ├── User + auth route → redirect /dashboard
  └── Otherwise → continue with refreshed session cookies
```

- **Server actions** in `lib/supabase/actions.ts` handle form submissions.
- **Auth callback** at `(auth)/callback/route.ts` exchanges OAuth/magic-link codes for sessions.
- **User data** flows from server (dashboard layout) → AppSidebar → NavUser via props, never fetched client-side.

## Code Guidelines

### Component Patterns

- **Server Components by default**. Only add `"use client"` when the component needs hooks, event handlers, or browser APIs.
- **Server Actions** (`"use server"`) for all mutations. Forms use `useActionState` to bind actions with loading/error state.
- **Props over context** for data that flows from server to client. Context is reserved for UI state only (sidebar, tooltips).
- **Colocation**: Keep page-specific components next to their page. Shared components go in `components/`.

### Data Fetching Strategy

- **Server-first by default**: Initial page data loads in Server Components via `createClient()` from `lib/supabase/server.ts`.
- **Client-side when UX demands it**: Use `createClient()` from `lib/supabase/client.ts` for:
  - Search/filter as-you-type (on-demand queries)
  - Infinite scroll / load more pagination
  - Real-time subscriptions (Supabase Realtime)
  - Post-mount interactions triggered by the user
- **Pattern for client-side fetching**: Keep Supabase queries in custom hooks inside `hooks/` or in colocated files next to the feature. Never scatter raw `supabase.from(...)` calls across components.

### Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase file + export | `app-sidebar.tsx` → `AppSidebar` |
| Hooks | `use-` prefix, kebab-case file | `use-mobile.ts` → `useIsMobile` |
| Server actions | Verb, camelCase | `login`, `signup`, `logout` |
| Route files | Next.js conventions | `page.tsx`, `layout.tsx`, `route.ts` |
| Types | PascalCase, co-located or in same file | `AuthResult` |

### Styling

- Use `cn()` from `lib/utils` for conditional classes. Never string concatenation.
- Tailwind utility-first. No custom CSS unless extending the design system in `globals.css`.
- Color tokens use CSS variables (`--background`, `--primary`, etc.) — never hardcode colors.
- `components/ui/` files are generated by shadcn. Do not edit them manually. Use `pnpm shadcn add <component>` to add new ones.

### Biome Rules

- Biome handles both linting and formatting. No ESLint or Prettier needed for application code.
- `components/ui/` has relaxed lint rules (configured in `biome.json` overrides) since those are generated.
- Run `pnpm lint` before committing. Husky pre-commit hook runs lint-staged automatically.

### Supabase Client Usage

- **Server Components / Server Actions / Route Handlers**: Use `createClient()` from `lib/supabase/server.ts`.
- **Client Components**: Use `createClient()` from `lib/supabase/client.ts`.
- **Middleware**: Has its own client in `lib/supabase/proxy.ts` — do not import server/client there.
- Never expose `service_role` key. All client-side access uses the `anon` key.

### Commits

Follow Conventional Commits. Husky enforces this via commitlint.

```
feat(scope): add new feature
fix(scope): fix specific bug
style(scope): formatting, no logic changes
refactor(scope): restructure without behavior change
chore(scope): tooling, deps, config
```

Use `pnpm commit` for the interactive wizard or write manually.

### Adding a New Feature (Checklist)

1. Create route in `app/(dashboard)/<feature>/page.tsx`
2. If it needs a layout, add `layout.tsx` in the same folder
3. Shared components go in `components/`, page-specific stay colocated
4. Database queries go in server components or server actions. For client-side on-demand queries (search, pagination), encapsulate them in a custom hook under `hooks/`
5. Add navigation entry in `components/app-sidebar.tsx` data config
6. Run `pnpm build` to verify before committing

### What NOT to Do

- Don't fetch user/auth data client-side — it's already available via the dashboard layout server component.
- Don't create API routes (`route.ts`) for mutations — use server actions instead.
- Don't scatter raw `supabase.from(...)` calls in components — wrap client-side queries in custom hooks.
- Don't install Prettier or additional ESLint plugins — Biome handles everything.
- Don't put business logic in `components/ui/` — those are UI primitives only.
- Don't use `middleware.ts` — Next.js 16 uses `proxy.ts`.
