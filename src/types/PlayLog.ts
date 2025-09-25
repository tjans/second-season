import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";
import playLogService from "@/services/playLogService";
import { ExpressGameState } from "./ExpressGame";

export type PlayLog = {
    logId: string;
    gameId: string;
    situation: ExpressGameState;
    playMinute: number;
    message: string;
    date: string; // ISO string

    offenseTeamId: string;
    defenseTeamId: string;
    
    yardsGained: number | null; // each zone is worth 10 or 15, so this stores how many yards gained/lost
    TD?: number;
    InterceptionTD?: number;
    Safeties?: number;
    Interceptions?: number;
};