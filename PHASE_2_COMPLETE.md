# 🔐 Phase 2 Implementation Complete

**Date:** January 19, 2026  
**Status:** ✅ Ready for Configuration  
**Commit:** 549b706  
**Next Steps:** Obtain Google OAuth credentials → Update `.env.local` → Test locally

---

## What's Been Implemented

### 1. NextAuth.js Framework
**File:** `apps/web/app/api/auth/[...nextauth]/route.ts`

```typescript
✅ NextAuth configuration
✅ Google OAuth Provider
✅ JWT session strategy
✅ Token callbacks (access_token, refresh_token)
✅ Session callbacks (token → session)
✅ Custom pages (signIn, error)
✅ Auto-redirect to /login on session expires
```

**Key features:**
- OAuth flow: signIn → Google consent → create JWT → session stored
- Tokens rotated on each request
- 30-day session expiry
- Scope: `openid profile email calendar.readonly calendar.events`

---

### 2. Route Protection & Middleware
**File:** `apps/web/middleware.ts`

```typescript
✅ Protect /dashboard/* routes
✅ Protect /interview/* routes
✅ Protect /api/interviews/* endpoints
✅ Auto-redirect unauthenticated users to /login with callbackUrl
✅ Preserve intended route on redirect
```

**Usage:** Automatic. Middleware runs on all requests matching protected patterns.

---

### 3. Google Calendar Adapter
**File:** `packages/legacy-adapter/src/adapter.ts` (NEW: GoogleLegacyAdapter class)

```typescript
✅ GoogleLegacyAdapter implements ILegacyAdapter
✅ Fetches events from Google Calendar API
✅ Filters [INTERVIEW] tagged events
✅ Parses event data → Interview type
✅ Error fallback to MockLegacyAdapter
✅ Supports createCalendarEvent (create + Google Meet link)
✅ Support for getInterviewDetails(eventId)
```

**Core methods:**
- `getUpcomingInterviews(limit)` → Fetches user's calendar, filters interview events
- `getInterviewDetails(id)` → Returns full event details
- `createCalendarEvent(interview)` → Creates new event with Google Meet
- `getCurrentUser()` → Returns authenticated user

**Data transformation example:**
```typescript
Google Calendar Event:
{
  id: "event123",
  summary: "[INTERVIEW] Executive Chef",
  description: "Jane Doe\njane@example.com",
  start: { dateTime: "2026-01-20T14:00:00Z" },
  end: { dateTime: "2026-01-20T14:30:00Z" }
}

↓ Transforms to:

Interview:
{
  id: "event123",
  candidateName: "Jane Doe",
  candidateEmail: "jane@example.com",
  position: "Executive Chef",
  brand: "SEACHEFS",
  scheduledTime: Date(2026-01-20T14:00:00Z),
  duration: 30,
  recruiterName: "John Smith",
  recruiterEmail: "john@seainfogroup.com"
}
```

---

### 4. Session Hook
**File:** `apps/web/src/hooks/useAuthSession.ts` (NEW)

```typescript
✅ useAuthSession() hook
✅ Wraps useSession() from next-auth
✅ Auto-redirects to /login if unauthenticated
✅ Provides loading state
✅ Returns session, status, isLoading
```

**Usage in components:**
```typescript
'use client';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function Dashboard() {
  const { session, status, isLoading } = useAuthSession();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>Welcome, {session?.user?.name}!</div>;
}
```

---

### 5. Login Page (OAuth Version)
**File:** `apps/web/app/login/page-phase2.tsx` (NEW)

```typescript
✅ Google sign-in button with icon
✅ Error state management
✅ Loading indicator
✅ Auto-redirect on success
✅ CallbackUrl preservation (redirects to intended page)
✅ Session check (auto-redirects if already logged in)
```

**User flow:**
1. User visits `/login` (or gets redirected from protected route)
2. Clicks "Sign in with Google"
3. Google consent screen (if first time)
4. User approves access to calendar & email
5. Redirects back to `/dashboard` (or original intended page)
6. Session stored in HttpOnly cookie (secure)
7. Dashboard loads real calendar data

---

### 6. Root Layout with SessionProvider
**File:** `apps/web/app/layout-phase2.tsx` (NEW)

```typescript
✅ Wraps entire app with SessionProvider
✅ Makes session accessible to all children
✅ Enables useSession() hook usage
✅ Manages session state globally
```

**Must be activated** (see "Next Steps" below).

---

### 7. API Routes for Interviews
**Files:** 
- `apps/web/app/api/interviews/route.ts` (NEW)
- `apps/web/app/api/interviews/[id]/route.ts` (NEW)

```typescript
✅ GET /api/interviews → List upcoming interviews (with auth)
✅ GET /api/interviews/[id] → Get single interview details
✅ Validates session.user.accessToken
✅ Creates adapter with user's token
✅ Returns typed Interview[]
✅ Error handling (401, 404, 500)
```

