import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LeadDetailClient } from "@/components/admin/lead-detail-client";
import { formatDate, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { LeadWithRelations, Touchpoint, ActivityLog, User } from "@/types/database";

async function getLeadData(id: string) {
  const supabase = await createClient();

  const [
    { data: lead },
    { data: touchpoints },
    { data: activityLogs },
    { data: users },
    { data: trips },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*, trip:trips(*), owner:users(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("touchpoints")
      .select("*, author:users(full_name, id)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("activity_logs")
      .select("*, actor:users(full_name)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("users").select("*").order("full_name"),
    supabase.from("trips").select("*").eq("status", "open").order("name"),
  ]);

  return {
    lead: lead as LeadWithRelations | null,
    touchpoints: (touchpoints as Touchpoint[]) ?? [],
    activityLogs: (activityLogs as ActivityLog[]) ?? [],
    users: (users as User[]) ?? [],
    trips: trips ?? [],
  };
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { lead, touchpoints, activityLogs, users, trips } = await getLeadData(id);

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/leads"
          className="flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Leads
        </Link>
        <span className="text-ink/20">/</span>
        <span className="text-sm font-medium text-ink">{lead.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{lead.name}</h1>
          <p className="text-ink/50 text-sm mt-1">
            Enquired {formatDate(lead.created_at)} · {lead.trip?.name}
          </p>
        </div>
        <Badge
          className={`text-sm border px-3 py-1.5 ${STATUS_COLORS[lead.status]}`}
          variant="outline"
        >
          {STATUS_LABELS[lead.status]}
        </Badge>
      </div>

      <LeadDetailClient
        lead={lead}
        touchpoints={touchpoints}
        activityLogs={activityLogs}
        users={users}
        trips={trips}
      />
    </div>
  );
}
