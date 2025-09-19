import {db} from '@/db';
import { ExpressGame } from '@/types/ExpressGame';

export default {
    getGame: async (gameId: string): Promise<ExpressGame> => {
        let game = await db.expressGames.where({ gameId }).first();
        if (!game) throw new Error(`Game with id ${gameId} not found`);
        return game;
    },

    saveGame: async (game: ExpressGame): Promise<void> => {
        await db.expressGames.put(game);
    }
};