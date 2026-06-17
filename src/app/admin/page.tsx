import { createClient } from "@/lib/supabase/server";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { formatRelativeTime, STATUS_LABELS } from "@/lib/utils";
import type { LeadStatus } from "@/types/database";

async function getDashboardData() {
  const supabase = await createClient();

  const [
    { count: totalLeads },
    { count: confirmedLeads },
    { count: newLeads },
    { count: notAFitLeads },
    { data: byStatus },
    { data: byTrip },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "CONFIRMED"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "NEW"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "NOT_A_FIT"),
    supabase.rpc("leads_by_status").select(),
    supabase.rpc("leads_by_trip").select(),
    supabase
      .from("activity_logs")
      .select("*, actor:users(full_name), lead:leads(name)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    totalLeads: totalLeads ?? 0,
    confirmedLeads: confirmedLeads ?? 0,
    newLeads: newLeads ?? 0,
    notAFitLeads: notAFitLeads ?? 0,
    byStatus: byStatus ?? [],
    byTrip: byTrip ?? [],
    recentActivity: recentActivity ?? [],
  };
}

const statCards = [
  { key: "totalLeads", label: "Total leads", color: "text-ink" },
  { key: "confirmedLeads", label: "Confirmed", color: "text-green-600" },
  { key: "newLeads", label: "New", color: "text-blue-600" },
  { key: "notAFitLeads", label: "Not a fit", color: "text-gray-400" },
] as const;

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink/50 text-sm mt-1">A quick look at where things stand.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, color }) => (
          <div key={key} className="bg-white rounded-2xl border border-sand/30 p-6">
            <p className="text-xs text-ink/40 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-4xl font-bold ${color}`}>{data[key]}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts byStatus={data.byStatus} byTrip={data.byTrip} />

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-sand/30 p-6">
        <h2 className="text-sm font-semibold text-ink mb-4">Recent activity</h2>
        {data.recentActivity.length === 0 ? (
          <p className="text-ink/40 text-sm py-6 text-center">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {data.recentActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-sand/20 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-rust mt-2 shrink-0" />
                <div className="min-w-0">
                  <ActivityLabel log={log} />
                  <p className="text-xs text-ink/30 mt-0.5">
                    {formatRelativeTime(log.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityLabel({ log }: { log: { action: string; metadata: Record<string, string>; actor?: { full_name: string } | null; lead?: { name: string } | null } }) {
  const actor = log.actor?.full_name ?? "Someone";
  const lead = log.lead?.name ?? "a lead";
  const meta = log.metadata;

  switch (log.action) {
    case "STATUS_CHANGED":
      return (
        <p className="text-sm text-ink/70">
          <span className="font-medium text-ink">{actor}</span> moved{" "}
          <span className="font-medium text-ink">{lead}</span> from{" "}
          {STATUS_LABELS[meta.from as LeadStatus]} to{" "}
          <span className="text-rust font-medium">{STATUS_LABELS[meta.to as LeadStatus]}</span>
        </p>
      );
    case "NOTE_ADDED":
      return (
        <p className="text-sm text-ink/70">
          <span className="font-medium text-ink">{actor}</span> added a note to{" "}
          <span className="font-medium text-ink">{lead}</span>
        </p>
      );
    case "OWNER_ASSIGNED":
      return (
        <p className="text-sm text-ink/70">
          <span className="font-medium text-ink">{lead}</span> was assigned to{" "}
          <span className="font-medium text-ink">{meta.owner_name}</span>
        </p>
      );
    case "LEAD_CREATED":
      return (
        <p className="text-sm text-ink/70">
          New enquiry from <span className="font-medium text-ink">{lead}</span>
        </p>
      );
    default:
      return <p className="text-sm text-ink/70">{log.action}</p>;
  }
}
