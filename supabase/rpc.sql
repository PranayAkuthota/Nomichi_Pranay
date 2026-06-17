-- RPC functions for dashboard aggregates
-- Run this after schema.sql

create or replace function leads_by_status()
returns table(status text, count bigint)
language sql stable as $$
  select status, count(*) from leads group by status order by count desc;
$$;

create or replace function leads_by_trip()
returns table(trip_name text, count bigint)
language sql stable as $$
  select t.name as trip_name, count(l.id) as count
  from trips t
  left join leads l on l.trip_id = t.id
  group by t.id, t.name
  order by count desc;
$$;
