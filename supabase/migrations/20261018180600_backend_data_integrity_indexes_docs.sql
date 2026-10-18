-- updated_at is maintained by the database, not by whichever app code remembers to set it.
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger banners_set_updated_at before update on public.banners
  for each row execute function public.set_updated_at();

-- Bad data is rejected by the database itself, whatever the client sends.
alter table public.products
  add constraint products_price_non_negative check (price >= 0),
  add constraint products_name_not_blank check (char_length(btrim(name)) > 0),
  add constraint products_unit_not_blank check (char_length(btrim(unit)) > 0),
  add constraint products_slug_format check (slug ~ '^[a-z0-9][a-z0-9_-]*$');

alter table public.banners
  add constraint banners_image_not_blank check (char_length(btrim(image)) > 0);

alter table public.orders
  add constraint orders_status_valid check (status in ('novo','em atendimento','fechado','perdido')),
  add constraint orders_subtotal_non_negative check (subtotal >= 0),
  add constraint orders_items_is_array check (jsonb_typeof(items) = 'array'),
  add constraint orders_customer_name_len check (char_length(customer_name) <= 120),
  add constraint orders_payment_len check (char_length(payment_method) <= 40),
  add constraint orders_delivery_len check (char_length(delivery_method) <= 40),
  add constraint orders_address_len check (
    char_length(address_street) <= 200 and char_length(address_number) <= 20
    and char_length(address_cep) <= 20 and char_length(address_reference) <= 200),
  add constraint orders_utm_len check (
    char_length(utm_source) <= 120 and char_length(utm_medium) <= 120 and char_length(utm_campaign) <= 120);

-- Index for the admin's order list (the catalog and banners are small enough not to need one).
create index orders_created_idx on public.orders (created_at desc);

-- Housekeeping: visitor analytics older than N days can be purged on demand.
create or replace function private.purge_old_site_events(keep_days int default 180)
returns bigint language plpgsql security definer set search_path = '' as $$
declare removed bigint;
begin
  delete from public.site_events where created_at < now() - make_interval(days => keep_days);
  get diagnostics removed = row_count;
  return removed;
end $$;
revoke all on function private.purge_old_site_events(int) from public, anon, authenticated;

-- Documentation lives next to the data.
comment on table public.products is 'Store catalog. Public can read active rows; only admins write. Prices are per unit (m² for floors/tiles).';
comment on column public.products.featured is 'Shown in the home page offers carousel (with the OFERTA ribbon).';
comment on column public.products.source is 'Where the row came from (e.g. spreadsheet import); null for manual entries.';
comment on column public.products.specs is 'Extra characteristics as [{label,value}], used to build the department filters.';
comment on table public.orders is 'Quotes sent through the site. Anyone can insert (status=novo); only admins read/update.';
comment on table public.banners is 'Home page banners by placement: hero, secondary, offers, duo.';
comment on table public.profiles is 'One row per auth user; role decides admin access.';
comment on table public.site_events is 'Anonymous visitor behaviour (visit, product_view, add_to_cart, cart_open, whatsapp_click, search). Insert-only for the public.';
