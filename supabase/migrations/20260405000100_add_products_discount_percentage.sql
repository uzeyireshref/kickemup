alter table public.products
add column if not exists discount_percentage integer;

alter table public.products
alter column discount_percentage set default 0;

update public.products
set discount_percentage = 0
where discount_percentage is null;

alter table public.products
alter column discount_percentage set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_discount_percentage_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
    add constraint products_discount_percentage_check
    check (discount_percentage between 0 and 100);
  end if;
end $$;
