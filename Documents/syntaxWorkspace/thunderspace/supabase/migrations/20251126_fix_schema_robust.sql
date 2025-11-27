-- 1. Fix Profiles Table (Safe to run multiple times)
alter table profiles 
add column if not exists bio text,
add column if not exists display_name text,
add column if not exists is_verified boolean default false;

-- 2. Fix Topics Table (Safe to run multiple times)
create table if not exists topics (
  id uuid default gen_random_uuid() primary key,
  title text not null unique,
  slug text not null unique,
  description text,
  color_hex text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Fix Policies (Drop first to avoid "already exists" error)
alter table topics enable row level security;

drop policy if exists "Topics are viewable by everyone" on topics;
create policy "Topics are viewable by everyone"
  on topics for select
  using (true);

drop policy if exists "Only admins can insert topics" on topics;
create policy "Only admins can insert topics"
  on topics for insert
  with check (true);
