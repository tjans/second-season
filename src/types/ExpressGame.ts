import { queryOptions } from "@tanstack/react-query";
import { SafeQueryOptionsFor } from "@/types/SafeQueryOptions";

export type ExpressGame = {
    gameId: string;
    homeTeamId: string;
    awayTeamId: string;
    leagueId?: string | null;
    situation: ExpressGameState;
};

export type ExpressGameState = {
    homeScore: number;
    awayScore: number;
    currentZone?: number | null;
    hasIncludedZone8?: boolean;
    minute: number;
    possessionId?: string | null;
    quarter?: 1 | 2 | 3 | 4 | "OT";
    mode: "PREGAME" | "KICKOFF" | "TD" | "PAT" | "DRIVE" | "EOH" | "EOR" | "FINAL" | "OT"; // end of half, end of regulation, etc
};

