import { queryOptions } from "@tanstack/react-query";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";

export type Player = {
    playerId?: string;
    firstName: string;
    lastName: string;    
    position: string;
    teamId: string;
};
