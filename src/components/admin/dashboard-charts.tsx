"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { STATUS_LABELS } from "@/lib/utils";
import type { LeadStatus } from "@/types/database";

interface StatusRow { status: LeadStatus; count: number }
interface TripRow { trip_name: string; count: number }

interface Props {
  byStatus: StatusRow[];
  byTrip: TripRow[];
}

const COLORS = ["#D55D27", "#45471D", "#D1B788", "#1C1B1A", "#FFFE00", "#888"];

export function DashboardCharts({ byStatus, byTrip }: Props) {
  const statusData = byStatus.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: Number(s.count),
  }));

  const tripData = byTrip.map((t) => ({
    name: t.trip_name.length > 18 ? t.trip_name.slice(0, 18) + "…" : t.trip_name,
    leads: Number(t.count),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leads by status — pie */}
      <div className="bg-white rounded-2xl border border-sand/30 p-6">
        <h2 className="text-sm font-semibold text-ink mb-6">Leads by status</h2>
        {statusData.length === 0 ? (
          <p className="text-ink/30 text-sm text-center py-10">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontFamily: "Poppins, sans-serif", fontSize: 12, borderRadius: 8 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, fontFamily: "Poppins, sans-serif" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Leads per trip — bar */}
      <div className="bg-white rounded-2xl border border-sand/30 p-6">
        <h2 className="text-sm font-semibold text-ink mb-6">Leads per trip</h2>
        {tripData.length === 0 ? (
          <p className="text-ink/30 text-sm text-center py-10">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tripData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D4" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Poppins" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Poppins" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontFamily: "Poppins, sans-serif", fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="leads" fill="#D55D27" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
