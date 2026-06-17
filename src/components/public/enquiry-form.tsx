"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { enquirySchema, type EnquiryFormValues } from "@/lib/validations";
import { createLead } from "@/lib/actions/leads";
import { MONTHS } from "@/lib/utils";
import type { Trip } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface EnquiryFormProps {
  trips: Trip[];
}

export function EnquiryForm({ trips }: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    const result = await createLead(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-12 h-12 text-rust mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-cream mb-3">We have your enquiry.</h3>
        <p className="text-cream/50 max-w-sm mx-auto leading-relaxed">
          We read every message ourselves. You will hear back from us within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-cream/80">Your name</Label>
          <Input
            id="name"
            placeholder="Priya Menon"
            className="bg-white/5 border-white/10 text-cream placeholder:text-cream/30 focus-visible:ring-rust"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-cream/80">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            className="bg-white/5 border-white/10 text-cream placeholder:text-cream/30 focus-visible:ring-rust"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-cream/80">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="bg-white/5 border-white/10 text-cream placeholder:text-cream/30 focus-visible:ring-rust"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Trip */}
      <div className="space-y-2">
        <Label className="text-cream/80">Which trip</Label>
        {trips.length === 0 ? (
          <p className="text-cream/40 text-sm py-3">No trips currently open.</p>
        ) : (
          <Select onValueChange={(v) => setValue("trip_id", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-cream focus:ring-rust">
              <SelectValue placeholder="Select a trip" />
            </SelectTrigger>
            <SelectContent>
              {trips.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} · {t.destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.trip_id && (
          <p className="text-red-400 text-xs">{errors.trip_id.message}</p>
        )}
      </div>

      {/* Group type + Month */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-cream/80">Travelling as</Label>
          <Select onValueChange={(v) => setValue("group_type", v as EnquiryFormValues["group_type"])}>
            <SelectTrigger className="bg-white/5 border-white/10 text-cream focus:ring-rust">
              <SelectValue placeholder="Group type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="family">Family</SelectItem>
            </SelectContent>
          </Select>
          {errors.group_type && (
            <p className="text-red-400 text-xs">{errors.group_type.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-cream/80">Preferred month</Label>
          <Select onValueChange={(v) => setValue("preferred_month", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-cream focus:ring-rust">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferred_month && (
            <p className="text-red-400 text-xs">{errors.preferred_month.message}</p>
          )}
        </div>
      </div>

      {/* Trip feeling */}
      <div className="space-y-2">
        <Label htmlFor="trip_feeling" className="text-cream/80">
          What are you hoping this trip feels like?
        </Label>
        <Textarea
          id="trip_feeling"
          placeholder="I want to feel small and quiet. I need somewhere that resets me."
          rows={4}
          className="bg-white/5 border-white/10 text-cream placeholder:text-cream/30 focus-visible:ring-rust resize-none"
          {...register("trip_feeling")}
        />
        <div className="flex justify-between">
          {errors.trip_feeling ? (
            <p className="text-red-400 text-xs">{errors.trip_feeling.message}</p>
          ) : (
            <span />
          )}
          <p className="text-cream/20 text-xs">{watch("trip_feeling")?.length ?? 0}/1000</p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || trips.length === 0}
        className="w-full h-12 text-base font-semibold bg-rust hover:bg-rust/90 text-cream"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending</>
        ) : (
          "Send enquiry"
        )}
      </Button>
    </form>
  );
}
