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
    minute: number;
    possessionId?: string | null;
    quarter?: 1 | 2 | 3 | 4 | "OT";
    mode: "PREGAME" | "KICKOFF" | "TD" | "PAT" | "DRIVE" | "EOH" | "EOR" | "FINAL" | "OT"; // end of half, end of regulation, etc
};

