import { db } from '@/db';
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
        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return logs;
    },

    logPlay: async (log: PlayLog): Promise<void> => {
        await db.playLogs.put(log);
    },

    deleteLastLog: async (gameId: string): Promise<string | null> => {
        // get the most recent log for this game
        let lastLog = await db.playLogs.where({ gameId }).sortBy('date');
        if (lastLog.length === 0) return null; // no logs to delete

        let logToDelete = lastLog[lastLog.length - 1];
        await db.playLogs.delete(logToDelete.logId);
        return logToDelete.logId;
    }
};