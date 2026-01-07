import { db } from '@/db';
import { Team } from '@/types/Team';

export default {
    getTeam: async (teamId: string): Promise<Team> => {
        let team = await db.teams.where({ teamId }).first();
        if (!team) throw new Error(`Team with id ${teamId} not found`);
        return team;
    },
    getTeams: async (): Promise<Team[]> => {
        let teams = await db.teams.toArray();
        teams.sort((a, b) => {
            if (a.prefix !== b.prefix) return (a.prefix ?? "").localeCompare(b.prefix ?? "");
            if (a.city !== b.city) return a.city.localeCompare(b.city);
            return (a.mascot ?? "").localeCompare(b.mascot ?? "");
        });
        return teams;
    },
    saveTeam: async (team: Team): Promise<void> => {
        await db.teams.put(team);
    },
    createTeamLookup: (teams: Team[]): Record<string, Team> => {
        return teams.reduce<Record<string, Team>>((lookup, team) => {
            if (team.teamId !== undefined) {
                lookup[team.teamId] = team;
            }
            return lookup;
        }, {});
    }
}