import {db} from '@/db';
import { Team } from '@/types/Team';

export default {
    getTeam: async (teamId: string): Promise<Team> => {
        let team = await db.teams.where({ teamId }).first();
        if (!team) throw new Error(`Team with id ${teamId} not found`);
        return team;  
    }
}