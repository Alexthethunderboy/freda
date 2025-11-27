-- Add missing columns to profiles table
alter table profiles 
add column if not exists bio text,
add column if not exists display_name text,
add column if not exists is_verified boolean default false;

-- Create topics table if it doesn't exist (re-including this just in case)
create table if not exists topics (
  id uuid default gen_random_uuid() primary key,
  title text not null unique,
  slug text not null unique,
  description text,
  color_hex text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on topics
alter table topics enable row level security;

-- Policies for topics
create policy "Topics are viewable by everyone"
  on topics for select
  using (true);

create policy "Only admins can insert topics"
  on topics for insert
  with check (true);
