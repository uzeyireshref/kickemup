-- Profiles table + trigger for Supabase Auth users
-- Run this in Supabase SQL Editor (or as a migration).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  first_name text,
  last_name text,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;

alter table public.profiles enable row level security;

create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.handle_profile_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name
  )
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    full_name = excluded.full_name,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

drop policy if exists "Profiles: owner can read" on public.profiles;
create policy "Profiles: owner can read"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Profiles: owner can insert" on public.profiles;
create policy "Profiles: owner can insert"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Profiles: owner can update" on public.profiles;
create policy "Profiles: owner can update"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);
