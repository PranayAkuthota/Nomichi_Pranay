"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Send, Sparkles, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { touchpointSchema, type TouchpointFormValues } from "@/lib/validations";
import { updateLeadStatus, updateLeadOwner, addTouchpoint } from "@/lib/actions/leads";
import {
  STATUS_LABELS, STATUS_COLORS, PIPELINE_ORDER, formatRelativeTime, formatDate,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { LeadWithRelations, Touchpoint, ActivityLog, User, LeadStatus } from "@/types/database";

interface Props {
  lead: LeadWithRelations;
  touchpoints: Touchpoint[];
  activityLogs: ActivityLog[];
  users: User[];
  trips: { id: string; name: string }[];
}

export function LeadDetailClient({ lead, touchpoints, activityLogs, users }: Props) {
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [, startTransition] = useTransition();

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } =
    useForm<TouchpointFormValues>({ resolver: zodResolver(touchpointSchema) });

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      const result = await updateLeadStatus(lead.id, status as LeadStatus);
      if (result.error) toast.error(result.error);
      else toast.success(`Status updated to ${STATUS_LABELS[status as LeadStatus]}`);
    });
  };

  const handleOwnerChange = (ownerId: string) => {
    startTransition(async () => {
      const val = ownerId === "unassigned" ? null : ownerId;
      const result = await updateLeadOwner(lead.id, val);
      if (result.error) toast.error(result.error);
      else toast.success("Owner updated");
    });
  };

  const onAddNote = async (data: TouchpointFormValues) => {
    const result = await addTouchpoint(lead.id, data.content);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Note saved");
    reset();
  };

  const generateAiMessage = async () => {
    setAiLoading(true);
    setAiMessage(null);
    try {
      const res = await fetch("/api/ai/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traveller_name: lead.name,
          trip_name: lead.trip?.name,
          trip_destination: lead.trip?.destination,
          trip_dates: lead.trip ? `${lead.trip.start_date} to ${lead.trip.end_date}` : "",
          trip_feeling: lead.trip_feeling,
          group_type: lead.group_type,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setAiMessage(json.message);
    } catch {
      toast.error("Could not generate message. Check your OpenAI key.");
    } finally {
      setAiLoading(false);
    }
  };

  const noteContent = watch("content");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left col — traveller + trip info */}
      <div className="lg:col-span-1 space-y-4">
        {/* Traveller */}
        <div className="bg-white rounded-2xl border border-sand/30 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-4">Traveller</h2>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Name" value={lead.name} />
            <InfoRow label="Email" value={<a href={`mailto:${lead.email}`} className="text-rust hover:underline">{lead.email}</a>} />
            <InfoRow label="Phone" value={<a href={`tel:${lead.phone}`} className="text-rust hover:underline">{lead.phone}</a>} />
            <InfoRow label="Group" value={<span className="capitalize">{lead.group_type}</span>} />
            <InfoRow label="Preferred month" value={lead.preferred_month} />
          </dl>
        </div>

        {/* Trip feeling */}
        <div className="bg-white rounded-2xl border border-sand/30 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-3">What they said</h2>
          <p className="text-sm text-ink/70 leading-relaxed italic">&ldquo;{lead.trip_feeling}&rdquo;</p>
        </div>

        {/* Trip */}
        {lead.trip && (
          <div className="bg-white rounded-2xl border border-sand/30 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-4">Trip</h2>
            <dl className="space-y-3 text-sm">
              <InfoRow label="Name" value={lead.trip.name} />
              <InfoRow label="Destination" value={lead.trip.destination} />
              <InfoRow label="Dates" value={`${formatDate(lead.trip.start_date)} – ${formatDate(lead.trip.end_date)}`} />
            </dl>
          </div>
        )}

        {/* Status + Owner */}
        <div className="bg-white rounded-2xl border border-sand/30 p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40">Pipeline</h2>

          <div className="space-y-2">
            <p className="text-xs text-ink/50 font-medium">Status</p>
            <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-ink/50 font-medium">Owner</p>
            <Select defaultValue={lead.owner_id ?? "unassigned"} onValueChange={handleOwnerChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI WhatsApp */}
        <div className="bg-olive/5 border border-olive/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-olive" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-olive">AI assist</h2>
          </div>
          <p className="text-xs text-ink/50 mb-4 leading-relaxed">
            Draft a first WhatsApp message based on this traveller&apos;s enquiry.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-olive/30 text-olive hover:bg-olive/10"
            onClick={generateAiMessage}
            disabled={aiLoading}
          >
            {aiLoading ? <><Loader2 className="w-3 h-3 animate-spin" /> Drafting</> : "Draft message"}
          </Button>
          {aiMessage && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-olive/20 text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">
              {aiMessage}
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 w-full text-xs text-ink/40 hover:text-ink"
                onClick={() => { navigator.clipboard.writeText(aiMessage); toast.success("Copied"); }}
              >
                Copy to clipboard
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right col — notes + timeline */}
      <div className="lg:col-span-2 space-y-4">
        {/* Add note */}
        <div className="bg-white rounded-2xl border border-sand/30 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-4">Add note</h2>
          <form onSubmit={handleSubmit(onAddNote)} className="space-y-3">
            <Textarea
              placeholder="What was said, what to do next..."
              rows={3}
              className="resize-none"
              {...register("content")}
            />
            <div className="flex items-center justify-between">
              {errors.content
                ? <p className="text-red-500 text-xs">{errors.content.message}</p>
                : <p className="text-ink/25 text-xs">{noteContent?.length ?? 0}/2000</p>
              }
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Save note
              </Button>
            </div>
          </form>
        </div>

        {/* Call log */}
        <div className="bg-white rounded-2xl border border-sand/30 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-4">
            Call log ({touchpoints.length})
          </h2>
          {touchpoints.length === 0 ? (
            <p className="text-ink/30 text-sm text-center py-8">No notes yet. Add the first one above.</p>
          ) : (
            <div className="space-y-4">
              {touchpoints.map((tp) => (
                <div key={tp.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-rust mt-1.5 shrink-0" />
                    <div className="w-px flex-1 bg-sand/40 mt-2" />
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <p className="text-sm text-ink/80 leading-relaxed">{tp.content}</p>
                    <p className="text-xs text-ink/30 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(tp.created_at)}
                      {tp.author && <> · {(tp.author as { full_name: string }).full_name}</>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity timeline */}
        <div className="bg-white rounded-2xl border border-sand/30 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-4">
            Activity timeline
          </h2>
          {activityLogs.length === 0 ? (
            <p className="text-ink/30 text-sm text-center py-8">No activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-sand/20 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-sand mt-2 shrink-0" />
                  <div>
                    <ActivityText log={log} />
                    <p className="text-xs text-ink/30 mt-0.5">{formatRelativeTime(log.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-ink/40 shrink-0">{label}</dt>
      <dd className="text-ink font-medium text-right">{value}</dd>
    </div>
  );
}

function ActivityText({ log }: { log: ActivityLog }) {
  const actor = (log.actor as { full_name: string } | null)?.full_name ?? "System";
  const meta = log.metadata;

  switch (log.action) {
    case "STATUS_CHANGED":
      return (
        <p className="text-sm text-ink/70">
          <span className="font-medium text-ink">{actor}</span> changed status from{" "}
          <Badge className={`text-xs border mx-0.5 ${STATUS_COLORS[meta.from as LeadStatus]}`} variant="outline">
            {STATUS_LABELS[meta.from as LeadStatus]}
          </Badge>
          to{" "}
          <Badge className={`text-xs border mx-0.5 ${STATUS_COLORS[meta.to as LeadStatus]}`} variant="outline">
            {STATUS_LABELS[meta.to as LeadStatus]}
          </Badge>
        </p>
      );
    case "OWNER_ASSIGNED":
      return (
        <p className="text-sm text-ink/70">
          Assigned to <span className="font-medium text-ink">{meta.owner_name}</span>
        </p>
      );
    case "NOTE_ADDED":
      return (
        <p className="text-sm text-ink/70">
          <span className="font-medium text-ink">{actor}</span> added a note
        </p>
      );
    case "LEAD_CREATED":
      return <p className="text-sm text-ink/70">Lead created from enquiry form</p>;
    default:
      return <p className="text-sm text-ink/70">{log.action}</p>;
  }
}
