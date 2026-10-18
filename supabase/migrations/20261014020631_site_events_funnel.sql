-- Anonymous visitor behaviour on the site (what they look at, add, search, click).
-- NOTE: the three site_* functions were later replaced by 20261018180400_backend_hardening_security.sql.
create table public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id text not null check (char_length(session_id) between 8 and 64),
  event text not null check (event in ('visit','product_view','add_to_cart','cart_open','whatsapp_click','search')),
  path text check (char_length(path) <= 200),
  product_id text check (char_length(product_id) <= 120),
  product_name text check (char_length(product_name) <= 200),
  query text check (char_length(query) <= 80),
  value numeric,
  device text check (device in ('mobile','desktop')),
  utm_source text check (char_length(utm_source) <= 80),
  utm_medium text check (char_length(utm_medium) <= 80),
  utm_campaign text check (char_length(utm_campaign) <= 120)
);

create index site_events_created_idx on public.site_events (created_at desc);
create index site_events_event_idx on public.site_events (event, created_at desc);

alter table public.site_events enable row level security;

-- Anyone visiting the site may write an event, but nobody reads them from the browser.
create policy "visitors can log events" on public.site_events
  for insert to anon, authenticated with check (true);
