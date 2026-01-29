# Interview Pass NexusJS – Complete Setup Guide

## ✅ Status: Phase 1 MVP Complete

The Interview Pass NexusJS monorepo has been **fully scaffolded with:**
- ✅ Monorepo structure (pnpm workspaces + Turborepo)
- ✅ Shared packages (types, config, UI, legacy adapter)
- ✅ Next.js web app with MVP pages (home, dashboard, interview details)
- ✅ Mock interview service via legacy adapter
- ✅ Full documentation (MIGRATION.md, legacy-inventory.md)
- ✅ CI workflow (lint, typecheck, build)
- ✅ Legacy snapshot in `/legacy/` (Google Apps Script original)

---

## Quick Setup (Copy-Paste)

### Option A: Bash/Mac/Linux
```bash
# Clone the repo
git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
cd Interview-Pass-NexusJS

# Run setup script
bash setup.sh
```

### Option B: PowerShell (Windows)
```powershell
# Clone the repo
git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
cd Interview-Pass-NexusJS

# Run setup script
.\setup.ps1
```

### Option C: Manual Setup
```bash
# 1. Clone
git clone https://github.com/crewlife-hub/Interview-Pass-NexusJS.git
cd Interview-Pass-NexusJS

# 2. Install Node 20+ and pnpm 8+ if not already installed
# https://nodejs.org/
# npm install -g pnpm

# 3. Install dependencies
pnpm install

# 4. Copy env template
cp .env.example .env.local
# Edit .env.local with your credentials (optional for Phase 1 MVP)

# 5. Start dev server
pnpm dev

# 6. Open browser
# http://localhost:3000
```

---

## Verify Installation

Run these commands in the Interview-Pass-NexusJS directory:

```bash
# Verify all packages installed
pnpm list --recursive

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Build all packages
pnpm build
```

All should complete without errors.

---

## Running the App

### Start Dev Server
```bash
pnpm dev
```

This runs all apps in development mode:
- **Web UI**: http://localhost:3000
- **API**: http://localhost:3001 (scaffold only)

### Run Just the Web App
```bash
pnpm --filter @interview-pass/web dev
```

### Run Just the API (Phase 2+)
```bash
pnpm --filter @interview-pass/api dev
```

---

## Pages & Features (Phase 1)

| URL | Page | Status |
|-----|------|--------|
| `/` | Home landing page | ✅ Ready |
| `/login` | Login placeholder | ✅ Ready (real auth Phase 2) |
| `/dashboard` | Upcoming interviews list | ✅ Ready (mock data) |
| `/interview/:id` | Interview details + actions | ✅ Ready |

**Note:** All data is currently **mock data**. Real Google Calendar integration comes in Phase 2.

---

## Project Structure

```
Interview-Pass-NexusJS/
├── apps/
│   ├── web/               # Next.js frontend (App Router)
│   └── api/               # Node API routes (Phase 2+)
│
├── packages/
│   ├── shared/            # Types, config, utilities
│   ├── ui/                # Reusable components (Button, Card, PageShell)
│   └── legacy-adapter/    # Mock interview service
│
├── legacy/
│   └── interview-pass-old/ # Original Google Apps Script (read-only snapshot)
│
├── docs/
│   ├── MIGRATION.md       # Phase-by-phase roadmap
│   └── legacy-inventory.md # Old codebase details
│
├── README.md              # Overview & quick start
├── .env.example           # Environment variables template
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # pnpm workspace definition
├── turbo.json             # Turborepo config
└── tsconfig.json          # TypeScript base config
```

---

## Development Workflow

### Create a New Page

```bash
# 1. Create file
touch apps/web/app/mycoolpage/page.tsx

# 2. Import and use types, components, adapter
# apps/web/app/mycoolpage/page.tsx
```

Example:
```tsx
'use client';
import { Button, Card } from '@interview-pass/ui';
import { formatDateTime } from '@interview-pass/shared';
import { createLegacyAdapter } from '@interview-pass/legacy-adapter';

export default function MyPage() {
  // Your component code here
}
```

### Update Shared Types

1. Edit `packages/shared/src/types.ts`
2. Run `pnpm typecheck` to validate
3. Use in any package: `import { MyType } from '@interview-pass/shared'`

### Add a New Shared Component

1. Create file in `packages/ui/src/MyComponent.tsx`
2. Export from `packages/ui/src/index.ts`
3. Use anywhere: `import { MyComponent } from '@interview-pass/ui'`

---

## Environment Variables

Copy `.env.example` → `.env.local` and fill in values:

```bash
# Phase 2+ (Google OAuth)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Phase 2+ (Google Calendar)
GOOGLE_CALENDAR_ID=xxx
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=xxx

# Phase 3+ (Smartsheet)
SMARTSHEET_API_TOKEN=xxx

# App URLs (development defaults are fine)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WEB_BASE_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
NODE_ENV=development
```

**Important:** Never commit secrets. Use `.env.local` (gitignored).

---

## Testing & Quality

```bash
# Type check (no build, fast)
pnpm typecheck

# Lint (ESLint)
pnpm lint

# Fix lint issues automatically
pnpm lint -- --fix

# Build all packages
pnpm build

# Run tests (scaffold added, TBD)
pnpm test
```

