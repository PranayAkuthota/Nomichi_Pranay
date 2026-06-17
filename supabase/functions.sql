-- ============================================================
-- RPC functions for dashboard aggregations
-- Run this after schema.sql
-- ============================================================

create or replace function public.leads_by_status()
returns table(status text, count bigint)
language sql
security definer
as $$
  select status, count(*) as count
  from public.leads
  group by status
  order by count desc;
$$;

create or replace function public.leads_by_trip()
returns table(trip_name text, count bigint)
language sql
security definer
as $$
  select t.name as trip_name, count(l.id) as count
  from public.trips t
  left join public.leads l on l.trip_id = t.id
  group by t.id, t.name
  order by count desc;
$$;

grant execute on function public.leads_by_status() to authenticated;
grant execute on function public.leads_by_trip() to authenticated;
