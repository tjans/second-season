import expressGameService from "@/services/expressGameService";
import { ExpressGame } from "@/types/ExpressGame";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { playLogKeys } from "./playLogQueries";

// #region Keys
export const expressGameKeys = {
    base: ['expressGame'] as const,
    expressGame: (gameId: string) => [...expressGameKeys.base, gameId] as const,
};
// #endregion

//#region Query options
export const useExpressGame = (gameId: string, options?:SafeQueryOptionsFor<ExpressGame>) => 
  useSuspenseQuery({
    queryKey: expressGameKeys.expressGame(gameId),
    queryFn: () => expressGameService.getGame(gameId),
    ...options
  }) 


  export function useSaveGame() {
    const queryClient = useQueryClient(); // Use the existing query client from context

    return useMutation({
        mutationFn: async (game: ExpressGame) => expressGameService.saveGame(game),
        onSuccess: (_data, variables) => {
            // Invalidate all queries that start with ['fight', 'round', 'segments']
            queryClient.invalidateQueries({
                queryKey: expressGameKeys.expressGame(variables.gameId)
            });
        }
    });
}

export const useUndo = () => {
    const queryClient = useQueryClient(); // Use the existing query client from context

    return useMutation({
        mutationFn: async (game: ExpressGame) => expressGameService.undo(game),
        onSuccess: (_data, variables) => {
            // Invalidate all queries that start with [playLog]
            queryClient.invalidateQueries({ queryKey: playLogKeys.game(variables.gameId) });
            queryClient.invalidateQueries({ queryKey: expressGameKeys.expressGame(variables.gameId) });
        }
    });
}