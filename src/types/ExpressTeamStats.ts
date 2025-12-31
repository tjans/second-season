


export type ExpressTeamStat = {
    statId?: string;
    gameId: string;
    teamId: string;
    logId?: string;
    passYardsGained?: number | null; // each zone is worth 10 or 15, so this stores how many yards gained/lost
    rushYardsGained?: number | null; // each zone is worth 10 or 15, so this stores how many yards gained/lost

    playerId?: string;
    passTD?: number;
    rushTD?: number;
    interceptionTD?: number;
    fumbleTD?: number;
    KRTD?: number;
    PRTD?: number;
    FGM?: number;
    FGA?: number;
    XPM?: number;
    XPA?: number;
    sack?: number;
    completion?: number;

    twoPointConversion?: number;
    fumble?: number;
    safety?: number;
    interception?: number;
};