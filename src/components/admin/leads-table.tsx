"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  STATUS_LABELS, STATUS_COLORS, formatDate, formatRelativeTime, exportToCSV,
} from "@/lib/utils";
import type { LeadWithRelations, Trip, User, LeadStatus } from "@/types/database";

interface Props {
  leads: LeadWithRelations[];
  total: number;
  pageSize: number;
  trips: Trip[];
  users: User[];
  currentParams: Record<string, string | undefined>;
}

const SORTABLE_COLS = [
  { key: "created_at", label: "Date" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
];

export function LeadsTable({ leads, total, pageSize, trips, users, currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(currentParams.search ?? "");

  const page = Number(currentParams.page ?? 1);
  const totalPages = Math.ceil(total / pageSize);

  const push = useCallback(
    (updates: Record<string, string | undefined>) => {
      const p = new URLSearchParams();
      const merged = { ...currentParams, ...updates };
      Object.entries(merged).forEach(([k, v]) => {
        if (v) p.set(k, v);
      });
      startTransition(() => router.push(`${pathname}?${p.toString()}`));
    },
    [currentParams, pathname, router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    push({ search: search || undefined, page: "1" });
  };

  const handleSort = (col: string) => {
    const isSame = currentParams.sort === col;
    push({ sort: col, dir: isSame && currentParams.dir !== "asc" ? "asc" : "desc" });
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (currentParams.sort !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return currentParams.dir === "asc"
      ? <ArrowUp className="w-3 h-3 text-rust" />
      : <ArrowDown className="w-3 h-3 text-rust" />;
  };

  const handleExport = () => {
    if (leads.length === 0) { toast.error("Nothing to export"); return; }
    exportToCSV(
      leads.map((l) => ({
        name: l.name,
        email: l.email,
        phone: l.phone,
        status: STATUS_LABELS[l.status],
        trip: l.trip?.name ?? "",
        group_type: l.group_type,
        preferred_month: l.preferred_month,
        owner: l.owner?.full_name ?? "Unassigned",
        created_at: l.created_at,
        trip_feeling: l.trip_feeling,
      })),
      "nomichi-leads"
    );
    toast.success("CSV exported");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-sand/30 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <Input
                placeholder="Search by name, email, phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">Search</Button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <Select
              value={currentParams.status ?? "all"}
              onValueChange={(v) => push({ status: v === "all" ? undefined : v, page: "1" })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentParams.trip ?? "all"}
              onValueChange={(v) => push({ trip: v === "all" ? undefined : v, page: "1" })}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Trip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All trips</SelectItem>
                {trips.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentParams.owner ?? "all"}
              onValueChange={(v) => push({ owner: v === "all" ? undefined : v, page: "1" })}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All owners</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-sand/30 overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink/40">No leads match your filters.</p>
            <p className="text-ink/25 text-sm mt-1">Try adjusting the search or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand/30 bg-[#FAF8F4]">
                  {SORTABLE_COLS.map((col) => (
                    <th key={col.key} className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wider">
                      <button
                        className="flex items-center gap-1.5 hover:text-ink transition-colors"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        <SortIcon col={col.key} />
                      </button>
                    </th>
                  ))}
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wider">Trip</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wider">Owner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wider">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAF8F4] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/leads/${lead.id}`} className="font-medium text-ink hover:text-rust transition-colors">
                        {lead.name}
                      </Link>
                      <p className="text-ink/40 text-xs mt-0.5">{lead.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={`text-xs border ${STATUS_COLORS[lead.status]}`} variant="outline">
                        {STATUS_LABELS[lead.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-ink/70">{lead.trip?.name ?? "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      {lead.owner ? (
                        <span className="text-ink/60">{lead.owner.full_name}</span>
                      ) : (
                        <span className="text-ink/25 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-ink/40 text-xs whitespace-nowrap">
                      {formatRelativeTime(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-sand/20">
            <p className="text-xs text-ink/40">
              Page {page} of {totalPages} · {total} leads
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => push({ page: String(page - 1) })}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => push({ page: String(page + 1) })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
