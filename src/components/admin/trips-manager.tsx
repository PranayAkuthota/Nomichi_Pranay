"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Lock, Unlock, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { tripSchema, type TripFormValues } from "@/lib/validations";
import { createTrip, updateTrip, setTripStatus } from "@/lib/actions/trips";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { Trip } from "@/types/database";

interface Props {
  trips: Trip[];
}

export function TripsManager({ trips }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const {
    register, handleSubmit, setValue, reset,
    formState: { errors, isSubmitting },
  } = useForm<TripFormValues>({ resolver: zodResolver(tripSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ status: "open" });
    setOpen(true);
  };

  const openEdit = (trip: Trip) => {
    setEditing(trip);
    reset({
      name: trip.name,
      destination: trip.destination,
      start_date: trip.start_date,
      end_date: trip.end_date,
      price_including_gst: trip.price_including_gst,
      total_seats: trip.total_seats,
      status: trip.status,
      description: trip.description,
    });
    setOpen(true);
  };

  const onSubmit = async (data: TripFormValues) => {
    const result = editing
      ? await updateTrip(editing.id, data)
      : await createTrip(data);
    if (result.error) { toast.error(result.error); return; }
    toast.success(editing ? "Trip updated" : "Trip created");
    setOpen(false);
    reset();
  };

  const handleToggleStatus = async (trip: Trip) => {
    setPending(trip.id);
    const newStatus = trip.status === "open" ? "closed" : "open";
    const result = await setTripStatus(trip.id, newStatus);
    if (result.error) toast.error(result.error);
    else toast.success(`Trip ${newStatus === "open" ? "reopened" : "closed"}`);
    setPending(null);
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          New trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-sand rounded-2xl bg-white">
          <p className="text-ink/40">No trips yet.</p>
          <p className="text-ink/25 text-sm mt-1">Create your first trip above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-sand/30 overflow-hidden"
            >
              <div className={`h-1.5 ${trip.status === "open" ? "bg-rust" : "bg-gray-200"}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-ink">{trip.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rust/60" />
                      <span className="text-xs text-ink/50">{trip.destination}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    trip.status === "open"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {trip.status === "open" ? "Open" : "Closed"}
                  </span>
                </div>

                <p className="text-sm text-ink/60 leading-relaxed mb-4 line-clamp-2">
                  {trip.description}
                </p>

                <div className="flex gap-4 text-xs text-ink/50 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateRange(trip.start_date, trip.end_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {trip.total_seats} seats
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sand/20">
                  <p className="font-semibold text-ink">{formatCurrency(trip.price_including_gst)}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(trip)}
                      disabled={pending === trip.id}
                    >
                      {pending === trip.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : trip.status === "open" ? (
                        <><Lock className="w-3 h-3" /> Close</>
                      ) : (
                        <><Unlock className="w-3 h-3" /> Reopen</>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(trip)}>
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit trip" : "New trip"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Trip name</Label>
              <Input placeholder="Spiti in Winter" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Destination</Label>
              <Input placeholder="Spiti Valley, Himachal Pradesh" {...register("destination")} />
              {errors.destination && <p className="text-red-500 text-xs">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input type="date" {...register("start_date")} />
                {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>End date</Label>
                <Input type="date" {...register("end_date")} />
                {errors.end_date && <p className="text-red-500 text-xs">{errors.end_date.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price incl. GST (INR)</Label>
                <Input type="number" placeholder="38500" {...register("price_including_gst")} />
                {errors.price_including_gst && <p className="text-red-500 text-xs">{errors.price_including_gst.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Total seats</Label>
                <Input type="number" placeholder="8" {...register("total_seats")} />
                {errors.total_seats && <p className="text-red-500 text-xs">{errors.total_seats.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue={editing?.status ?? "open"}
                onValueChange={(v) => setValue("status", v as "open" | "closed")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Ten days in a frozen valley..."
                rows={4}
                className="resize-none"
                {...register("description")}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? "Save changes" : "Create trip"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
