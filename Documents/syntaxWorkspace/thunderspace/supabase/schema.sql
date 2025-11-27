-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  display_name text,
  bio text,
  avatar_url text,
  website text,
  is_verified boolean default false,
  role text default 'user' check (role in ('user', 'admin', 'superadmin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id or (select role from profiles where id = auth.uid()) = 'superadmin' );

-- Create a table for knowledge items
create table if not exists knowledge_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  media_type text check (media_type in ('pdf', 'audio', 'article', 'video')),
  media_url text,
  content_text text,
  topics text[],
  author_id uuid references auth.users(id) on delete set null,
  thumbnail_url text
);

-- Set up Row Level Security (RLS)
alter table knowledge_items enable row level security;

drop policy if exists "Knowledge items are viewable by everyone." on knowledge_items;
create policy "Knowledge items are viewable by everyone."
  on knowledge_items for select
  using ( true );

drop policy if exists "Authenticated users can insert knowledge items." on knowledge_items;
create policy "Authenticated users can insert knowledge items."
  on knowledge_items for insert
  with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can update their own knowledge items." on knowledge_items;
create policy "Users can update their own knowledge items."
  on knowledge_items for update
  using ( auth.uid() = author_id or (select role from profiles where id = auth.uid()) = 'superadmin' );

drop policy if exists "Users can delete their own knowledge items." on knowledge_items;
create policy "Users can delete their own knowledge items."
  on knowledge_items for delete
  using ( auth.uid() = author_id or (select role from profiles where id = auth.uid()) = 'superadmin' );

-- Enable Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table profiles;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'knowledge_items'
  ) then
    alter publication supabase_realtime add table knowledge_items;
  end if;
end;
$$;

-- Storage Setup
insert into storage.buckets (id, name, public)
values ('knowledge_assets', 'knowledge_assets', true)
on conflict (id) do nothing;

-- Storage RLS
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'knowledge_assets' );

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'knowledge_assets' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update own files"
  on storage.objects for update
  using (
    bucket_id = 'knowledge_assets' 
    and (auth.uid() = owner or (select role from profiles where id = auth.uid()) = 'superadmin')
  );

create policy "Users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'knowledge_assets' 
    and (auth.uid() = owner or (select role from profiles where id = auth.uid()) = 'superadmin')
  );

-- ==========================================
-- NEW FEATURES (Social, Collections, Profile)
-- ==========================================

-- Update profiles with new fields
alter table profiles add column if not exists library_card_url text;
alter table profiles add column if not exists settings jsonb default '{}'::jsonb;
-- Add role column if it doesn't exist (idempotent)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'role') then
    alter table profiles add column role text default 'user' check (role in ('user', 'admin', 'superadmin'));
  end if;
end;
$$;

-- Create Observes table
create table if not exists observes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  observer_id uuid references profiles(id) on delete cascade not null,
  target_user_id uuid references profiles(id) on delete cascade,
  target_topic text,
  
  constraint observes_target_check check (
    (target_user_id is not null and target_topic is null) or
    (target_user_id is null and target_topic is not null)
  ),
  unique(observer_id, target_user_id, target_topic)
);

-- Observes RLS
alter table observes enable row level security;

drop policy if exists "Observes are viewable by everyone" on observes;
create policy "Observes are viewable by everyone"
  on observes for select using (true);

drop policy if exists "Users can manage their own observes" on observes;
create policy "Users can manage their own observes"
  on observes for all
  using (auth.uid() = observer_id);

-- Create Folders table
create table if not exists folders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#000000',
  icon text,
  
  unique(user_id, name)
);

-- Folders RLS
alter table folders enable row level security;

drop policy if exists "Users can view own folders" on folders;
create policy "Users can view own folders"
  on folders for select using (auth.uid() = user_id or (select role from profiles where id = auth.uid()) = 'superadmin');

drop policy if exists "Users can manage own folders" on folders;
create policy "Users can manage own folders"
  on folders for all using (auth.uid() = user_id or (select role from profiles where id = auth.uid()) = 'superadmin');

-- Create Bookmarks table (if not exists, or update)
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  item_id uuid references knowledge_items(id) on delete cascade not null,
  folder_id uuid references folders(id) on delete set null,
  
  unique(user_id, item_id)
);

-- Bookmarks RLS
alter table bookmarks enable row level security;

drop policy if exists "Users can view own bookmarks" on bookmarks;
create policy "Users can view own bookmarks"
  on bookmarks for select using (auth.uid() = user_id or (select role from profiles where id = auth.uid()) = 'superadmin');

drop policy if exists "Users can manage own bookmarks" on bookmarks;
create policy "Users can manage own bookmarks"
  on bookmarks for all using (auth.uid() = user_id or (select role from profiles where id = auth.uid()) = 'superadmin');

-- Realtime for new tables
  if not exists (select 1 from pg_publication_tables where tablename = 'bookmarks') then
    alter publication supabase_realtime add table bookmarks;
  end if;
end;
$$;

-- ==========================================
-- SYSTEM SETTINGS (Admin Control)
-- ==========================================

create table if not exists system_settings (
  id integer primary key default 1,
  maintenance_mode boolean default false,
  registration_open boolean default true,
  announcement_message text,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id),
  
  constraint singleton_row check (id = 1)
);

-- Initialize default settings
insert into system_settings (id, maintenance_mode, registration_open)
values (1, false, true)
on conflict (id) do nothing;

-- RLS for System Settings
alter table system_settings enable row level security;

drop policy if exists "Settings viewable by everyone" on system_settings;
create policy "Settings viewable by everyone"
  on system_settings for select using (true);

drop policy if exists "Settings updateable by superadmin only" on system_settings;
create policy "Settings updateable by superadmin only"
  on system_settings for update
  using ( (select role from profiles where id = auth.uid()) = 'superadmin' );
