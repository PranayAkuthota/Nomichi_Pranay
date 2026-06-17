export type UserRole = "admin" | "associate";

export type TripStatus = "open" | "closed";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "VIBE_CHECK_SENT"
  | "CONFIRMED"
  | "NOT_A_FIT";

export type GroupType = "solo" | "friends" | "couple" | "family";

export type ActivityAction =
  | "STATUS_CHANGED"
  | "OWNER_ASSIGNED"
  | "NOTE_ADDED"
  | "TRIP_UPDATED"
  | "LEAD_CREATED";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  price_including_gst: number;
  total_seats: number;
  status: TripStatus;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  trip_id: string;
  owner_id: string | null;
  name: string;
  email: string;
  phone: string;
  group_type: GroupType;
  preferred_month: string;
  trip_feeling: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadWithRelations extends Lead {
  trip: Trip;
  owner: User | null;
}

export interface Touchpoint {
  id: string;
  lead_id: string;
  author_id: string | null;
  content: string;
  created_at: string;
  author?: User | null;
}

export interface ActivityLog {
  id: string;
  lead_id: string;
  actor_id: string | null;
  action: ActivityAction;
  metadata: Record<string, string>;
  created_at: string;
  actor?: User | null;
}

export interface DashboardStats {
  totalLeads: number;
  confirmedLeads: number;
  newLeads: number;
  notAFitLeads: number;
  byStatus: { status: LeadStatus; count: number }[];
  byTrip: { trip_name: string; count: number }[];
  recentActivity: ActivityLog[];
}
