create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  address text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text not null,
  price numeric(10,2) not null default 0,
  quantity integer not null default 0,
  category text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_id uuid not null references public.items(id),
  quantity integer not null default 1,
  status text not null check (status in ('Noted', 'Shipping', 'Completed')) default 'Noted',
  receipt_url text not null,
  full_name text not null,
  address text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_history (
  id uuid primary key default gen_random_uuid(),
  original_order_id uuid not null,
  user_id uuid,
  item_id uuid,
  quantity integer not null,
  status text not null,
  receipt_url text not null,
  full_name text not null,
  address text not null,
  phone text not null,
  created_at timestamptz not null,
  deleted_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, address, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.items enable row level security;
alter table public.orders enable row level security;
alter table public.chats enable row level security;
alter table public.reviews enable row level security;
alter table public.categories enable row level security;
alter table public.order_history enable row level security;

create policy "profiles readable by authenticated users"
on public.users for select
to authenticated
using (true);

create policy "users can update own profile"
on public.users for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "items readable by everyone"
on public.items for select
to anon, authenticated
using (true);

create policy "admins manage items"
on public.items for all
to authenticated
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy "categories readable by everyone"
on public.categories for select
to anon, authenticated
using (true);

create policy "admins manage categories"
on public.categories for all
to authenticated
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy "users can view own orders or admins view all"
on public.orders for select
to authenticated
using (auth.uid() = user_id or exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy "users can create own orders"
on public.orders for insert
to authenticated
with check (auth.uid() = user_id);

create policy "admins update or delete orders"
on public.orders for update
to authenticated
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy "admins delete orders"
on public.orders for delete
to authenticated
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy "users view related chats"
on public.chats for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = chats.order_id
      and (public.orders.user_id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and is_admin = true))
  )
);

create policy "users can create related chats"
on public.chats for insert
to authenticated
with check (
  auth.uid() = sender_id and exists (
    select 1
    from public.orders
    where public.orders.id = chats.order_id
      and (public.orders.user_id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and is_admin = true))
  )
);

create policy "reviews readable by everyone"
on public.reviews for select
to anon, authenticated
using (true);

create policy "admins manage reviews"
on public.reviews for all
to authenticated
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

create policy "admins manage order history"
on public.order_history for all
to authenticated
using (exists (select 1 from public.users where id = auth.uid() and is_admin = true))
with check (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

insert into storage.buckets (id, name, public)
values ('items', 'items', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

create policy "items bucket readable"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('items', 'receipts', 'reviews'));

create policy "authenticated upload receipts"
on storage.objects for insert
to authenticated
with check (bucket_id = 'receipts');

create policy "authenticated upload items and reviews if admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('items', 'reviews')
  and exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

do $$
begin
  begin
    alter publication supabase_realtime add table public.chats;
  exception
    when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.orders;
  exception
    when duplicate_object then null;
  end;
end $$;
