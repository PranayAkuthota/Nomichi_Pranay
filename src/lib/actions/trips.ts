"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TripFormValues } from "@/lib/validations";

export async function createTrip(data: TripFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.from("trips").insert(data);

  if (error) return { error: "Could not create trip" };

  revalidatePath("/admin/trips");
  revalidatePath("/");

  return { success: true };
}

export async function updateTrip(id: string, data: TripFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.from("trips").update(data).eq("id", id);

  if (error) return { error: "Could not update trip" };

  revalidatePath("/admin/trips");
  revalidatePath(`/admin/trips/${id}`);
  revalidatePath("/");

  return { success: true };
}

export async function setTripStatus(id: string, status: "open" | "closed") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("trips")
    .update({ status })
    .eq("id", id);

  if (error) return { error: "Could not update trip status" };

  revalidatePath("/admin/trips");
  revalidatePath("/");

  return { success: true };
}
