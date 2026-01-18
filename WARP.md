# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is PEMD360, a SvelteKit fullstack web application for managing construction projects (PEMD - Plan d'Évacuation des Matériaux et Déchets). The application tracks waste management, environmental diagnostics (termites, asbestos, lead), and project information for construction sites in France.

## Technology Stack

- **Framework**: SvelteKit 5 with TypeScript
- **Styling**: TailwindCSS 4 + DaisyUI 5
- **Database**: SQLite (local) / Cloudflare D1 (production) with Drizzle ORM
- **Authentication**: Better Auth with email/password and admin plugin
- **File Storage**: Cloudflare R2 (S3-compatible) via AWS SDK
- **Deployment**: Cloudflare Pages (adapter-cloudflare)
- **3D Viewer**: Matterport SDK integration

## Development Commands

### Setup
```bash
npm install
```

Copy `.env.example` to `.env` and fill required fields:
- `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` from Cloudflare R2
- `BETTER_AUTH_SECRET` (generate a secure random string)
- `BETTER_AUTH_URL` (e.g., `http://localhost:5173`)
- `DATABASE_URL` (defaults to `./betterauth_pemd.sqlite`)
- `S3_API_URL` (Cloudflare R2 endpoint)
- `MATTERPORT_SDK_KEY` (optional)

### Development
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run prepare       # Sync SvelteKit types
```

### Code Quality
```bash
npm run check         # Type-check with svelte-check
npm run check:watch   # Type-check in watch mode
npm run lint          # Run ESLint + Prettier checks
npm run format        # Format code with Prettier
```

### Database
```bash
npx drizzle-kit generate      # Generate migrations from schema
npx drizzle-kit migrate       # Run migrations
npx drizzle-kit push          # Push schema changes directly (dev only)
npx drizzle-kit studio        # Open Drizzle Studio (database GUI)
```

## Architecture

### Directory Structure

```
src/
├── lib/
│   ├── auth.ts                    # Better Auth configuration
│   ├── auth-client.ts             # Client-side auth utilities
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts          # Drizzle ORM schema (all tables)
│   │   │   ├── client.ts          # Database client
│   │   │   └── functions.ts       # Database helper functions
│   │   ├── s3/
│   │   │   ├── client.ts          # S3 client configuration
│   │   │   └── functionsS3.ts     # S3 operations
│   │   ├── admin.ts               # Admin utility functions (Better Auth)
│   │   └── excel.ts               # Excel export utilities
│   ├── components/                # Reusable Svelte components
│   ├── stores/                    # Svelte stores
│   └── assets/
├── routes/
│   ├── (landing)/                 # Public landing pages (unauth)
│   ├── (app)/app/                 # Protected app routes
│   │   ├── projets/               # Projects list and detail pages
│   │   ├── tableau-synthese/      # Summary tables
│   │   └── admin/                 # Admin-only routes
│   │       ├── projets/           # Admin project management
│   │       ├── societes/          # Company management
│   │       ├── objets/            # Objects/materials catalog
│   │       ├── termites/          # Termite diagnostics
│   │       ├── plomb/             # Lead diagnostics
│   │       └── ...                # Other admin sections
│   ├── +layout.server.ts          # Root layout server load
│   ├── +layout.svelte             # Root layout
│   └── +error.svelte              # Error page
├── hooks.server.ts                # Server hooks (auth, redirects)
└── app.d.ts                       # TypeScript app types
```

### Database Schema

The schema is defined in `src/lib/server/db/schema.ts` and uses Drizzle ORM. Key tables include:

**Auth tables** (Better Auth):
- `user`, `session`, `account`, `verification`

**Core entities**:
- `projet` - Construction projects
- `societe` - Companies
- `etablissement` - Company establishments (branches)
- `userProjet` - Many-to-many relation between users and projects

**Catalog/reference data**:
- `groupe` → `categorieV2` → `objets` - Material hierarchy
- `natureV2` - Waste/material nature (recyclability, density, etc.)

**Diagnostics**:
- `plomb` - Lead diagnostics
- `termite` - Termite diagnostics
- Tables for various CERFA forms and regulatory compliance

All tables use camelCase for TypeScript but snake_case in the actual database.

### Authentication & Authorization

**Implementation**: Better Auth with Drizzle adapter
- Email/password authentication
- Session-based with cookies (SvelteKit integration)
- Admin plugin enabled for user management

**Route protection** (in `hooks.server.ts`):
- `/app/*` routes require authentication
- `/app/admin/*` routes require `role === 'admin'` (verify in page server load)
- Unauthenticated users redirect to `/login`
- Authenticated users at `/login` or `/signup` redirect to `/app/projets`

**User roles**:
- `admin` - Full access to all projects and admin panel
- `user` - Access only to assigned projects via `userProjet` table

**Access patterns**:
```typescript
// In +page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;  // User object with role
  const session = locals.session;  // Session object
  
  // Check admin
  if (user?.role !== 'admin') {
    throw redirect(303, '/app/projets');
  }
};
```

### File Storage (Cloudflare R2)

S3-compatible storage accessed via AWS SDK v3. Configuration in `src/lib/server/s3/client.ts`:
- Credentials from env vars
- Functions in `functionsS3.ts`

### SvelteKit Patterns

**Route groups**: `(app)` and `(landing)` for layout isolation
**Load functions**: Use `+page.server.ts` for server-side data loading
**Form actions**: Use `+page.server.ts` for mutations (create/update/delete)
**Type safety**: Import types from `./$types` (auto-generated)

Example:
```typescript
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  // Load data
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // Handle form submission
  }
};
```

### Database Queries

Always use Drizzle ORM:
```typescript
import { db } from '$lib/server/db/client';
import { projet, etablissement } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Join with relations
const result = await db.select()
  .from(projet)
  .leftJoin(etablissement, eq(projet.idEtabId, etablissement.id))
  .where(eq(projet.id, projetId));
```

**Key patterns**:
- Use Drizzle relations for type-safe joins
- Always filter by `userId` via `userProjet` for non-admin users
- Admin users access all data directly

## Important Conventions

### Environment Variables
Never hardcode secrets. All sensitive values must be in `.env` (gitignored). Reference `.env.example` for required variables.

### Database Migrations
When modifying `schema.ts`:
1. Run `npx drizzle-kit generate` to create migration
2. Review migration SQL in `drizzle/` directory
3. Run `npx drizzle-kit migrate` to apply
4. For production (Cloudflare D1), migrations are in `wrangler.json` config

### Code Style
- Use Prettier for formatting (config in `.prettierrc`)
- ESLint config includes Svelte + TypeScript rules
- TypeScript strict mode enabled
- Use `$lib` alias for imports from `src/lib/`

### Authentication in API Routes
For server endpoints (`+server.ts`), always verify session:
```typescript
import { auth } from '$lib/auth';

export async function GET({ request }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ... handle request
}
```

### Admin Operations
Use wrapper functions from `$lib/server/admin.ts` instead of calling `auth.api` directly. These handle headers and provide better type safety.

## Deployment

Target platform: Cloudflare Pages
- Adapter: `@sveltejs/adapter-cloudflare`
- Config: `wrangler.json` for D1 database binding
- R2 storage must be configured via Cloudflare dashboard

Build output uses Cloudflare Workers runtime with Node.js compatibility enabled.

## Testing

No test framework is currently configured. When adding tests, consider:
- Vitest (recommended for SvelteKit)
- Playwright for E2E tests
- Testing Library for Svelte components
