-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- for a fresh project before deploying the app.

create extension if not exists "pgcrypto";

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  vibhag text not null,
  zilla text not null,
  nagar text not null,
  name text not null,
  phone text not null,
  location text not null
);

create index if not exists responses_created_at_idx on public.responses (created_at desc);
create index if not exists responses_vibhag_idx on public.responses (vibhag);
create index if not exists responses_zilla_idx on public.responses (zilla);

-- Row Level Security: the public form only ever uses the anon key
-- to INSERT. All reads, updates, and deletes go through the admin
-- API routes, which use the service role key and bypass RLS —
-- so no SELECT/UPDATE/DELETE policy is granted to anon.
alter table public.responses enable row level security;

drop policy if exists "Allow public inserts" on public.responses;
create policy "Allow public inserts"
  on public.responses
  for insert
  to anon
  with check (true);
