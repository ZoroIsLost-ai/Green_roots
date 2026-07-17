-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- for your project to clean up the old table schema and apply the new columns.

-- 1. Drop the old table to clean up old columns (name, phone, sthan)
drop table if exists public.responses cascade;

-- 2. Create the responses table with new coordinator & co-coordinator columns
create table public.responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  vibhag text not null,
  zilla text not null,
  nagar text not null,
  sanyojak_name text not null default 'NA',
  sanyojak_phone text not null default 'NA',
  sanyojak_location text not null default 'NA',
  sah_sanyojak_name text not null default 'NA',
  sah_sanyojak_phone text not null default 'NA',
  sah_sanyojak_location text not null default 'NA'
);

-- 3. Create index for fast date retrieval
create index responses_created_at_idx on public.responses (created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.responses enable row level security;

-- 5. Create INSERT policy for the public form
drop policy if exists "Allow public inserts" on public.responses;
create policy "Allow public inserts"
  on public.responses
  for insert
  to anon
  with check (true);
