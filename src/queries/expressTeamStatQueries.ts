import expressTeamStatService from "@/services/expressTeamStatService";
import { ExpressTeamStat } from "@/types/ExpressTeamStats";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";


// #region Keys
export const expressTeamStatKeys = {
    base: ['expressTeamStat'] as const,
    expressTeamStat: (gameId: string, teamId: string) => [...expressTeamStatKeys.base, gameId, teamId] as const,
};
// #endregion

//#region Query options
export const useTeamStats = (gameId: string, teamId: string, options?: SafeQueryOptionsFor<ExpressTeamStat[]>) =>
    useSuspenseQuery({
        queryKey: expressTeamStatKeys.expressTeamStat(gameId, teamId),
        queryFn: () => expressTeamStatService.getStats(gameId, teamId),
        ...options
    })


export function useSaveTeamStats() {
    const queryClient = useQueryClient(); // Use the existing query client from context

    return useMutation({
        mutationFn: async (statLine: ExpressTeamStat) => expressTeamStatService.saveStat(statLine),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: expressTeamStatKeys.expressTeamStat(variables.gameId, variables.teamId)
            });
        }
    });
}