# bo-template

Backoffice template built with Next.js 16, Supabase Auth, and shadcn/ui. Designed as a scalable foundation for admin panels, dashboards, and internal tools. Includes RBAC, data tables, command palette, profile management, and user administration.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — Run Biome (linting + formatting with auto-fix)
- `pnpm commit` — Interactive conventional commit via Commitizen

## Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Auth**: Supabase SSR (`@supabase/ssr`)
- **Database**: Supabase (Postgres) with RLS policies
- **UI**: shadcn/ui (radix-nova style) + Tailwind CSS v4 (OKLCH color space)
- **Data Tables**: TanStack React Table v8 (`@tanstack/react-table`)
- **Command Palette**: cmdk
- **Validation**: Zod v4
- **Toasts**: Sonner
- **Theming**: next-themes (light/dark/system)
- **Icons**: lucide-react
- **Language**: TypeScript (strict mode)
- **Linter/Formatter**: Biome 2.4 (tabs, double quotes, auto-organized imports)
- **Commits**: Conventional Commits enforced via Commitlint + Husky

### Directory Structure

```
app/
├── (auth)/
│   ├── layout.tsx           # Split layout: form + branded panel
│   ├── error.tsx            # Auth error boundary
│   ├── loading.tsx          # Auth loading skeleton
│   ├── callback/route.ts    # OAuth/magic-link code exchange
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx           # Sidebar + breadcrumb + RoleProvider + CommandPalette
│   ├── error.tsx            # Dashboard error boundary
│   ├── loading.tsx          # Dashboard loading skeleton
│   ├── not-found.tsx        # Dashboard 404 page
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── columns.tsx      # TanStack column definitions
│   │   └── loading.tsx      # Page-level loading skeleton
│   ├── profile/page.tsx     # Profile + password change forms
│   └── users/
│       ├── page.tsx         # Admin-only user management (uses requireAdmin)
│       └── columns.tsx      # User table column definitions
├── layout.tsx               # Root layout (ThemeProvider, TooltipProvider, Toaster)
├── page.tsx                 # Redirects to /dashboard
├── not-found.tsx            # Global 404 page
└── globals.css              # Theme tokens (OKLCH CSS vars)

components/
├── ui/                      # shadcn/ui primitives (DO NOT edit — use `pnpm shadcn add`)
├── app-sidebar.tsx          # Sidebar shell with nav config (receives user prop from server)
├── can.tsx                  # Permission gate component (server-compatible)
├── command-palette.tsx      # Cmd+K palette (navigation, theme, logout)
├── confirm-dialog.tsx       # Async confirm dialog with loading state
├── data-table.tsx           # Generic DataTable (search, sort, paginate)
├── dynamic-breadcrumb.tsx   # Auto-breadcrumb from pathname
├── login-form.tsx           # Login form (useActionState + server action)
├── signup-form.tsx          # Signup form (useActionState + server action)
├── forgot-password-form.tsx # Forgot password form
├── reset-password-form.tsx  # Reset password form
├── profile-form.tsx         # Profile info + password change forms
├── users-table.tsx          # Admin users table (role select, delete with confirm)
├── nav-main.tsx             # Main navigation items (collapsible groups)
├── nav-user.tsx             # User dropdown (account, theme toggle, logout)
├── nav-projects.tsx         # Projects sidebar section
├── team-switcher.tsx        # Organization switcher
└── theme-provider.tsx       # next-themes wrapper (client component)

lib/
├── supabase/
│   ├── server.ts            # Server-side Supabase client (cookies-based)
│   ├── client.ts            # Browser-side Supabase client
│   ├── proxy.ts             # Middleware: session refresh + route guards
│   ├── actions.ts           # Auth server actions: login, signup, logout, forgotPassword, resetPassword, updateProfile
│   ├── auth.ts              # getAuthUser() + requireAdmin() helpers
│   ├── admin-actions.ts     # Admin server actions: getUsers, updateUserRole, deleteUser
│   └── migrations/
│       └── 001_roles.sql    # profiles table, RLS policies, triggers
├── types/
│   └── roles.ts             # UserRole, Permission, ROLE_PERMISSIONS, hasPermission, hasRole
├── validations/
│   ├── auth.ts              # Zod schemas: login, signup, forgotPassword, resetPassword, updateProfile
│   └── admin.ts             # Zod schemas: updateRole, deleteUser
└── utils.ts                 # cn() — clsx + tailwind-merge

hooks/
├── use-mobile.ts            # Viewport breakpoint hook (768px)
└── use-role.tsx             # RoleProvider context + useRole() hook

proxy.ts                     # Next.js 16 middleware entry point
```

### Routing Conventions

