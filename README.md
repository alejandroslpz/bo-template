# bo-template

A production-ready backoffice template built with Next.js 16, Supabase, and shadcn/ui. Designed as a scalable foundation for admin panels, dashboards, and internal tools.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Auth & Database**: Supabase (SSR auth, Postgres, RLS, Storage)
- **UI**: shadcn/ui (radix-nova) + Tailwind CSS v4
- **Charts**: Recharts
- **Tables**: TanStack React Table
- **Validation**: Zod
- **i18n**: next-intl (EN/ES)
- **Testing**: Vitest + React Testing Library
- **Linting**: Biome
- **Commits**: Conventional Commits (Commitlint + Husky)

## Features

### Authentication
- Email/password login and signup
- Forgot password and reset password flow
- Session management via middleware
- OAuth ready (commented out, enable when configured)

### Dashboard
- Stat cards with trend indicators
- Revenue and user distribution charts (Recharts)
- Data table with sorting, search, and pagination
- Activity feed with recent actions
- CSV/Excel export from tables

### RBAC (Role-Based Access Control)
- Three roles: Admin, Editor, Viewer
- Permission-based access with `hasPermission()` and `hasRole()`
- `<Can>` component for conditional UI rendering
- `RoleProvider` context for client components
- Admin-only route protection with `requireAdmin()`

### Multi-Tenancy
- Organizations with memberships
- Org switcher in sidebar
- Role per organization (Owner, Admin, Member)
- RLS policies scoped to organization

### User Management (Admin)
- User list with role editing
- Delete users with confirmation dialog
- Role change via dropdown

### Settings
- General: app name, timezone, language
- Appearance: theme toggle (light/dark/system) with visual cards
- Notification preferences with toggles

### Profile
- Edit name, change password
- Avatar upload (Supabase Storage)

### UI/UX
- Dark/light mode with persistence
- Command palette (Cmd+K / Ctrl+K)
- Notifications bell with dropdown
- Dynamic breadcrumbs
- Toast notifications (sonner)
- Loading skeletons
- Error boundaries and 404 pages
- Confirmation dialogs for destructive actions
- Responsive design

### Audit Log
- Action tracking (who did what, when)
- Admin page with data table

### Developer Experience
- Vitest + React Testing Library with example tests
- GitHub Actions CI (lint, build, test)
- Dockerfile with standalone output
- ENV validation with Zod
- Biome for linting and formatting
- Conventional commits enforced

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A Supabase project

### Setup

1. Clone the repository:

```bash
git clone <repo-url> my-backoffice
cd my-backoffice
pnpm install
```

2. Configure environment variables:

```bash
cp .env .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run Supabase migrations (in order, via SQL Editor in your Supabase dashboard):

```
lib/supabase/migrations/001_roles.sql        # Profiles + roles
lib/supabase/migrations/002_storage.sql       # File upload bucket
lib/supabase/migrations/003_audit_log.sql     # Audit log table
lib/supabase/migrations/004_organizations.sql # Multi-tenancy
```

4. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run Biome (lint + format) |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm commit` | Interactive conventional commit |

## Project Structure

```
app/
  (auth)/           # Login, signup, forgot/reset password
  (dashboard)/      # Protected routes with sidebar
    dashboard/      # Main dashboard with charts + tables
    users/          # User management (admin)
    profile/        # User profile
    settings/       # App settings (general, appearance, notifications)
    audit/          # Audit log (admin)

components/
  ui/               # shadcn/ui primitives (don't edit manually)
  charts/           # Recharts components
  *.tsx             # App components (sidebar, forms, tables, etc.)

lib/
  supabase/         # Supabase clients, server actions, migrations
  types/            # TypeScript types (roles, notifications, etc.)
  validations/      # Zod schemas
  i18n/             # Internationalization config
  env.ts            # ENV validation
  utils.ts          # Utilities (cn)
  export.ts         # CSV/Excel export

hooks/              # Custom React hooks
```

## Agent Guidelines

See [AGENTS.md](./AGENTS.md) for coding conventions, architecture decisions, and patterns used in this project. Claude Code reads [CLAUDE.md](./CLAUDE.md) which references AGENTS.md.

## License

MIT
