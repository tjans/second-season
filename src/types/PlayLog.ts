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
    
    passYardsGained?: number | null; // each zone is worth 10 or 15, so this stores how many yards gained/lost
    rushYardsGained?: number | null; // each zone is worth 10 or 15, so this stores how many yards gained/lost
    passZonesGained?: number | null; // how many zones were gained/lost on a pass play
    rushZonesGained?: number | null; // how many zones were gained/lost on a rush play
    
    TD?: number;
    InterceptionTD?: number;
    Safeties?: number;
    Interceptions?: number;
};