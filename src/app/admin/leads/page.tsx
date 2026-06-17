import { createClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/admin/leads-table";
import type { LeadWithRelations, User, Trip } from "@/types/database";

interface SearchParams {
  search?: string;
  status?: string;
  trip?: string;
  owner?: string;
  page?: string;
  sort?: string;
  dir?: string;
}

const PAGE_SIZE = 20;

async function getLeads(params: SearchParams): Promise<{
  leads: LeadWithRelations[];
  total: number;
  trips: Trip[];
  users: User[];
}> {
  const supabase = await createClient();
  const page = Math.max(1, Number(params.page ?? 1));
  const from = (page - 1) * PAGE_SIZE;
  const sortCol = params.sort ?? "created_at";
  const ascending = params.dir === "asc";

  let query = supabase
    .from("leads")
    .select("*, trip:trips(*), owner:users(*)", { count: "exact" });

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`
    );
  }
  if (params.status) query = query.eq("status", params.status);
  if (params.trip) query = query.eq("trip_id", params.trip);
  if (params.owner) query = query.eq("owner_id", params.owner);

  query = query
    .order(sortCol, { ascending })
    .range(from, from + PAGE_SIZE - 1);

  const { data, count } = await query;

  const [{ data: trips }, { data: users }] = await Promise.all([
    supabase.from("trips").select("*").order("name"),
    supabase.from("users").select("*").order("full_name"),
  ]);

  return {
    leads: (data as LeadWithRelations[]) ?? [],
    total: count ?? 0,
    trips: trips ?? [],
    users: users ?? [],
  };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { leads, total, trips, users } = await getLeads(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Leads</h1>
          <p className="text-ink/50 text-sm mt-1">{total} total</p>
        </div>
      </div>

      <LeadsTable
        leads={leads}
        total={total}
        pageSize={PAGE_SIZE}
        trips={trips}
        users={users}
        currentParams={params as Record<string, string | undefined>}
      />
    </div>
  );
}
