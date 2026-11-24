import AuthService from "./AuthService";
import type { PaginationMeta } from "./TournamentService";

/** Platform admin API (/api/v1/admin) -- only works for ADMIN_EMAILS accounts. */

export type AdminContact = { id: string; name: string; email: string; phone: string } | null;

export type AdminOverview = {
  users: { total: number; newThisWeek: number };
  players: { registered: number; records: number; suspended: number };
  tournaments: { total: number; byStatus: Record<string, number>; newThisWeek: number };
  matches: {
    tournament: { total: number; byStatus: Record<string, number> };
    friendly: { total: number; byStatus: Record<string, number> };
    newThisWeek: number;
  };
  connectedNow: number;
};

export type AdminTournament = {
  id: string;
  name: string;
  location: string;
  status: "draft" | "active" | "completed";
  format: string;
  squadMode: string;
  oversPerMatch: number;
  logoUrl: string;
  organizerName: string;
  organizer: AdminContact;
  teamsCount: number;
  matches: Record<string, number>;
  startDate: string | null;
  createdAt: string;
};

export type AdminPlayer = {
  id: string;
  name: string;
  username: string;
  role: string;
  city: string;
  contactNumber: string;
  avatarUrl: string;
  registered: boolean;
  account: AdminContact;
  createdBy: AdminContact;
  visibility: string;
  suspended: boolean;
  createdAt: string;
};

export type AdminMatch = {
  id: string;
  kind: "tournament" | "friendly";
  title: string;
  status: string;
  resultText: string;
  tournamentName: string;
  liveCode: string;
  scorer: AdminContact;
  startedAt: string;
  updatedAt: string;
};

type Page<K extends string, T> = { [key in K]: T[] } & { pagination: PaginationMeta };

const query = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") search.set(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : "";
};

const AdminService = {
  overview: () => AuthService.request<AdminOverview>("/admin/overview", { method: "GET" }),
  tournaments: (p: { page: number; q?: string; status?: string }) =>
    AuthService.request<Page<"tournaments", AdminTournament>>(`/admin/tournaments${query(p)}`, { method: "GET" }),
  deleteTournament: (id: string) =>
    AuthService.request<{ teams: number; matches: number }>(`/admin/tournaments/${encodeURIComponent(id)}`, { method: "DELETE" }),
  players: (p: { page: number; q?: string; type?: string }) =>
    AuthService.request<Page<"players", AdminPlayer>>(`/admin/players${query(p)}`, { method: "GET" }),
  setSuspended: (id: string, suspended: boolean) =>
    AuthService.request<{ suspended: boolean }>(`/admin/players/${encodeURIComponent(id)}/suspension`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended }),
    }),
  matches: (p: { page: number; kind: "tournament" | "friendly"; q?: string; status?: string }) =>
    AuthService.request<Page<"matches", AdminMatch>>(`/admin/matches${query(p)}`, { method: "GET" }),
  deleteMatch: (kind: "tournament" | "friendly", id: string) =>
    AuthService.request<{ message: string }>(`/admin/matches/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export default AdminService;
