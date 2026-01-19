# Phase 2: Google OAuth + Real Calendar Integration

**Status:** 📋 Setup complete, ready to configure  
**Timeline:** 2-3 days  
**Dependencies:** Google Cloud Project with OAuth2 credentials

---

## Overview

Phase 2 replaces mock interview data with real Google Calendar data, adds secure authentication, and protects all routes.

**What's implemented:**
- ✅ NextAuth.js v5 framework scaffold
- ✅ Google OAuth provider configuration
- ✅ Route handlers for auth callbacks
- ✅ Middleware for protected routes
- ✅ GoogleLegacyAdapter (real Calendar API calls)
- ✅ Session management with JWT tokens

**What you need to do:**
1. Create Google Cloud Project
2. Generate OAuth 2.0 credentials
3. Update `.env.local` with credentials
4. Test auth flow
5. Replace login page (swap page.tsx ← page-phase2.tsx)
6. Replace layout (swap layout.tsx ← layout-phase2.tsx)

---

## Step 1: Create Google Cloud Project

### A. Go to Google Cloud Console
1. Visit https://console.cloud.google.com
2. Create a new project named `Interview Pass`
3. Wait for project creation (~30 seconds)
4. Select the project from the dropdown

### B. Enable Required APIs
1. Go to **APIs & Services** → **Enabled APIs & services**
2. Click **+ Enable APIs and Services**
3. Search for and enable:
   - `Google Calendar API`
   - `Google+ API`

### C. Create OAuth 2.0 Credentials

**In Google Cloud Console:**

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. First time? Click "Create OAuth consent screen"
   - **User Type:** External
   - **App name:** Interview Pass
   - **User support email:** your-email@example.com
   - **Developer contact:** your-email@example.com
   - Save and continue
4. **Scopes:** Add `openid`, `profile`, `email`, `calendar.readonly`, `calendar.events`
5. **Test users:** Add yourself (your Google account email)
6. Back to **Credentials** → **+ Create Credentials** → **OAuth client ID**
   - **Application type:** Web application
   - **Name:** Interview Pass Web
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (local)
     - `https://yourdomain.vercel.app/api/auth/callback/google` (production, when deployed)
7. Click **Create**
8. Copy **Client ID** and **Client Secret**

---

## Step 2: Create NEXTAUTH_SECRET

Generate a secure secret:

```bash
# Option 1: Use openssl (Mac/Linux)
openssl rand -base64 32

# Option 2: Use PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# Option 3: Online generator
# https://generate-secret.vercel.app
```

Copy the output; you'll use it in `.env.local`.

---

## Step 3: Update Environment Variables

**In project root**, update `.env.local`:

```bash
# Copy from Google Cloud credentials
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxx

# Generate from Step 2
NEXTAUTH_SECRET=your-base64-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google Calendar (optional - for calendar selection in advanced features)
GOOGLE_CALENDAR_ID=primary

# Next.js environment
NODE_ENV=development
```

**Verify the file exists:**
```bash
cat .env.local
# Should show all 5 variables set
```

---

## Step 4: Install Dependencies

**Install NextAuth.js:**

```bash
cd Interview-Pass-NexusJS
pnpm add next-auth@5.0.0-beta.10
pnpm install
```

**Verify installation:**
```bash
pnpm list next-auth
# Should show: next-auth@5.0.0-beta.10
```

---

## Step 5: Update Login Page

The new login page has been created as `page-phase2.tsx`. To activate it:

```bash
# Backup old page
cp apps/web/app/login/page.tsx apps/web/app/login/page.tsx.backup

# Activate new OAuth page
cp apps/web/app/login/page-phase2.tsx apps/web/app/login/page.tsx
```

**What changed:**
- ❌ Removed: Email/password form
- ✅ Added: Google OAuth button with icon
- ✅ Added: Error handling & loading states
- ✅ Added: Auto-redirect to dashboard on successful login

---

## Step 6: Update Root Layout

Replace the layout to include NextAuth SessionProvider:

```bash
# Backup old layout
cp apps/web/app/layout.tsx apps/web/app/layout.tsx.backup

# Activate new layout with SessionProvider
cp apps/web/app/layout-phase2.tsx apps/web/app/layout.tsx
```

**What changed:**
- ✅ Added: NextAuth SessionProvider wrapper
- ✅ Added: Session context available to all child components
- Session is now accessible via `useSession()` hook

---

## Step 7: Update Dashboard to Use Real Adapter

**File:** `apps/web/app/dashboard/page.tsx`

Replace the mock adapter call with real one:

```typescript
// Old (mock):
const adapter = createLegacyAdapter();

// New (real):
'use client';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function DashboardPage() {
  const { session, isLoading } = useAuthSession();

  // Create real adapter with user's Google session
  const adapter = createLegacyAdapter(
    session?.user?.accessToken,
    session?.user ? {
      email: session.user.email!,
      name: session.user.name || 'Recruiter',
      role: 'recruiter',
    } : undefined
  );
  
  // Rest of page...
}
```

---

## Step 8: Do the Same for Interview Details Page

**File:** `apps/web/app/interview/[id]/page.tsx`

Same pattern:

```typescript
'use client';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function InterviewPage() {
  const { session, isLoading } = useAuthSession();

  const adapter = createLegacyAdapter(
    session?.user?.accessToken,
    session?.user ? {
      email: session.user.email!,
      name: session.user.name || 'Recruiter',
      role: 'recruiter',
    } : undefined
  );
  
  // Rest of page...
}
```

---

## Step 9: Test the Auth Flow

### Local Testing

```bash
# Start dev server
pnpm dev

# Open http://localhost:3000
```

**Test scenarios:**

1. **Unauthenticated user:**
   - Visit http://localhost:3000/dashboard
   - Should redirect to /login
   - ✅ Expected

2. **Click "Sign in with Google":**
   - Popup appears (or redirect to Google sign-in)
   - Sign in with your Google account (the one added as test user)
   - ✅ Should redirect to /dashboard
   - ✅ Should see your real Google Calendar events

3. **Check Session:**
   - Open browser DevTools → Application → Cookies
   - Should see `next-auth.session-token`
   - ✅ Session is stored

4. **Click interview from calendar:**
   - Should load interview details from Google Calendar
   - ✅ Check that event data populates

5. **Sign out:**
   - Add sign-out button to dashboard (Phase 2b)
   - Click sign out
   - Redirect to /login
   - ✅ Session cleared

---

## Step 10: Deploy to Vercel (Optional)

### A. Push to GitHub

```bash
git add .
git commit -m "feat: implement Phase 2 Google OAuth and real Calendar adapter"
git push origin main
```

### B. Connect to Vercel

1. Visit https://vercel.com/new
2. Import `Interview-Pass-NexusJS` repository
3. Set environment variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-project.vercel.app
   ```
4. Click **Deploy**
5. Wait ~2 minutes for build
6. Visit your Vercel URL and test auth flow

---

## Troubleshooting

### "GOOGLE_CLIENT_ID is not defined"
- Check `.env.local` file exists in project root
- Verify all variables are set: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`
- Restart dev server: `pnpm dev`

### "Google sign-in fails with error_description=Redirect URI mismatch"
- Verify redirect URI in Google Cloud matches exactly:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourvercelapp.vercel.app/api/auth/callback/google`
- Note: `http://` vs `https://` must match
- Allow up to 5 minutes for Google to propagate changes

### "Session not persisting"
- Check `NEXTAUTH_SECRET` is set in `.env.local`
- Ensure layout.tsx includes `<SessionProvider>`
- Check browser cookies are enabled
- Clear cookies and restart dev server

### "Calendar events not showing on dashboard"
- Verify Google account has shared calendar events
- Check network tab in DevTools for 401 errors (invalid token)
- Ensure `https://www.googleapis.com/auth/calendar.readonly` scope is included in OAuth
- If using mock data still, you may need to replace the mock adapter calls

### "TypeError: Cannot read property 'accessToken' of null"
- Make sure you're using `useAuthSession()` hook to wait for session load
- Check `isLoading` state before accessing `session`

---

## File Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `apps/web/api/auth/[...nextauth]/route.ts` | ✅ Created | NextAuth handler |
| `apps/web/middleware.ts` | ✅ Created | Protect /dashboard, /interview routes |
| `apps/web/src/hooks/useAuthSession.ts` | ✅ Created | Session hook with auto-redirect |
| `apps/web/app/login/page-phase2.tsx` | ✅ Created | Real OAuth login UI |
| `apps/web/app/layout-phase2.tsx` | ✅ Created | SessionProvider wrapper |
| `packages/legacy-adapter/src/adapter.ts` | ✅ Updated | Add GoogleLegacyAdapter class |
| `.env.example` | ✅ Updated | Add NextAuth vars |
| `package.json` (apps/web) | ✅ Updated | Add next-auth dependency |

---

## Next Steps

After Phase 2 is complete:

1. **Phase 3:** Smartsheet integration (candidate data)
2. **Phase 4:** Interactive checklist & transcripts
3. **Phase 5:** Analytics & email notifications

See [docs/MIGRATION.md](../MIGRATION.md) for full roadmap.

---

## Useful Links

- [NextAuth.js Docs](https://next-auth.js.org)
- [Google Calendar API](https://developers.google.com/calendar/api)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Created:** January 19, 2026  
**Version:** Phase 2 Setup Guide v1.0