**Example requests:**
```bash
# Get upcoming interviews
curl http://localhost:3000/api/interviews?limit=10

# Response:
{
  "success": true,
  "data": [...],
  "count": 3
}

# Get interview details
curl http://localhost:3000/api/interviews/event123

# Response:
{
  "success": true,
  "data": { ...Interview }
}
```

---

### 8. TypeScript Types for NextAuth
**File:** `apps/web/types/next-auth.d.ts` (NEW)

```typescript
✅ Session.user.accessToken: string
✅ Session.user.refreshToken: string
✅ JWT token types defined
✅ TypeScript intellisense for session.user.*
```

---

### 9. Updated Dependencies
**Files:** `.env.example`, `apps/web/package-phase2.json`

```diff
+ next-auth@5.0.0-beta.10
```

---

## Files Changed (Git Commit 549b706)

| Path | Status | Purpose |
|------|--------|---------|
| `apps/web/app/api/auth/[...nextauth]/route.ts` | ✅ NEW | NextAuth handler |
| `apps/web/middleware.ts` | ✅ NEW | Route protection |
| `apps/web/src/hooks/useAuthSession.ts` | ✅ NEW | Session hook |
| `apps/web/app/login/page-phase2.tsx` | ✅ NEW | OAuth login UI |
| `apps/web/app/layout-phase2.tsx` | ✅ NEW | SessionProvider |
| `apps/web/app/api/interviews/route.ts` | ✅ NEW | List API |
| `apps/web/app/api/interviews/[id]/route.ts` | ✅ NEW | Detail API |
| `apps/web/types/next-auth.d.ts` | ✅ NEW | Type defs |
| `packages/legacy-adapter/src/adapter.ts` | ✅ UPDATED | Add GoogleLegacyAdapter |
| `.env.example` | ✅ UPDATED | Add auth vars |
| `PHASE_2_SETUP.md` | ✅ NEW | Setup guide (10 steps) |

---

## Next: Activation Steps

### Step 1: Get Google OAuth Credentials

**1. Go to Google Cloud Console:**
https://console.cloud.google.com

**2. Create new project:** "Interview Pass"

**3. Enable APIs:**
- Google Calendar API
- Google+ API (or just use Google Identity)

**4. Create OAuth 2.0 credentials:**
- Type: Web application
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://your-domain.vercel.app/api/auth/callback/google` (production)

**5. Copy credentials:**
- Client ID: `xxx.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxx`

---

### Step 2: Update Environment Variables

**Create/update `.env.local`:**

```bash
# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret

# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000

# Optional
GOOGLE_CALENDAR_ID=primary
NODE_ENV=development
```

**Verify file exists:**
```bash
cat .env.local
```

---

### Step 3: Replace Login & Layout Files

**Activate OAuth login page:**
```bash
cp apps/web/app/login/page.tsx apps/web/app/login/page.tsx.backup
cp apps/web/app/login/page-phase2.tsx apps/web/app/login/page.tsx
```

**Activate SessionProvider layout:**
```bash
cp apps/web/app/layout.tsx apps/web/app/layout.tsx.backup
cp apps/web/app/layout-phase2.tsx apps/web/app/layout.tsx
```

---

### Step 4: Install Dependencies

```bash
cd Interview-Pass-NexusJS
pnpm install
```

Will install `next-auth@5.0.0-beta.10` automatically.

---

### Step 5: Update Dashboard & Interview Pages

**Replace MockLegacyAdapter calls with real adapter.**

See `PHASE_2_SETUP.md` **Step 7 & 8** for exact code changes.

Example for dashboard:

```typescript
'use client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { createLegacyAdapter } from '@interview-pass/legacy-adapter';

export default function DashboardPage() {
  const { session, isLoading } = useAuthSession();

  if (isLoading) return <div>Loading...</div>;

  // Use real adapter with user's Google token
  const adapter = createLegacyAdapter(
    session?.user?.accessToken,
    session?.user ? {
      email: session.user.email!,
      name: session.user.name || 'Recruiter',
      role: 'recruiter',
    } : undefined
  );

  // Rest of page uses real calendar data...
}
```

---

### Step 6: Test Locally

```bash
pnpm dev
# Opens http://localhost:3000
```

**Test scenarios:**

| Scenario | Expected |
|----------|----------|
| Visit `/dashboard` unauthenticated | Redirect to `/login` |
| Click "Sign in with Google" | Google sign-in popup |
| Sign in with Google account | Redirect to `/dashboard` |
| `/dashboard` shows real calendar events | ✅ Interview list from calendar |
| Click interview → `/interview/[id]` | Shows full event details |
| Refresh page → Session persists | ✅ Still logged in |
| Check DevTools cookies | `next-auth.session-token` present |

---

## Architecture: Before vs After

### Before (Phase 1 - Mock Data)
```
User clicks /dashboard
       ↓
Next.js Page Component
       ↓
MockLegacyAdapter.getUpcomingInterviews()
       ↓
Returns 3 hardcoded Interview objects
       ↓
Page renders mock data
```

