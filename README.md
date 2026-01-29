# Interview Pass – NexusJS Migration

Modern recruitment portal built with Next.js, TypeScript, and a monorepo architecture. Migrating from Google Apps Script to a scalable, maintainable system.

> 🚀 **Phase 1 MVP**: Home page, Login placeholder, Dashboard with mock data, Interview details page. See [docs/MIGRATION.md](docs/MIGRATION.md) for roadmap.

---

## Quick Start

### Prerequisites
- **Node.js** 20+ and **pnpm** 8+ ([install pnpm](https://pnpm.io/installation))
- **Git**

### Clone & Setup

```bash
# Clone this repo
git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
cd Interview-Pass-NexusJS

# Install dependencies (all workspaces)
pnpm install

# Copy environment template
cp .env.example .env.local

# (Optional) Re-import legacy codebase snapshot
# Already in /legacy/interview-pass-old. To refresh:
# git clone https://github.com/crewlife-hub/Interview-Pass.git legacy/interview-pass-old
```

### Run Dev Server

```bash
# Start all apps in development
pnpm dev

# Or run individual apps:
pnpm --filter @interview-pass/web dev
pnpm --filter @interview-pass/api dev
```

**Web UI:** http://localhost:3000  
**API:** http://localhost:3001 (scaffold only, Phase 2+)

### Build & Check

```bash
# Lint all packages
pnpm lint

# Type check
pnpm typecheck

# Build all packages
pnpm build

# Run tests
pnpm test
```

---

## Repository Structure

```
Interview-Pass-NexusJS/
├── apps/
│   ├── web/              Next.js frontend (App Router)
│   └── api/              API routes (Phase 2+)
├── packages/
│   ├── shared/           Types, config, utilities
│   ├── ui/               Reusable Tailwind components
│   └── legacy-adapter/   Bridge to old/mock data
├── legacy/
│   └── interview-pass-old/  Original Google Apps Script (read-only)
├── docs/
│   ├── MIGRATION.md      Phase-by-phase roadmap
│   └── legacy-inventory.md  Old codebase summary
├── .env.example          Environment variables
├── pnpm-workspace.yaml   Workspace config
├── turbo.json            Build orchestration
└── tsconfig.json         TypeScript base config
```

---

## What's Included (Phase 1 MVP)

### Pages
- **`/`** – Home landing page
- **`/login`** – Login placeholder (real auth in Phase 2)
- **`/dashboard`** – Upcoming interviews list (mock data)
- **`/interview/[id]`** – Interview details + actions

### Packages
| Package | Purpose |
|---------|---------|
| `@interview-pass/shared` | Types (User, Interview, LogEntry), config validation, utilities |
| `@interview-pass/ui` | Button, Card, PageShell components |
| `@interview-pass/legacy-adapter` | MockLegacyAdapter with interview service |
| `@interview-pass/web` | Next.js app with MVP pages |

### Architecture
- **TypeScript 5.3+** – Strict mode, project references
- **Next.js 14** – App Router, Tailwind CSS
- **Turborepo** – Monorepo orchestration
- **pnpm** – Workspaces, fast installs
- **Zod** – Runtime config validation
- **ESLint + Prettier** – Code quality

---

## Development Workflow

### Add a New Feature

1. **Create a page** (e.g., `/interview/[id]/checklist`):
   ```bash
   touch apps/web/app/interview/\[id\]/checklist/page.tsx
   ```

2. **Use shared types**:
   ```typescript
   import { Interview, formatDateTime } from '@interview-pass/shared';
   ```

3. **Use shared UI components**:
   ```typescript
   import { Button, Card } from '@interview-pass/ui';
   ```

4. **Fetch from adapter**:
   ```typescript
   import { createLegacyAdapter } from '@interview-pass/legacy-adapter';
   
   const adapter = createLegacyAdapter();
   const interview = await adapter.getInterviewDetails(id);
   ```

5. **Commit & push**:
   ```bash
   git add .
   git commit -m "feat: add interview checklist page"
   git push
   ```

### Update Types

1. Edit `packages/shared/src/types.ts`
2. Run `pnpm typecheck` to validate
3. All packages auto-pick up new types

### Add a Shared Util

1. Add function to `packages/shared/src/utils.ts`
2. Export from `packages/shared/src/index.ts`
3. Use anywhere: `import { myUtil } from '@interview-pass/shared'`

---

## Migration Phases

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **1** | Now | MVP (home, dashboard, mock data) | ✅ Complete |
| **2** | 2-3 days | Google OAuth, real Calendar API | 🚧 Next |
| **3** | 3-4 days | Smartsheet integration | 📅 Planned |
| **4** | 3-5 days | Interactive checklist, transcripts | 📅 Planned |
| **5+** | 1-2 weeks | Analytics, AI assist, advanced | 📅 Planned |

See [docs/MIGRATION.md](docs/MIGRATION.md) for detailed roadmap.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
# Google OAuth (Phase 2+)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Google Calendar (Phase 2+)
GOOGLE_CALENDAR_ID=your_calendar_id
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_api_key

# Smartsheet (Phase 3+)
SMARTSHEET_API_TOKEN=your_token

# App URLs
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WEB_BASE_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
NODE_ENV=development
```

**Never commit secrets.** Use `.env.local` (gitignored) for development.

---

## Testing

### Unit Tests (Phase 2+)
```bash
pnpm test
```

### Type Checking
```bash
pnpm typecheck
```

### Linting
```bash
pnpm lint
```

### Manual Testing (Dev Server)
1. Run `pnpm dev`
2. Open http://localhost:3000
3. Click through pages
4. Check browser console for errors

---

## Deployment

### Build & Deploy to Vercel

```bash
# Build all packages
pnpm build

# Deploy (Vercel auto-detects Next.js)
vercel deploy
```

### Environment Secrets

Set secrets in Vercel dashboard:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALENDAR_ID`
- etc.

See [docs/MIGRATION.md](docs/MIGRATION.md) → "Deployment" for details.

---

## Troubleshooting

### "Module not found" errors

```bash
# Ensure all packages installed
pnpm install

# Clear cache & rebuild
pnpm clean
pnpm build
```

### Type errors in IDE

Reload VSCode: `Cmd+Shift+P` → "Reload Window"

### Port 3000 already in use

```bash
# Kill process using port
lsof -i :3000  # Find PID
kill -9 <PID>

# Or use different port
pnpm --filter @interview-pass/web dev -- -p 3001
```

### Legacy adapter returns no data

Check that `/legacy/interview-pass-old/` exists. If not:

```bash
git clone https://github.com/crewlife-hub/Interview-Pass.git legacy/interview-pass-old
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/MIGRATION.md](docs/MIGRATION.md) | Phase-by-phase roadmap, architecture, setup |
| [docs/legacy-inventory.md](docs/legacy-inventory.md) | Old codebase summary (13 .gs files) |
| [README.md](README.md) | This file |

---

## Key Technologies

- **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend**: Node.js, Next.js API routes (extendable)
- **Packages**: Zod (validation), custom UI components
- **Tooling**: Turborepo, pnpm, TypeScript, ESLint, Prettier
- **External APIs**: Google OAuth, Calendar, Sheets, Smartsheet (Phase 3)

---

## Code Standards

- **Always TypeScript** – strict mode enabled
- **No `any` types** – use generics or proper typing
- **Input validation** – use Zod schemas
- **Clear naming** – functions, variables should be self-documenting
- **Comments** – for non-obvious logic only
- **Error handling** – always provide helpful messages
- **Logging** – use structured logs with requestId

---

## Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make changes following code standards above
3. Test: `pnpm typecheck && pnpm lint && pnpm build`
4. Commit with clear message: `git commit -m "feat: add my feature"`
5. Push & open a PR: `git push origin feat/my-feature`

---

## FAQ

**Q: Can I run just the web app?**  
A: Yes, `pnpm --filter @interview-pass/web dev`

**Q: How do I add a new package?**  
A: Create a folder in `packages/`, add `package.json` and `tsconfig.json`, then `pnpm install`. Turbo auto-detects it.

**Q: Is the legacy code required?**  
A: No. `/legacy/interview-pass-old/` is read-only reference. New features use the NexusJS monorepo.

**Q: When does Google OAuth get added?**  
A: Phase 2 (in 2-3 days). For now, demo mode uses mock auth.

**Q: Where's the database?**  
A: Phase 1 uses mock data. Phase 2+ will wire real Google Calendar & Smartsheet. A SQL database (PostgreSQL) may be added later if needed.

---

## Support

- Check [docs/MIGRATION.md](docs/MIGRATION.md) for detailed design decisions
- Review [docs/legacy-inventory.md](docs/legacy-inventory.md) for old system details
- Open an issue on GitHub for bugs or questions

---

## License

Proprietary – Crew Life at Sea

---

**Version:** 0.1.0 (Phase 1 MVP)  
**Last Updated:** January 19, 2026  
**Status:** ✅ Ready for local testing
