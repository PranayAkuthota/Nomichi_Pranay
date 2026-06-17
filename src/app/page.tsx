import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Trip } from "@/types/database";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { EnquiryForm } from "@/components/public/enquiry-form";
import { MapPin, Calendar, Users } from "lucide-react";

async function getOpenTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "open")
    .order("start_date", { ascending: true });
  return data ?? [];
}

export default async function HomePage() {
  const trips = await getOpenTrips();

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-2xl font-bold tracking-tight text-rust">Nomichi</span>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-xs text-ink/50 tracking-widest uppercase">
            Wander · Connect · Belong
          </span>
          <Link
            href="/login"
            className="text-sm font-medium text-ink/70 hover:text-rust border border-sand/50 hover:border-rust/40 rounded-lg px-4 py-2 transition-colors"
          >
            Team login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-rust mb-4 font-medium">
          Slow travel, small groups
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-ink leading-[1.05] mb-6 text-balance">
          Travel that<br />
          <span className="text-rust">finds you.</span>
        </h1>
        <p className="text-lg text-ink/60 max-w-xl leading-relaxed">
          We design offbeat journeys for people who want a trip to feel personal.
          Every batch is small. Every place is chosen on purpose.
        </p>
      </section>

      {/* Trips */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <h2 className="text-xs tracking-widest uppercase text-ink/40 mb-8 font-medium">
          Open trips
        </h2>

        {trips.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-sand rounded-2xl">
            <p className="text-ink/40 text-lg">No trips open right now.</p>
            <p className="text-ink/30 text-sm mt-2">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* Enquiry Form */}
      <section
        id="enquire"
        className="px-6 py-20 bg-ink"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-rust mb-4 font-medium">
            Send an enquiry
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-3 leading-tight">
            Tell us where you want to go.
          </h2>
          <p className="text-cream/50 mb-12 leading-relaxed">
            We read every enquiry ourselves. We will get back to you within one working day.
          </p>
          <EnquiryForm trips={trips} />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-sand/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold text-rust">Nomichi</span>
          <p className="text-ink/40 text-sm">
            Nomichi Explorers Private Limited · thenomichi.com
          </p>
        </div>
      </footer>
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="group bg-white border border-sand/40 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Color band */}
      <div className="h-2 bg-rust" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-ink text-lg leading-tight">{trip.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-rust" />
              <span className="text-sm text-ink/50">{trip.destination}</span>
            </div>
          </div>
          <span className="text-xs bg-olive/10 text-olive px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
            Open
          </span>
        </div>

        <p className="text-sm text-ink/60 leading-relaxed mb-6 line-clamp-3">
          {trip.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-ink/50">
            <Calendar className="w-4 h-4 text-rust/70" />
            <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/50">
            <Users className="w-4 h-4 text-rust/70" />
            <span>Max {trip.total_seats} people</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-sand/30">
          <div>
            <p className="text-xs text-ink/40 mb-0.5">Per person, incl. GST</p>
            <p className="text-2xl font-bold text-ink">
              {formatCurrency(trip.price_including_gst)}
            </p>
          </div>
          <a
            href="#enquire"
            className="bg-rust text-cream text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-rust/90 transition-colors"
          >
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
