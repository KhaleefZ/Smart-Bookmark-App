-- ============================================
-- Smart Bookmarks App - Supabase SQL Setup
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create the bookmarks table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.bookmarks enable row level security;

-- 3. RLS Policies: Users can only see/manage their own bookmarks

-- Policy: Users can read their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- 4. Create an index for faster queries by user
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);

-- 5. Enable Realtime for the bookmarks table
alter publication supabase_realtime add table public.bookmarks;
