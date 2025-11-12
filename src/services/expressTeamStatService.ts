import { db } from '@/db';

import { ExpressTeamStat } from '@/types/ExpressTeamStats';

export default {
    getStats: async (gameId: string, teamId: string): Promise<ExpressTeamStat[]> => {
        let stats = await db.expressTeamStats.where({ gameId, teamId }).toArray();
        return stats;
    },

    saveStat: async (statLine: ExpressTeamStat): Promise<void> => {
        await db.expressTeamStats.put(statLine);
    },

    deleteStatsByLogId: async (logId: string): Promise<void> => {
        await db.expressTeamStats.where({ logId }).delete();
    }
};