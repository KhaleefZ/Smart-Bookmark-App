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

## Problems Encountered & Solutions

### 1. Supabase Auth Cookies in Next.js App Router
**Problem:** Supabase auth tokens need to be managed as cookies for server-side rendering in the App Router.
**Solution:** Used `@supabase/ssr` package which provides `createBrowserClient` and `createServerClient` helpers that handle cookie management automatically. Added middleware to refresh auth tokens on every request.

### 2. Real-time Updates Only Showing Own Bookmarks
**Problem:** Supabase Realtime broadcasts `INSERT` events to all subscribers, not just the bookmark owner, which could cause other users' bookmarks to appear in the list.
**Solution:** Added a client-side check in the real-time subscription callback that verifies `payload.new.user_id === currentUser.id` before adding the bookmark to the local state.

### 3. Row Level Security (RLS) with Realtime
**Problem:** Had to ensure that even with Realtime enabled, users cannot access other users' data.
**Solution:** Implemented strict RLS policies (`SELECT`, `INSERT`, `DELETE` all scoped to `auth.uid() = user_id`) and added the Realtime publication for the bookmarks table so Postgres broadcasts changes that clients can filter.

### 4. Cookie Handling in Server Components
**Problem:** `cookies().set()` throws an error when called from a Server Component (read-only context).
**Solution:** Wrapped `setAll` in a try-catch in the server client — this is expected behavior since middleware handles the actual cookie refresh.

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
