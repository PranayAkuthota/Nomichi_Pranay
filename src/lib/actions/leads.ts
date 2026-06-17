"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types/database";

export async function createLead(data: {
  trip_id: string;
  name: string;
  email: string;
  phone: string;
  group_type: string;
  preferred_month: string;
  trip_feeling: string;
}) {
  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .insert(data)
    .select()
    .single();

  if (error) {
    return { error: "Could not save your enquiry. Please try again." };
  }

  // Log activity
  await supabase.from("activity_logs").insert({
    lead_id: lead.id,
    action: "LEAD_CREATED",
    metadata: { source: "enquiry_form" },
  });

  return { success: true, lead };
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createClient();

  const { data: existingLead, error: fetchError } = await supabase
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .single();

  if (fetchError) return { error: "Lead not found" };

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) return { error: "Could not update status" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("activity_logs").insert({
    lead_id: leadId,
    actor_id: user?.id ?? null,
    action: "STATUS_CHANGED",
    metadata: { from: existingLead.status, to: status },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  return { success: true };
}

export async function updateLeadOwner(leadId: string, ownerId: string | null) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .update({ owner_id: ownerId })
    .eq("id", leadId);

  if (error) return { error: "Could not assign owner" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let ownerName = "Unassigned";
  if (ownerId) {
    const { data: owner } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", ownerId)
      .single();
    if (owner) ownerName = owner.full_name;
  }

  await supabase.from("activity_logs").insert({
    lead_id: leadId,
    actor_id: user?.id ?? null,
    action: "OWNER_ASSIGNED",
    metadata: { owner_name: ownerName },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");

  return { success: true };
}

export async function addTouchpoint(leadId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("touchpoints").insert({
    lead_id: leadId,
    author_id: user?.id ?? null,
    content,
  });

  if (error) return { error: "Could not save note" };

  await supabase.from("activity_logs").insert({
    lead_id: leadId,
    actor_id: user?.id ?? null,
    action: "NOTE_ADDED",
    metadata: { preview: content.slice(0, 80) },
  });

  revalidatePath(`/admin/leads/${leadId}`);

  return { success: true };
}
