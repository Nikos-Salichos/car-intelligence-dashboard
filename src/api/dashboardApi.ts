import { apiClient } from "./apiClient";
import * as T from "../types";

export const dashboardApi = {
  getVfmLeaderboard: async (minScore = 0.0): Promise<T.VfmLeaderboardDto[]> => {
    const { data } = await apiClient.get(`/Reports/vfm-leaderboard?minScore=${minScore}`);
    return data;
  },

};
