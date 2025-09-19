import playLogService from "@/services/playLogService";
import { PlayLog } from "@/types/PlayLog";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { expressGameKeys } from "./expressGameQueries";

// #region Keys
export const playLogKeys = {
    base: ['playLog'] as const,
    game: (gameId: string) => [...playLogKeys.base, "game", gameId] as const,
    log: (logId: string) => [...playLogKeys.base, "log", logId] as const,
};
// #endregion

//#region Queries
export const usePlayLogs = (gameId: string, options?: SafeQueryOptionsFor<PlayLog[]>) =>
  useSuspenseQuery({
    queryKey: playLogKeys.game(gameId),
    queryFn: () => playLogService.getLogs(gameId),
    ...options
  }) 

// #endregion
    

// #region Mutations
export const useLogPlay = () => {
    const queryClient = useQueryClient(); // Use the existing query client from context

    return useMutation({
        mutationFn: async (log: PlayLog) => playLogService.logPlay(log),
        onSuccess: (_data, variables) => {
            // Invalidate all queries that start with [playLog]
            queryClient.invalidateQueries({
                queryKey: playLogKeys.game(variables.gameId)
            });
        }
    });
}

// #endregion

// undoMutation