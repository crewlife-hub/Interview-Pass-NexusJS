# Interview Pass NexusJS Migration

## Overview

Interview Pass is migrating from a **Google Apps Script** monolithic system to a modern **NexusJS-style monorepo** using Next.js, TypeScript, and structured packages.

This document outlines the migration strategy using a **Strangler Fig** approach: we keep the legacy system intact while gradually replacing features with new implementations.

---

## Architecture

```
Interview-Pass-NexusJS/
├── apps/
│   ├── web/           (Next.js frontend - App Router)
│   └── api/           (Next.js API routes or standalone Node server)
├── packages/
│   ├── shared/        (Shared types, config, utilities)
│   ├── ui/            (Reusable UI components with Tailwind)
│   └── legacy-adapter/ (Bridge to legacy Apps Script)
├── legacy/
│   └── interview-pass-old/ (Original Apps Script code - read-only snapshot)
└── docs/              (Architecture, setup, runbooks)
```

---

## Migration Phases

### Phase 1: MVP Foundation (Current) ✅

**Goals:**
- Set up monorepo structure with Turborepo + pnpm
- Create TypeScript shared packages (types, config, utils)
- Wire up minimal UI with Next.js App Router
- Create legacy adapter with mock interview service
- Run home, login placeholder, dashboard (mock data), and interview details pages
- Set up CI/CD scaffolding

**What's Done:**
- ✅ Monorepo initialized with pnpm workspaces
- ✅ Root-level tsconfig with project references
- ✅ Packages: `@shared` (types, config), `@ui` (Button, Card, PageShell), `@legacy-adapter` (mock adapter)
- ✅ Apps/web: Pages (home, login, dashboard, interview/[id])
- ✅ Environment config with zod validation
- ✅ .env.example with all expected vars

**What's Next (Phase 2):**
- Implement Google OAuth authentication
- Wire real Google Calendar API reads in the adapter
- Build out interview checklist UI + backend

---

### Phase 2: Authentication & Real Calendar (2-3 days)

**Goals:**
- Implement Google OAuth login/logout
- Replace mock adapter with real Google Calendar reads
- Save session to secure HTTP-only cookies
- Add request ID logging

**Key Files to Create/Update:**
- `apps/api/app/api/auth/route.ts` – OAuth flow
- `packages/legacy-adapter/src/google-calendar.ts` – Real Calendar API
- `packages/shared/src/auth.ts` – Session management
- `apps/web/app/api/auth/[...nextauth]/route.ts` – NextAuth integration (optional)

---

### Phase 3: Smartsheet Integration (3-4 days)

**Goals:**
- Read/write candidate data from Smartsheet
- Sync with Google Calendar
- Basic CRUD operations for candidates

**Key Files:**
- `packages/legacy-adapter/src/smartsheet.ts` – Smartsheet API wrapper
- `apps/api/app/api/candidates/route.ts` – Candidate endpoints

---

### Phase 4: Interactive Checklist & Transcripts (3-5 days)

**Goals:**
- Build interview checklist with real-time updates
- Transcript capture (audio/text notes)
- Email transcript to candidate

**Key Files:**
- `apps/web/app/interview/[id]/checklist/page.tsx` – Checklist UI
- `apps/api/app/api/interviews/[id]/checklist/route.ts` – Checklist backend
- `packages/shared/src/transcript.ts` – Transcript utilities

---

### Phase 5+: Advanced Features

- AI-assisted interview notes
- Multi-brand dashboards
- KPI tracking & analytics
- Candidate follow-up workflows

---

## Strangler Fig Strategy

### How It Works

1. **Request arrives at new NexusJS system** (apps/web)
2. **Adapter layer decides**: use real implementation OR call legacy Apps Script
3. **Gradual replacement**: feature by feature, we build real implementations and disable legacy calls
4. **Full migration**: eventually, legacy folder is removed entirely

### Current Implementation (Phase 1)

```
Interview Page
    ↓
Legacy Adapter (MockLegacyAdapter)
    ↓
Returns mock interview data
```

### Phase 2+ Implementation

```
Interview Page
    ↓
Legacy Adapter (GoogleCalendarAdapter)
    ↓
Calls Google Calendar API via OAuth token
    ↓
Returns real data OR falls back to mock if unavailable
```

### Fallback Strategy

If a feature isn't ready, we have two fallback options:

1. **Mock data** (current phase 1)
2. **Bridge to Apps Script** (optional, if real implementation blocked)
   - Call deployed Apps Script endpoint with a shared secret
   - Useful for: transcript reading, email sending, Smartsheet operations

---

## Key Technologies

### Frontend (apps/web)
- **Next.js 14+** (App Router)
- **React 18**
- **Tailwind CSS** (styling)
- **TypeScript 5.3+** (strict mode)

### Backend (apps/api)
- **Next.js API Routes** (lightweight)
- OR: **Standalone Node/Express** (if needed for complex logic)
- **TypeScript** with request validation

### Shared Packages
- **zod** – Runtime config validation
- **@interview-pass/shared** – Types, utilities
- **@interview-pass/ui** – Reusable components
- **@interview-pass/legacy-adapter** – Bridge to legacy/mock

### Build & Dev Tools
- **Turborepo** – Monorepo orchestration
- **pnpm** – Package manager (fast, disk-efficient)
- **TypeScript** – Strict type safety
- **ESLint** – Code linting
- **Prettier** – Code formatting

### External APIs
- **Google OAuth 2.0** – Authentication
- **Google Calendar API** – Interview scheduling
- **Google Meet** – Video conferencing links
- **Smartsheet API** – Candidate data (future)
- **Gmail API** – Email sending (future)

---

