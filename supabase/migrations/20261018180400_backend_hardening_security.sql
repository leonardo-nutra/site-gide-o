-- 1) Admin check lives in a private schema: not exposed as an API endpoint (/rest/v1/rpc).
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

-- 2) Re-create every policy on top of private.is_admin() (evaluated once per query).
drop policy "admins can manage products" on public.products;
create policy "admins can manage products" on public.products
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy "admins can manage banners" on public.banners;
create policy "admins can manage banners" on public.banners
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy "admins can read orders" on public.orders;
drop policy "admins can update orders" on public.orders;
drop policy "anyone can submit an order" on public.orders;
create policy "admins can read orders" on public.orders
  for select to authenticated using ((select private.is_admin()));
create policy "admins can update orders" on public.orders
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
-- Visitors may only create brand-new, well-formed orders.
create policy "visitors can submit an order" on public.orders
  for insert to anon, authenticated
  with check (
    status = 'novo'
    and subtotal >= 0
    and jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 100
  );

drop policy "admins can read events" on public.site_events;
create policy "admins can read events" on public.site_events
  for select to authenticated using ((select private.is_admin()));

-- 3) SECURITY FIX: any signed-in customer could upload/replace/delete product photos.
drop policy "Authenticated delete product-media" on storage.objects;
drop policy "Authenticated update product-media" on storage.objects;
drop policy "Authenticated upload product-media" on storage.objects;
create policy "Admins upload product-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-media' and (select private.is_admin()));
create policy "Admins update product-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-media' and (select private.is_admin()))
  with check (bucket_id = 'product-media' and (select private.is_admin()));
create policy "Admins delete product-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-media' and (select private.is_admin()));

-- 4) Profiles: authenticated only, auth.uid() evaluated once.
drop policy "Users can update own profile" on public.profiles;
drop policy "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Users can update own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role = 'customer');

-- 5) Analytics functions run as the caller (RLS keeps them admin-only).
create or replace function public.site_funnel_daily(days int default 14)
returns table (day date, visitors bigint, product_viewers bigint, adders bigint, cart_openers bigint, whatsapp_clickers bigint, mobile_visitors bigint)
language plpgsql security invoker set search_path = ''
as $$
begin
  if not (select private.is_admin()) then raise exception 'not allowed'; end if;
  return query
  select (e.created_at at time zone 'America/Sao_Paulo')::date,
    count(distinct e.session_id) filter (where e.event = 'visit'),
    count(distinct e.session_id) filter (where e.event = 'product_view'),
    count(distinct e.session_id) filter (where e.event = 'add_to_cart'),
    count(distinct e.session_id) filter (where e.event = 'cart_open'),
    count(distinct e.session_id) filter (where e.event = 'whatsapp_click'),
    count(distinct e.session_id) filter (where e.event = 'visit' and e.device = 'mobile')
  from public.site_events e
  where e.created_at >= now() - make_interval(days => days)
  group by 1 order by 1 desc;
end $$;

create or replace function public.site_top_products(days int default 14)
returns table (product_id text, product_name text, views bigint, adds bigint)
language plpgsql security invoker set search_path = ''
as $$
begin
  if not (select private.is_admin()) then raise exception 'not allowed'; end if;
  return query
  select e.product_id, max(e.product_name),
    count(*) filter (where e.event = 'product_view'),
    count(*) filter (where e.event = 'add_to_cart')
  from public.site_events e
  where e.event in ('product_view','add_to_cart') and e.product_id is not null
    and e.created_at >= now() - make_interval(days => days)
  group by e.product_id order by 3 desc, 4 desc limit 20;
end $$;

create or replace function public.site_top_searches(days int default 14)
returns table (term text, searches bigint, avg_results numeric)
language plpgsql security invoker set search_path = ''
as $$
begin
  if not (select private.is_admin()) then raise exception 'not allowed'; end if;
  return query
  select lower(e.query), count(*), round(avg(e.value), 0)
  from public.site_events e
  where e.event = 'search' and e.query is not null
    and e.created_at >= now() - make_interval(days => days)
  group by 1 order by 2 desc limit 20;
end $$;

revoke all on function public.site_funnel_daily(int), public.site_top_products(int), public.site_top_searches(int) from public, anon;
grant execute on function public.site_funnel_daily(int), public.site_top_products(int), public.site_top_searches(int) to authenticated;

-- 6) The old public function is no longer used by anything.
drop function public.is_admin();
