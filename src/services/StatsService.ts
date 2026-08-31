import AuthService from "./AuthService";

export type PlatformStats = {
  totalUsers: number;
  activeUsers: number;
};

type StatsResponse = Partial<PlatformStats> & {
  data?: Partial<PlatformStats>;
};

const asCount = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : 0;

export const StatsService = {
  getStats: async (): Promise<PlatformStats> => {
    const data = await AuthService.request<StatsResponse>("/stats", {
      method: "GET",
    });
    const source = data.data ?? data;
    return {
      totalUsers: asCount(source.totalUsers),
      activeUsers: asCount(source.activeUsers),
    };
  },
};

export default StatsService;
