import {db} from '@/db';
import { ExpressGame } from '@/types/ExpressGame';
import playLogService from './playLogService';
import { PlayLog } from '@/types/PlayLog';

export default {
    getGame: async (gameId: string): Promise<ExpressGame> => {
        let game = await db.expressGames.where({ gameId }).first();
        if (!game) throw new Error(`Game with id ${gameId} not found`);
        return game;
    },

    saveGame: async (game: ExpressGame): Promise<void> => {
        await db.expressGames.put(game);
    },

    undo: async (game: ExpressGame): Promise<void> => {
        await playLogService.deleteLastLog(game.gameId)
        let lastLog = await db.playLogs.where({ gameId: game.gameId }).sortBy('date');
        if (lastLog.length === 0) {
            // no more logs, reset game to pregame state
            game.situation = {
                homeScore: 0,
                awayScore: 0,
                currentZone: null,
                minute: 0,
                possessionId: null,
                quarter: 1,
                mode: "PREGAME"
            }    
        } else {
            let mostRecentLog = lastLog[lastLog.length - 1];
            game.situation = mostRecentLog.situation;
        }

        await db.expressGames.put(game);
    }
};