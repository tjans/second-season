export type Team = {
    teamId?: string;
    city: string;
    mascot?: string;
    stadium?: string | null;
    abbreviation: string;
    prefix?: string;
    finders?: {
        rushingIn: Finder[];
        rushingOut: Finder[];
        shortPass: Finder[];
        mediumPass: Finder[];
        longPass: Finder[];
    };
};

export type Finder = {
    min: number;
    max: number;
    playerId: string;
};

/*
teamId,
    city,
    mascot,
    stadium,
    finders {each finder is an object, min, max, playerId}:
        {
            rushingIn: [finder1, finder2...]
            rushingOut: [finder1, finder2...]
            shortPass: [finder1, finder2...]
            mediumPass: [finder1, finder2...]
            longPass: [finder1, finder2...]
        }
*/