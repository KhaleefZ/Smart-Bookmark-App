# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Live Demo

🔗 [Live Vercel URL](https://smart-bookmark-app-tau-nine.vercel.app/) 

## Features

- **Google OAuth** — Sign in with Google (no email/password)
- **Add Bookmarks** — Save URLs with titles
- **Private Bookmarks** — Each user only sees their own bookmarks (enforced by RLS)
- **Real-time Sync** — Bookmark list updates in real-time across tabs (Supabase Realtime)
- **Delete Bookmarks** — Remove bookmarks with one click
- **Responsive UI** — Clean, mobile-friendly design with Tailwind CSS

## Tech Stack

- **Next.js 16** — App Router (no Pages Router)
- **Supabase** — Auth (Google OAuth), PostgreSQL Database, Realtime subscriptions
- **Tailwind CSS v4** — Utility-first styling
- **TypeScript** — Type safety throughout

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([create one free](https://supabase.com))
- Google OAuth credentials configured in Supabase

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL in `supabase/schema.sql` to create the `bookmarks` table with RLS policies
3. Go to **Authentication > Providers > Google** and enable it:
   - Add your Google Client ID and Secret (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))
   - Set the redirect URL to: `https://<your-project>.supabase.co/auth/v1/callback`
4. Copy your **Project URL** and **anon key** from **Settings > API**

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

```bash
npx vercel
```

Add the same environment variables in Vercel's project settings.

**Important:** After deploying, add your Vercel URL to the allowed redirect URLs in:
- Supabase: **Authentication > URL Configuration > Redirect URLs** → add `https://your-app.vercel.app/auth/callback`
- Google Cloud Console: **OAuth 2.0 Client > Authorized redirect URIs** → add `https://<your-project>.supabase.co/auth/v1/callback`

## Problems Faced & How I Solved Them

### 1. Bookmarks Only Appeared After Page Refresh
**Problem:** After adding a bookmark, it wouldn't show up in the list until the user manually refreshed the page. This was the biggest UX issue I encountered.

**Root Cause:** `AddBookmarkForm` and `BookmarkList` were sibling components with no shared state. The form inserted into Supabase, but the list only fetched on mount — there was no communication between them. The Realtime subscription existed but had a race condition where the optimistic update wasn't happening.

**Solution:** Lifted all bookmark state up into a parent `Dashboard` client component. The form now calls `.select().single()` after insert to get the new row back, then calls an `onBookmarkAdded` callback that immediately updates the shared state (optimistic UI). The Realtime subscription in `Dashboard` handles cross-tab sync with a deduplication check (`prev.some(b => b.id === payload.new.id)`) to avoid double-rendering when both the callback and the Realtime event fire.

### 2. Supabase Auth Cookie Management in Next.js App Router
**Problem:** Supabase auth tokens need to persist as cookies for server-side rendering, but Next.js App Router has strict rules about when cookies can be read vs. written.

**Solution:** Used `@supabase/ssr` which provides `createBrowserClient` (for client components) and `createServerClient` (for server components/route handlers) with built-in cookie adapters. Added Next.js middleware (`middleware.ts`) that calls `updateSession()` on every request to refresh expired tokens before they reach the page.

### 3. `cookies().set()` Throwing in Server Components
**Problem:** The Supabase server client tries to call `cookies().set()` during token refresh, but Server Components in Next.js are read-only — you can't set cookies from them. This caused runtime errors.

**Solution:** Wrapped the `setAll` callback in a `try-catch` block inside the server client factory. This is safe because the middleware already handles the actual cookie refresh upstream. The server client only needs to *read* cookies to authenticate the request — it doesn't need to write them.

### 4. Realtime Broadcasting to All Users
**Problem:** Supabase Realtime sends `postgres_changes` events to every connected client, not just the user who owns the bookmark. Without filtering, User A could briefly see User B's bookmarks appear in their list.

**Solution:** Added a client-side guard in the Realtime callback: fetch the current user via `supabase.auth.getUser()` and compare `payload.new.user_id === user.id` before updating state. Combined with Row Level Security (RLS) on the database side (`auth.uid() = user_id` on SELECT/INSERT/DELETE), this provides defense in depth — the database rejects unauthorized access regardless of what the client does.

### 5. Middleware Deprecation Warning in Next.js 16
**Problem:** Next.js 16 introduced a new `proxy` file convention and shows a deprecation warning for the legacy `middleware.ts` pattern: *"The middleware file convention is deprecated. Please use proxy instead."*

**Solution:** The middleware still works correctly in Next.js 16 — it's a warning, not an error. The `proxy.ts` convention is the recommended path forward, but for compatibility and since Supabase's `@supabase/ssr` documentation currently targets the middleware pattern, I kept it as-is. The warning does not affect functionality.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts      # OAuth callback handler
│   │   └── auth-code-error/page.tsx # Auth error page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Main page (login or dashboard)
├── components/
│   ├── AddBookmarkForm.tsx         # Form to add new bookmarks
│   ├── BookmarkList.tsx            # Real-time bookmark list with delete
│   ├── Dashboard.tsx               # Main dashboard layout
│   ├── LoginButton.tsx             # Google OAuth login button
│   └── LogoutButton.tsx            # Sign out button
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── middleware.ts            # Session refresh middleware
│   │   └── server.ts               # Server Supabase client
│   └── types.ts                    # TypeScript types
├── middleware.ts                    # Next.js middleware for auth
supabase/
└── schema.sql                      # Database schema & RLS policies
```

## Database Schema

```sql
bookmarks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  url         text NOT NULL,
  title       text NOT NULL,
  created_at  timestamptz DEFAULT now()
)
```

**RLS Policies:** Users can only SELECT, INSERT, and DELETE their own bookmarks.
