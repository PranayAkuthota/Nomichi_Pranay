import { createClient } from "@/lib/supabase/server";
import { TripsManager } from "@/components/admin/trips-manager";
import type { Trip } from "@/types/database";

async function getTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });
  return data ?? [];
}

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Trips</h1>
          <p className="text-ink/50 text-sm mt-1">{trips.length} trips total</p>
        </div>
      </div>
      <TripsManager trips={trips} />
    </div>
  );
}
