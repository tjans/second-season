import {db} from '@/db';
import { PlayLog } from '@/types/PlayLog';

export default {
    // getGame: async (gameId: string): Promise<ExpressGame> => {
    //     let game = await db.expressGames.where({ gameId }).first();
    //     if (!game) throw new Error(`Game with id ${gameId} not found`);
    //     return game;
    // },

    getLogs: async (gameId: string): Promise<PlayLog[]> => {
        let logs = await db.playLogs.where({ gameId }).toArray();
        
        // sort by date
        logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return logs;
    },

    logPlay: async (log: PlayLog): Promise<void> => {
        await db.playLogs.put(log);
    }
};