- **Route groups** `(auth)`, `(dashboard)` for layout separation without URL segments.
- **Protected routes**: The proxy middleware (`proxy.ts` -> `lib/supabase/proxy.ts`) redirects unauthenticated users to `/login` and authenticated users away from auth pages.
- **Admin-only routes**: Use `requireAdmin()` from `lib/supabase/auth.ts` at the top of the page. It redirects non-admins to `/dashboard`.
- **Error boundaries**: Each route group has its own `error.tsx`. The dashboard group also has `not-found.tsx`. A global `not-found.tsx` exists at the app root.
- **Loading states**: Each route group has `loading.tsx`. Individual pages can have their own (e.g., `dashboard/loading.tsx`).
- **New feature routes** go inside `(dashboard)/` with their own `page.tsx`. If a feature needs multiple pages, create a subfolder.

### Auth Flow

```
Request -> proxy.ts -> updateSession() -> supabase.auth.getUser()
  ├── No user + protected route -> redirect /login
  ├── User + auth route -> redirect /dashboard
  └── Otherwise -> continue with refreshed session cookies
```

- **Server actions** in `lib/supabase/actions.ts` handle auth form submissions (login, signup, logout, forgotPassword, resetPassword, updateProfile).
- **Auth callback** at `(auth)/callback/route.ts` exchanges OAuth/magic-link codes for sessions.
- **Password reset flow**: forgot-password -> email link -> callback?next=/reset-password -> reset-password page.
- **User data** flows from server (dashboard layout via `getAuthUser()`) -> AppSidebar -> NavUser via props.

## RBAC & Permissions

### Roles

Three roles with a hierarchy: `admin` (3) > `editor` (2) > `viewer` (1). Defined in `lib/types/roles.ts`.

### Permission Map

| Role | Permissions |
|------|------------|
| admin | manage_users, edit_content, view_content, manage_settings |
| editor | edit_content, view_content |
| viewer | view_content |

### Key Functions

- `hasPermission(role, permission)` — Check if a role has a specific permission.
- `hasRole(role, requiredRole)` — Check if a role meets a minimum role level (hierarchy-based).
- `getAuthUser()` in `lib/supabase/auth.ts` — Fetches the current user with their role from the `profiles` table.
- `requireAdmin()` in `lib/supabase/auth.ts` — Server-side guard that redirects non-admins.

### Client-Side Access

- `RoleProvider` in `hooks/use-role.tsx` — Context provider, mounted in the dashboard layout.
- `useRole()` — Hook to read the current user's role in client components.
- `Can` component in `components/can.tsx` — Declarative permission gate. Works in both server and client components. Accepts `permission` (specific capability) or `requiredRole` (minimum role level).

```tsx
<Can role={user.role} permission="manage_users">
  <AdminPanel />
</Can>

<Can role={user.role} requiredRole="editor" fallback={<ReadOnlyView />}>
  <EditableView />
</Can>
```

### Database Layer

The `profiles` table (`lib/supabase/migrations/001_roles.sql`) extends `auth.users`:
- Auto-creates a profile with `viewer` role on signup (trigger).
- RLS policies: users read own profile, admins read/update all.
- `updated_at` auto-updates via trigger.

## Data Layer

### DataTable

Generic, reusable table component at `components/data-table.tsx` built on TanStack React Table. Features:
- Column sorting (click headers)
- Column filtering (optional `searchKey` prop for text search)
- Client-side pagination with configurable page size (10/20/50)

Usage pattern:
1. Define columns in a colocated `columns.tsx` file using `ColumnDef<T>`.
2. Pass `columns` and `data` to `<DataTable />`.
3. See `components/users-table.tsx` for a full example with inline editing and actions.

### Zod Validation

All form inputs are validated server-side with Zod schemas before any database operation:
- `lib/validations/auth.ts` — loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema
- `lib/validations/admin.ts` — updateRoleSchema, deleteUserSchema

Pattern: `schema.safeParse(data)` -> extract `fieldErrors` from issues -> return to client for display.

### Server Actions Pattern

Server actions follow a consistent structure:

1. **Validate** input with Zod schema (`safeParse`).
2. **Authorize** (check user role if needed via `getAuthUser()`).
3. **Execute** the Supabase query.
4. **Return** `{ error?: string; fieldErrors?: Record<string, string>; success?: string }`.

Auth actions (`lib/supabase/actions.ts`) use `useActionState` binding in forms. Admin actions (`lib/supabase/admin-actions.ts`) are called directly with `FormData` from client components using `useTransition`.

### Toast Notifications

Sonner (`sonner`) is configured in the root layout via `<Toaster richColors />`. Use `toast.success()`, `toast.error()`, `toast.info()` from client components.

## Code Guidelines

### Component Patterns