## Local Setup

### Prerequisites
- Node.js 20+ and pnpm 8+
- Git
- Google OAuth credentials (Phase 2+)
- Smartsheet API token (Phase 3+)

### Clone & Install

```bash
# Clone the new NexusJS repo
git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
cd Interview-Pass-NexusJS

# Install dependencies
pnpm install

# Copy the legacy old repo (optional, already in /legacy)
# If needed, re-sync: git clone https://github.com/crewlife-hub/Interview-Pass.git legacy/interview-pass-old
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env.local

# Fill in values (or leave blank for Phase 1 MVP with mock data)
# GOOGLE_CLIENT_ID=xxx
# GOOGLE_CLIENT_SECRET=xxx
# SMARTSHEET_API_TOKEN=xxx
```

### Run Dev Server

```bash
# From root:
pnpm dev

# or run individual apps:
pnpm --filter @interview-pass/web dev
pnpm --filter @interview-pass/api dev
```

**Web app:** http://localhost:3000
**API:** http://localhost:3001

### Build & Test

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Build all packages
pnpm build

# Run tests (scaffold added, tests TBD)
pnpm test
```

---

## Commit Strategy

Commits should be organized by feature and phase:

```bash
# Initial setup
git commit -m "chore: initialize NexusJS monorepo structure"
git commit -m "chore: add legacy Interview Pass snapshot"

# Phase 1
git commit -m "feat: add shared types, config, and utilities"
git commit -m "feat: add UI component library (Button, Card, PageShell)"
git commit -m "feat: add legacy adapter with mock interview service"
git commit -m "feat: implement MVP pages (home, dashboard, interview details)"
git commit -m "feat: add next.js web app scaffolding"
git commit -m "docs: add MIGRATION.md and legacy-inventory.md"
git commit -m "chore: add CI workflow for lint, typecheck, build"

# Phase 2 onward
git commit -m "feat: integrate Google OAuth authentication"
git commit -m "feat: wire real Google Calendar API in adapter"
git commit -m "feat: add request ID logging and structured logging"
# ... etc
```

---

## File Structure Overview

```
apps/web/
├── app/
│   ├── page.tsx                  (Home)
│   ├── layout.tsx                (Root layout)
│   ├── globals.css               (Tailwind styles)
│   ├── login/page.tsx            (Login placeholder)
│   ├── dashboard/page.tsx        (Upcoming interviews + stats)
│   └── interview/[id]/page.tsx   (Interview details)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js

apps/api/
├── app/api/
│   ├── health/route.ts           (Health check)
│   ├── interviews/route.ts       (Mock interview list)
│   └── auth/[...nextauth]/route.ts (OAuth - Phase 2)
└── ... (TBD based on needs)

packages/shared/src/
├── types.ts                      (User, Interview, LogEntry, etc.)
├── config.ts                     (Zod env validation)
├── utils.ts                      (formatDate, getDurationText, etc.)
└── index.ts                      (Re-exports)

packages/ui/src/
├── Button.tsx
├── Card.tsx
├── PageShell.tsx
└── index.ts

packages/legacy-adapter/src/
├── adapter.ts                    (ILegacyAdapter interface + mock impl)
├── google-calendar.ts            (Real Calendar API - Phase 2)
├── smartsheet.ts                 (Smartsheet wrapper - Phase 3)
└── index.ts

legacy/interview-pass-old/        (Original Apps Script repo - read-only)
├── src/                          (13 .gs files)
├── Config/
├── API/
└── ... (all original structure)

docs/
├── MIGRATION.md                  (This file)
├── legacy-inventory.md           (Summary of old codebase)
├── ARCHITECTURE.md               (High-level diagrams)
└── RUNBOOK.md                    (Deployment & operations)
```

---

## Troubleshooting

### "Module not found" errors

**Problem:** Can't import from `@shared`, `@ui`, `@legacy-adapter`.

**Solution:**
1. Ensure all workspace packages are installed: `pnpm install`
2. Check tsconfig paths are correct
3. Verify build order: `pnpm build` (Turborepo respects dependencies)

### Type errors in IDE

**Problem:** VSCode shows type errors even though `pnpm build` works.

**Solution:**
1. Reload VSCode window: Cmd+Shift+P → "Reload Window"
2. Ensure workspace TypeScript version matches: `pnpm ls typescript`

### OAuth/API errors in Phase 2

**Problem:** "Invalid client ID" or "Unauthorized" errors.

**Solution:**
1. Check `.env.local` has correct Google OAuth credentials
2. Ensure Google Calendar API is enabled in GCP project
3. Verify redirect URLs match OAuth app settings

---

## Code Guidelines

- **Always use TypeScript** – strict mode enabled
- **No `any` types** – use generics or union types instead
- **Validate external input** – use zod schemas
- **Structure logging** – include requestId, userId, timestamp
- **Clear error messages** – help users understand what went wrong
- **Test critical paths** – auth, data fetch, calculations

---

## Next Steps

1. **Phase 1**: Run `pnpm dev` → test home, dashboard, interview pages with mock data
2. **Phase 2**: Implement Google OAuth → wire real Calendar API
3. **Phase 3**: Add Smartsheet reads → sync candidate data
4. **Phase 4**: Build checklist UI → save interview notes
5. **Phase 5+**: Analytics, advanced features

---

## Contact & Questions

For questions about the migration:
- Check `docs/legacy-inventory.md` for old system details
- Review `docs/ARCHITECTURE.md` for system design
- See `CONTRIBUTING.md` (coming Phase 2+) for dev guidelines

---

**Last Updated:** January 19, 2026
**Phase:** 1 (MVP Foundation)
**Status:** Ready for local testing
