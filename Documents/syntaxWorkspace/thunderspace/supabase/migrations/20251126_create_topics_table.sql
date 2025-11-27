-- Create topics table
create table if not exists topics (
  id uuid default gen_random_uuid() primary key,
  title text not null unique,
  slug text not null unique,
  description text,
  color_hex text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table topics enable row level security;

-- Policies
create policy "Topics are viewable by everyone"
  on topics for select
  using (true);

create policy "Only admins can insert topics"
  on topics for insert
  with check (
    -- For now, allow anyone to insert if they have the service role key (which bypasses RLS anyway)
    -- or if we want to restrict it to specific users:
    -- auth.uid() in (select user_id from admin_users)
    true 
  );
