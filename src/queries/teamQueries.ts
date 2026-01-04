import teamService from "@/services/teamService";
import { Team } from "@/types/Team";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

// #region Keys
export const teamKeys = {
  base: ['team'] as const,
  team: (teamId: string) => [...teamKeys.base, teamId] as const,
  teamList: () => [...teamKeys.base, 'list'] as const,
};
// #endregion

//#region Query options
export const useTeam = (teamId: string, options?: SafeQueryOptionsFor<Team>) =>
  useSuspenseQuery({
    queryKey: teamKeys.team(teamId),
    queryFn: () => teamService.getTeam(teamId),
    ...options
  })

export const useAllTeams = (options?: SafeQueryOptionsFor<Team[]>) =>
  useSuspenseQuery({
    queryKey: teamKeys.teamList(),
    queryFn: () => teamService.getTeams(),
    ...options
  })

// #region Mutations
export const useSaveTeam = () => {
  const queryClient = useQueryClient(); // Use the existing query client from context

  return useMutation({
    mutationFn: async (team: Team) => {
      team.teamId = team.teamId || crypto.randomUUID();
      await teamService.saveTeam(team);
      return team.teamId;
    },
    onSuccess: (_data, variables) => {
      // Invalidate all queries that start with [team]
      queryClient.invalidateQueries({
        queryKey: teamKeys.team(variables.teamId ?? ""),
      });
    }
  });
}