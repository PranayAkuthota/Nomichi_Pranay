-- ============================================================
-- Nomichi Trip Desk · Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text not null,
  avatar_url  text,
  role        text not null default 'associate' check (role in ('admin', 'associate')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- TRIPS
-- ============================================================
create table public.trips (
  id                    uuid primary key default uuid_generate_v4(),
  name                  text not null,
  destination           text not null,
  start_date            date not null,
  end_date              date not null,
  price_including_gst   numeric(10, 2) not null check (price_including_gst > 0),
  total_seats           integer not null check (total_seats > 0),
  status                text not null default 'open' check (status in ('open', 'closed')),
  description           text not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_trips_status on public.trips(status);

-- ============================================================
-- LEADS
-- ============================================================
create table public.leads (
  id                    uuid primary key default uuid_generate_v4(),
  trip_id               uuid not null references public.trips(id) on delete restrict,
  owner_id              uuid references public.users(id) on delete set null,
  name                  text not null,
  email                 text not null,
  phone                 text not null,
  group_type            text not null check (group_type in ('solo', 'friends', 'couple', 'family')),
  preferred_month       text not null,
  trip_feeling          text not null,
  status                text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'QUALIFIED', 'VIBE_CHECK_SENT', 'CONFIRMED', 'NOT_A_FIT')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_leads_trip_id    on public.leads(trip_id);
create index idx_leads_owner_id   on public.leads(owner_id);
create index idx_leads_status     on public.leads(status);
create index idx_leads_created_at on public.leads(created_at desc);

-- ============================================================
-- TOUCHPOINTS (call log / notes)
-- ============================================================
create table public.touchpoints (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  author_id   uuid references public.users(id) on delete set null,
  content     text not null,
  created_at  timestamptz not null default now()
);

create index idx_touchpoints_lead_id    on public.touchpoints(lead_id);
create index idx_touchpoints_created_at on public.touchpoints(created_at desc);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
create table public.activity_logs (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  actor_id    uuid references public.users(id) on delete set null,
  action      text not null check (action in ('STATUS_CHANGED', 'OWNER_ASSIGNED', 'NOTE_ADDED', 'TRIP_UPDATED', 'LEAD_CREATED')),
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index idx_activity_logs_lead_id    on public.activity_logs(lead_id);
create index idx_activity_logs_created_at on public.activity_logs(created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger set_trips_updated_at
  before update on public.trips
  for each row execute function public.set_updated_at();

create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users         enable row level security;
alter table public.trips         enable row level security;
alter table public.leads         enable row level security;
alter table public.touchpoints   enable row level security;
alter table public.activity_logs enable row level security;

-- Trips: public can read open trips; authenticated can do anything
create policy "Public can read open trips"
  on public.trips for select
  using (status = 'open');

create policy "Authenticated can manage trips"
  on public.trips for all
  using (auth.role() = 'authenticated');

-- Leads: only authenticated users
create policy "Authenticated can manage leads"
  on public.leads for all
  using (auth.role() = 'authenticated');

-- Allow public to INSERT leads (enquiry form)
create policy "Public can create leads"
  on public.leads for insert
  with check (true);

-- Touchpoints
create policy "Authenticated can manage touchpoints"
  on public.touchpoints for all
  using (auth.role() = 'authenticated');

-- Activity logs
create policy "Authenticated can read activity logs"
  on public.activity_logs for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can insert activity logs"
  on public.activity_logs for insert
  with check (auth.role() = 'authenticated');

-- Users: can read all, can update own
create policy "Authenticated can read users"
  on public.users for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);