---

## Commits & Git

Make clear commits organized by feature:

```bash
# Example commits
git commit -m "feat: add interview notes capture page"
git commit -m "fix: format date correctly in dashboard"
git commit -m "docs: add setup instructions"
git commit -m "chore: upgrade dependencies"
```

Push to GitHub:
```bash
git push origin main
```

---

## FAQ

### Q: My IDE shows type errors even though `pnpm build` works

**A:** Reload your IDE:
- **VSCode**: Cmd+Shift+P → "Reload Window"
- **Other**: Close and reopen the project folder

### Q: Port 3000 already in use

**A:**
```bash
# Kill the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
pnpm --filter @interview-pass/web dev -- -p 3005
```

### Q: How do I access the Google Apps Script legacy code?

**A:** It's in `/legacy/interview-pass-old/`. See [docs/legacy-inventory.md](docs/legacy-inventory.md) for details.

### Q: When does real authentication work?

**A:** Phase 2 (2-3 days). For now, the login page is a placeholder; use the dashboard demo.

### Q: Can I run just the web app without the API?

**A:** Yes: `pnpm --filter @interview-pass/web dev`

### Q: What's the difference between this and the old Apps Script?

**A:** See [docs/MIGRATION.md](docs/MIGRATION.md) for full roadmap. TL;DR:
- Old: Google Apps Script (serverless, limited features)
- New: Next.js monorepo (scalable, type-safe, production-ready)

---

## Troubleshooting

### Issue: "Cannot find module '@interview-pass/shared'"

**Solution:**
```bash
# Ensure all packages installed
pnpm install

# Clear cache and rebuild
pnpm clean
pnpm install
pnpm build
```

### Issue: "pnpm: command not found"

**Solution:**
```bash
npm install -g pnpm
pnpm --version  # Should show version 8+
```

### Issue: "Module not found: CalendarAPI"

**Solution:** This is from the old Google Apps Script API. The new system doesn't use it directly.
- See `packages/legacy-adapter/src/adapter.ts` for the new interface
- Use `createLegacyAdapter()` to get the mock service

### Issue: Tailwind styles not showing

**Solution:**
```bash
# Rebuild Tailwind
pnpm --filter @interview-pass/web dev

# Check that tailwind.config.js has correct content paths
# It should include: './app/**/*.{js,ts,jsx,tsx}'
```

### Issue: Git commit fails with "Author identity unknown"

**Solution:**
```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
git commit -m "message"
```

---

## Next Steps

### Phase 1 MVP (Done ✅)
- ✅ Monorepo scaffold
- ✅ Shared types & config
- ✅ UI components
- ✅ MVP pages with mock data

### Phase 2 (Next: 2-3 days)
- [ ] Google OAuth authentication
- [ ] Real Google Calendar API integration
- [ ] Session management

### Phase 3 (After Phase 2: 3-4 days)
- [ ] Smartsheet integration (candidate data)
- [ ] Database setup (optional)

### Phase 4 (After Phase 3: 3-5 days)
- [ ] Interactive checklist UI
- [ ] Transcript capture
- [ ] Email sending

### Phase 5+ (Advanced)
- [ ] Analytics & KPI dashboard
- [ ] AI-assisted interview notes
- [ ] SMS notifications
- [ ] Mobile app

See [docs/MIGRATION.md](docs/MIGRATION.md) for detailed roadmap.

---

## Support & Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview & quick start |
| [docs/MIGRATION.md](docs/MIGRATION.md) | Phase-by-phase roadmap & architecture |
| [docs/legacy-inventory.md](docs/legacy-inventory.md) | Old Google Apps Script codebase details |
| [legacy/README.md](legacy/README.md) | Legacy snapshot info |

---

## Key Technologies Used

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, TypeScript |
| **Backend** | Node.js, Next.js API Routes |
| **Packages** | Zod (validation), custom UI components |
| **Build** | Turborepo, pnpm, TypeScript |
| **External APIs** | Google OAuth, Calendar, Sheets, Smartsheet (Phase 3) |

---

## Commands Cheat Sheet

```bash
# Install & build
pnpm install
pnpm build

# Development
pnpm dev
pnpm lint
pnpm typecheck
pnpm test

# Individual apps
pnpm --filter @interview-pass/web dev
pnpm --filter @interview-pass/api dev

# Run specific script
pnpm --filter @interview-pass/shared run typecheck

# Clean up
pnpm clean

# Git
git add .
git commit -m "message"
git push origin main
```

---

## Deployment (Phase 2+)

When ready to deploy to production:

```bash
# Build all packages
pnpm build

# Deploy to Vercel (recommended for Next.js)
npm i -g vercel
vercel

# Or manual Docker deployment
docker build -t interview-pass:latest .
docker run -p 3000:3000 interview-pass:latest
```

---

**Setup Complete!** 🎉

You now have a fully functional Interview Pass NexusJS development environment.

**Start here:** `pnpm dev` → http://localhost:3000

Questions? Check [docs/MIGRATION.md](docs/MIGRATION.md) or [README.md](README.md).
