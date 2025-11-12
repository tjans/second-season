import Dexie, { Table } from "dexie";
import { ExpressGame } from "./types/ExpressGame";
import { ExpressGameState } from "./types/ExpressGame";
import { Finder, Team } from "./types/Team";
import { PlayLog } from "./types/PlayLog";
import { Player } from "./types/Player";
import { ExpressTeamStat } from "./types/ExpressTeamStats";

class SecondSeasonManagerDatabase extends Dexie {
  expressGames!: Table<ExpressGame, string>;
  teams!: Table<Team, string>;
  players!: Table<Player, string>;
  playLogs!: Table<PlayLog, string>; // Add this line for the stats table
  expressTeamStats!: Table<ExpressTeamStat, string>;

  constructor() {
    super("second-season");

    this.version(2).stores({
      expressGames: 'gameId, leagueId',
      teams: 'teamId',
      players: 'playerId, position',
      playLogs: '++logId, gameId, logDate',
      expressTeamStats: '++statId, gameId, teamId, logId'
    });
  }
}

export const db = new SecondSeasonManagerDatabase();

async function seedIfEmpty() {
  try {
    // Force the database to open by performing a simple operation
    await db.open();

    // Check if database already has data
    const existingGames = await db.expressGames.count();
    if (existingGames > 0) {
      console.log("Database already has data, skipping seed");
      return;
    }

    const gameId = "game-id-1";
    const homeTeamId = "home-team-id-1";
    const awayTeamId = "away-team-id-1";

    // Setup objects
    const expressGameState: ExpressGameState = {
      homeScore: 0,
      awayScore: 0,
      currentZone: null,
      minute: 15,
      possessionId: null,
      quarter: 1,
      mode: "PREGAME"
    };

    const expressGame: ExpressGame = {
      gameId: gameId,
      homeTeamId: homeTeamId,
      awayTeamId: awayTeamId,
      leagueId: null,
      situation: expressGameState,

    }

    const homePlayers = [
      { playerId: "home-player-QB-1", firstName: "Home", lastName: "QB Player", position: "QB", teamId: homeTeamId },
      { playerId: "home-player-RB-1", firstName: "Home", lastName: "RB Player 1", position: "RB", teamId: homeTeamId },
      { playerId: "home-player-RB-2", firstName: "Home", lastName: "RB Player 2", position: "RB", teamId: homeTeamId },
      { playerId: "home-player-WR-1", firstName: "Home", lastName: "WR Player 1", position: "WR", teamId: homeTeamId },
      { playerId: "home-player-WR-2", firstName: "Home", lastName: "WR Player 2", position: "WR", teamId: homeTeamId },
      { playerId: "home-player-WR-3", firstName: "Home", lastName: "WR Player 3", position: "WR", teamId: homeTeamId },
      { playerId: "home-player-TE-1", firstName: "Home", lastName: "TE Player 1", position: "TE", teamId: homeTeamId },
      { playerId: "home-player-TE-2", firstName: "Home", lastName: "TE Player 2", position: "TE", teamId: homeTeamId },
      { playerId: "home-player-DL-1", firstName: "Home", lastName: "DL Player 1", position: "DL", teamId: homeTeamId },
      { playerId: "home-player-DL-2", firstName: "Home", lastName: "DL Player 2", position: "DL", teamId: homeTeamId },
      { playerId: "home-player-DL-3", firstName: "Home", lastName: "DL Player 3", position: "DL", teamId: homeTeamId },
      { playerId: "home-player-DL-4", firstName: "Home", lastName: "DL Player 4", position: "DL", teamId: homeTeamId },
      { playerId: "home-player-LB-1", firstName: "Home", lastName: "LB Player 1", position: "LB", teamId: homeTeamId },
      { playerId: "home-player-LB-2", firstName: "Home", lastName: "LB Player 2", position: "LB", teamId: homeTeamId },
      { playerId: "home-player-LB-3", firstName: "Home", lastName: "LB Player 3", position: "LB", teamId: homeTeamId },
      { playerId: "home-player-LB-4", firstName: "Home", lastName: "LB Player 4", position: "LB", teamId: homeTeamId },
      { playerId: "home-player-DB-1", firstName: "Home", lastName: "DB Player 1", position: "DB", teamId: homeTeamId },
      { playerId: "home-player-DB-2", firstName: "Home", lastName: "DB Player 2", position: "DB", teamId: homeTeamId },
      { playerId: "home-player-DB-3", firstName: "Home", lastName: "DB Player 3", position: "DB", teamId: homeTeamId },
      { playerId: "home-player-DB-4", firstName: "Home", lastName: "DB Player 4", position: "DB", teamId: homeTeamId },
      { playerId: "home-player-K-1", firstName: "Home", lastName: "Kicker", position: "K", teamId: homeTeamId },
      { playerId: "home-player-P-1", firstName: "Home", lastName: "Punter", position: "P", teamId: homeTeamId }
    ];

    const awayPlayers = [
      { playerId: "away-player-1", firstName: "Away", lastName: "QB Player", position: "QB", teamId: awayTeamId },
      { playerId: "away-player-2", firstName: "Away", lastName: "RB Player 1", position: "RB", teamId: awayTeamId },
      { playerId: "away-player-3", firstName: "Away", lastName: "RB Player 2", position: "RB", teamId: awayTeamId },
      { playerId: "away-player-4", firstName: "Away", lastName: "WR Player 1", position: "WR", teamId: awayTeamId },
      { playerId: "away-player-5", firstName: "Away", lastName: "WR Player 2", position: "WR", teamId: awayTeamId },
      { playerId: "away-player-6", firstName: "Away", lastName: "WR Player 3", position: "WR", teamId: awayTeamId },
      { playerId: "away-player-7", firstName: "Away", lastName: "TE Player 1", position: "TE", teamId: awayTeamId },
      { playerId: "away-player-8", firstName: "Away", lastName: "TE Player 2", position: "TE", teamId: awayTeamId },
      { playerId: "away-player-9", firstName: "Away", lastName: "DL Player 1", position: "DL", teamId: awayTeamId },
      { playerId: "away-player-10", firstName: "Away", lastName: "DL Player 2", position: "DL", teamId: awayTeamId },
      { playerId: "away-player-11", firstName: "Away", lastName: "DL Player 3", position: "DL", teamId: awayTeamId },
      { playerId: "away-player-12", firstName: "Away", lastName: "DL Player 4", position: "DL", teamId: awayTeamId },
      { playerId: "away-player-13", firstName: "Away", lastName: "LB Player 1", position: "LB", teamId: awayTeamId },
      { playerId: "away-player-14", firstName: "Away", lastName: "LB Player 2", position: "LB", teamId: awayTeamId },
      { playerId: "away-player-15", firstName: "Away", lastName: "LB Player 3", position: "LB", teamId: awayTeamId },
      { playerId: "away-player-16", firstName: "Away", lastName: "LB Player 4", position: "LB", teamId: awayTeamId },
      { playerId: "away-player-17", firstName: "Away", lastName: "DB Player 1", position: "DB", teamId: awayTeamId },
      { playerId: "away-player-18", firstName: "Away", lastName: "DB Player 2", position: "DB", teamId: awayTeamId },
      { playerId: "away-player-19", firstName: "Away", lastName: "DB Player 3", position: "DB", teamId: awayTeamId },
      { playerId: "away-player-20", firstName: "Away", lastName: "DB Player 4", position: "DB", teamId: awayTeamId },
      { playerId: "away-player-21", firstName: "Away", lastName: "Kicker", position: "K", teamId: awayTeamId },
      { playerId: "away-player-22", firstName: "Away", lastName: "Punter", position: "P", teamId: awayTeamId }
    ];

    // Helper to get playerId by position and index
    function getPlayerId(players: any[], position: string, index: number = 1) {
      const filtered = players.filter(p => p.position === position);
      return filtered[index - 1]?.playerId;
    }

    // Finder structure: { min: number, max: number, playerId: string }
    function makeFinders(players: any[]) {
      return {
        rushingIn: [
          { min: 1, max: 12, playerId: getPlayerId(players, "RB", 1) }, // RB1
          { min: 13, max: 20, playerId: getPlayerId(players, "RB", 2) }, // RB2
        ] as Finder[],
        rushingOut: [
          { min: 1, max: 15, playerId: getPlayerId(players, "RB", 1) }, // RB1
          { min: 14, max: 18, playerId: getPlayerId(players, "RB", 2) }, // RB2
          { min: 19, max: 20, playerId: getPlayerId(players, "QB", 1) }, // QB
        ] as Finder[],
        shortPass: [
          { min: 1, max: 5, playerId: getPlayerId(players, "WR", 1) },   // WR1
          { min: 6, max: 10, playerId: getPlayerId(players, "WR", 2) },  // WR2
          { min: 11, max: 15, playerId: getPlayerId(players, "TE", 1) }, // TE1
          { min: 16, max: 18, playerId: getPlayerId(players, "TE", 2) }, // TE2
          { min: 19, max: 20, playerId: getPlayerId(players, "RB", 1) }, // RB1
        ] as Finder[],
        mediumPass: [
          { min: 1, max: 8, playerId: getPlayerId(players, "WR", 1) },   // WR1
          { min: 9, max: 13, playerId: getPlayerId(players, "WR", 2) },  // WR2
          { min: 14, max: 16, playerId: getPlayerId(players, "TE", 1) }, // TE1
          { min: 17, max: 18, playerId: getPlayerId(players, "WR", 3) }, // WR3
          { min: 19, max: 20, playerId: getPlayerId(players, "RB", 1) }, // RB1
        ] as Finder[],
        longPass: [
          { min: 1, max: 10, playerId: getPlayerId(players, "WR", 1) },  // WR1
          { min: 11, max: 17, playerId: getPlayerId(players, "WR", 2) }, // WR2
          { min: 18, max: 20, playerId: getPlayerId(players, "TE", 1) }, // TE1
        ] as Finder[],
      };
    }

    const homeTeam: Team = {
      teamId: homeTeamId,
      city: "Home City",
      mascot: "Home Mascot",
      stadium: "Home Stadium",
      abbreviation: "HOME",
      finders: makeFinders(homePlayers)
    };

    const awayTeam: Team = {
      teamId: awayTeamId,
      city: "Away City",
      mascot: "Away Mascot",
      stadium: "Away Stadium",
      abbreviation: "AWAY",
      finders: makeFinders(awayPlayers)
    };

    await db.transaction("rw", db.expressGames, db.teams, db.players, async () => {
      await db.expressGames.bulkAdd([expressGame]);
      await db.teams.bulkAdd([homeTeam, awayTeam]);
      await db.players.bulkAdd([...homePlayers, ...awayPlayers]);
    });

    console.log("Dexie seed data inserted!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

// Run the seeding once at startup
seedIfEmpty().catch(console.error);


/*
teams (teamId):
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

players (playerId, position):
    playerId,
    firstName,
    lastName,
    position,
    teamId


stats:
    statId
    gameId
    teamId
    zones
    yards (10 or 15)
    gameState (after play completion)
    
*/