### After (Phase 2 - Real Calendar)
```
User visits /login
       ↓
Clicks "Sign in with Google"
       ↓
NextAuth (Google Provider)
       ↓
Google OAuth Consent
       ↓
NextAuth creates JWT session
       ↓
Redirect to /dashboard
       ↓
Middleware: Check session (✓ OK)
       ↓
Dashboard component calls useAuthSession()
       ↓
Session loaded with accessToken
       ↓
GoogleLegacyAdapter.getUpcomingInterviews(accessToken)
       ↓
Calls Google Calendar API
       ↓
Parses [INTERVIEW] events
       ↓
Returns typed Interview[]
       ↓
Dashboard renders real calendar data
```

---

## Key Configuration Details

### Google OAuth Scopes
```typescript
scope: 'openid profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events'
```

**Scopes explained:**
- `openid` – OpenID Connect standard
- `profile` – User's name, picture
- `email` – User's email address
- `calendar.readonly` – Read Google Calendar (fetch events)
- `calendar.events` – Create calendar events (for scheduling)

### Session Expiry
```typescript
session: { maxAge: 30 * 24 * 60 * 60 } // 30 days
```

### Fallback to Mock Data
If Google Calendar fetch fails:
```typescript
catch (error) {
  console.warn('Failed to fetch calendar, using mock data');
  return new MockLegacyAdapter().getUpcomingInterviews(limit);
}
```

This ensures UX doesn't break if Calendar API is down.

---

## Troubleshooting

### "GOOGLE_CLIENT_ID is not defined"
**Fix:** 
1. Verify `.env.local` exists in project root
2. Verify all 4 vars are set: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Restart dev server: `pnpm dev`

### "Redirect URI mismatch"
**Fix:**
1. Check Google Cloud Console redirect URI exactly matches: `http://localhost:3000/api/auth/callback/google`
2. Both `http://` and port number must match
3. Wait 5 minutes for changes to propagate

### "Cannot read property 'accessToken' of undefined"
**Fix:**
1. Ensure layout wraps with `<SessionProvider>`
2. Use `useAuthSession()` hook (not just `useSession()`) to auto-redirect
3. Check `isLoading` before accessing `session`

### "Calendar events not showing"
**Fix:**
1. Verify your Google account has shared calendar events
2. Check Network tab for 401 errors (bad token)
3. Ensure OAuth scopes include `calendar.readonly`
4. Check event titles contain `[INTERVIEW]` prefix

See full troubleshooting in `PHASE_2_SETUP.md`.

---

## Deployment to Vercel

**When ready:**

```bash
git push origin main
```

Then in Vercel dashboard:
1. Set environment secrets:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL=https://your-domain.vercel.app`

2. Update Google Cloud redirect URI:
   - Add: `https://your-domain.vercel.app/api/auth/callback/google`

3. Deploy (Vercel auto-detects Next.js)

---

## Phase 2 Completion Checklist

- [ ] Generated Google OAuth credentials
- [ ] Created `.env.local` with all 4 required variables
- [ ] Installed `pnpm install`
- [ ] Activated `page-phase2.tsx` → `page.tsx`
- [ ] Activated `layout-phase2.tsx` → `layout.tsx`
- [ ] Updated dashboard/interview pages with real adapter
- [ ] Ran `pnpm dev` without errors
- [ ] Tested OAuth sign-in flow
- [ ] Verified calendar data loads on dashboard
- [ ] Checked session persists across page refreshes
- [ ] Tested API endpoints (`/api/interviews`)
- [ ] Verified middleware protects `/dashboard` and `/interview/*`

**When all ✅:** You're ready for Phase 3 (Smartsheet integration)

---

## What's Next

### Phase 3: Smartsheet Integration (3-4 days)
- [ ] Add Smartsheet API client
- [ ] Fetch candidate data from Smartsheet
- [ ] Sync calendar events with Smartsheet
- [ ] Add candidate profile page
- [ ] Link interviews to candidates

### Phase 4: Interactive Features (3-5 days)
- [ ] Checklist UI (with save state)
- [ ] Audio/text notes capture
- [ ] Transcript upload
- [ ] Email results to candidates

### Phase 5: Analytics & Admin (2-3 days)
- [ ] Analytics dashboard (conversion rates, time-to-hire)
- [ ] Admin panel (manage interviewers, templates)
- [ ] Email notifications (reminders, results)

---

## Reference Links

- **NextAuth.js:** https://next-auth.js.org
- **Google Calendar API:** https://developers.google.com/calendar/api
- **Google OAuth:** https://developers.google.com/identity/protocols/oauth2
- **Vercel Deployment:** https://vercel.com/docs

---

**Version:** Phase 2 Completion v1.0  
**Last Updated:** January 19, 2026  
**Status:** ✅ Complete & Ready for Configuration
