create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint user_favorites_user_id_product_id_key unique (user_id, product_id)
);

create index if not exists user_favorites_user_id_idx on public.user_favorites (user_id);
create index if not exists user_favorites_product_id_idx on public.user_favorites (product_id);

alter table public.user_favorites enable row level security;

drop policy if exists "User favorites: owner can read" on public.user_favorites;
create policy "User favorites: owner can read"
on public.user_favorites
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "User favorites: owner can insert" on public.user_favorites;
create policy "User favorites: owner can insert"
on public.user_favorites
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "User favorites: owner can delete" on public.user_favorites;
create policy "User favorites: owner can delete"
on public.user_favorites
for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
