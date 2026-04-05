alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz default timezone('utc', now());

create unique index if not exists profiles_email_key on public.profiles (email);

alter table public.profiles
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

update public.profiles
set
  created_at = coalesce(created_at, updated_at, timezone('utc', now())),
  updated_at = coalesce(updated_at, timezone('utc', now())),
  full_name = coalesce(full_name, nullif(trim(concat_ws(' ', first_name, last_name)), ''));

alter table public.profiles
  alter column created_at set not null,
  alter column updated_at set not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  next_first_name text := nullif(trim(coalesce(metadata ->> 'first_name', metadata ->> 'given_name', '')), '');
  next_last_name text := nullif(trim(coalesce(metadata ->> 'last_name', metadata ->> 'family_name', '')), '');
  next_full_name text := nullif(
    trim(
      coalesce(
        metadata ->> 'full_name',
        metadata ->> 'name',
        concat_ws(' ', next_first_name, next_last_name)
      )
    ),
    ''
  );
  next_avatar_url text := nullif(trim(coalesce(metadata ->> 'avatar_url', metadata ->> 'picture', '')), '');
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    next_first_name,
    next_last_name,
    next_full_name,
    next_avatar_url
  )
  on conflict (id) do update
  set
    email = coalesce(excluded.email, public.profiles.email),
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

with auth_source as (
  select
    users.id,
    users.email,
    nullif(trim(coalesce(users.raw_user_meta_data ->> 'first_name', users.raw_user_meta_data ->> 'given_name', '')), '') as first_name,
    nullif(trim(coalesce(users.raw_user_meta_data ->> 'last_name', users.raw_user_meta_data ->> 'family_name', '')), '') as last_name,
    nullif(
      trim(
        coalesce(
          users.raw_user_meta_data ->> 'full_name',
          users.raw_user_meta_data ->> 'name',
          concat_ws(
            ' ',
            nullif(trim(coalesce(users.raw_user_meta_data ->> 'first_name', users.raw_user_meta_data ->> 'given_name', '')), ''),
            nullif(trim(coalesce(users.raw_user_meta_data ->> 'last_name', users.raw_user_meta_data ->> 'family_name', '')), '')
          )
        )
      ),
      ''
    ) as full_name,
    nullif(trim(coalesce(users.raw_user_meta_data ->> 'avatar_url', users.raw_user_meta_data ->> 'picture', '')), '') as avatar_url,
    coalesce(users.created_at, timezone('utc', now())) as created_at
  from auth.users as users
)
insert into public.profiles (
  id,
  email,
  first_name,
  last_name,
  full_name,
  avatar_url,
  created_at
)
select
  auth_source.id,
  auth_source.email,
  auth_source.first_name,
  auth_source.last_name,
  auth_source.full_name,
  auth_source.avatar_url,
  auth_source.created_at
from auth_source
on conflict (id) do update
set
  email = coalesce(excluded.email, public.profiles.email),
  first_name = coalesce(excluded.first_name, public.profiles.first_name),
  last_name = coalesce(excluded.last_name, public.profiles.last_name),
  full_name = coalesce(excluded.full_name, public.profiles.full_name),
  avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
  updated_at = timezone('utc', now());