- **Server Components by default**. Only add `"use client"` when the component needs hooks, event handlers, or browser APIs.
- **Server Actions** (`"use server"`) for all mutations. Forms use `useActionState` to bind actions with loading/error state.
- **Props over context** for data that flows from server to client. Context is reserved for UI state only (sidebar, tooltips, role).
- **Colocation**: Keep page-specific components next to their page (e.g., `columns.tsx`). Shared components go in `components/`.
- **ConfirmDialog** (`components/confirm-dialog.tsx`) for destructive actions. Supports async `onConfirm` with loading state.

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
| Components | PascalCase file + export | `app-sidebar.tsx` -> `AppSidebar` |
| Hooks | `use-` prefix, kebab-case file | `use-mobile.ts` -> `useIsMobile` |
| Server actions | Verb, camelCase | `login`, `signup`, `updateUserRole` |
| Route files | Next.js conventions | `page.tsx`, `layout.tsx`, `route.ts` |
| Types | PascalCase, co-located or in `lib/types/` | `UserRole`, `AuthUser`, `UserRecord` |
| Validations | camelCase + `Schema` suffix, in `lib/validations/` | `loginSchema`, `updateRoleSchema` |

### Styling

- Use `cn()` from `lib/utils` for conditional classes. Never string concatenation.
- Tailwind utility-first. No custom CSS unless extending the design system in `globals.css`.
- Color tokens use CSS variables (`--background`, `--primary`, etc.) -- never hardcode colors.
- `components/ui/` files are generated by shadcn. Do not edit them manually. Use `pnpm shadcn add <component>` to add new ones.

### Biome Rules

- Biome handles both linting and formatting. No ESLint or Prettier needed for application code.
- `components/ui/` has relaxed lint rules (configured in `biome.json` overrides) since those are generated.
- Run `pnpm lint` before committing. Husky pre-commit hook runs lint-staged automatically.

### Supabase Client Usage

- **Server Components / Server Actions / Route Handlers**: Use `createClient()` from `lib/supabase/server.ts`.
- **Client Components**: Use `createClient()` from `lib/supabase/client.ts`.
- **Middleware**: Has its own client in `lib/supabase/proxy.ts` -- do not import server/client there.
- **Auth helpers**: Use `getAuthUser()` from `lib/supabase/auth.ts` to get user + role in server contexts.
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

## Supabase Migrations

SQL migrations live in `lib/supabase/migrations/` with numeric prefixes (`001_`, `002_`, etc.).

To apply a migration, run the SQL against your Supabase project:
- **Supabase Dashboard**: SQL Editor -> paste and run.
- **Supabase CLI**: `supabase db push` or `supabase migration up` if using the CLI migration workflow.

Current migrations:
- `001_roles.sql` — Creates `user_role` enum, `profiles` table with RLS, auto-create profile trigger, auto-update `updated_at` trigger.

When adding a new migration:
1. Create `lib/supabase/migrations/<next_number>_<description>.sql`.
2. Include RLS policies for the new table.
3. Update TypeScript types in `lib/types/` to match the schema.

## Adding a New Feature (Checklist)

1. Create route in `app/(dashboard)/<feature>/page.tsx`.
2. If it needs a layout, add `layout.tsx` in the same folder.
3. Add `loading.tsx` for the loading state if the page fetches data.
4. Shared components go in `components/`, page-specific stay colocated (e.g., `columns.tsx` for table definitions).
5. Define Zod schemas in `lib/validations/<feature>.ts` for any form inputs.
6. Server actions go in `lib/supabase/<feature>-actions.ts`. Follow the validate -> authorize -> execute -> return pattern.
7. If the feature needs a new database table, add a migration in `lib/supabase/migrations/`.
8. If admin-only, guard the page with `requireAdmin()` at the top.
9. If role-gated UI is needed, use the `<Can>` component or `useRole()` hook.
10. Add navigation entry in `components/app-sidebar.tsx` data config.
11. Run `pnpm build` to verify before committing.

## What NOT to Do

- Don't fetch user/auth data client-side -- it's already available via the dashboard layout server component (`getAuthUser()`).
- Don't create API routes (`route.ts`) for mutations -- use server actions instead.
- Don't scatter raw `supabase.from(...)` calls in components -- wrap client-side queries in custom hooks.
- Don't install Prettier or additional ESLint plugins -- Biome handles everything.
- Don't put business logic in `components/ui/` -- those are UI primitives only.
- Don't use `middleware.ts` -- Next.js 16 uses `proxy.ts`.
- Don't bypass `requireAdmin()` for admin pages -- always check server-side, not just UI.
- Don't skip Zod validation in server actions -- validate all input before database queries.
- Don't modify roles/permissions without updating both `lib/types/roles.ts` and the database enum in a new migration.
- Don't call admin actions without checking the user's role server-side -- client-side checks (`Can`, `useRole`) are for UI only, not security.
