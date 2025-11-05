export type ExpressGame = {
    gameId: string;
    homeTeamId: string;
    awayTeamId: string;
    leagueId?: string | null;
    situation: ExpressGameState;
    coinTossWinnerId?: string | null;
};

export type ExpressGameState = {
    homeScore: number;
    awayScore: number;
    currentZone?: number | null;
    minute: number;
    possessionId?: string | null;
    quarter?: number | null;
    mode: "PREGAME" | "KICKOFF" | "PAT" | "DRIVE" | "EOH" | "FINAL" | "OT COIN TOSS"; // end of half, end of regulation, etc
};

export type PlayCall = "PASS" | "RUN" | "SAFE" | "BLITZ" | "TEND" | "AUDIBLE";

