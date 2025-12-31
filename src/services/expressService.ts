import { ExpressGame } from "@/types/ExpressGame";
import { ExpressTeamStat } from "@/types/ExpressTeamStats";
import { MutablePlayLog } from "@/types/PlayLog";
import { ScoreResult } from "@/types/ScoreResult";
import { Team } from "@/types/Team";

type ProcessPlayResult = {
    gameAfterPlay: ExpressGame;
    log: MutablePlayLog;
    stats: ExpressTeamStat[];
}

export default {

    /**************************************************************************************************************************
    * Main functions to process plays
    **************************************************************************************************************************/
    processPass: function (game: ExpressGame, zones: number, fumbleReturnZones: number | null, offenseTeam: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let zoneDelta = Number(zones);

        if (!game.situation.currentZone) throw new Error("You cannot move the ball when the currentZone is not set");

        let gameAfterPlay = structuredClone(game);  // for saving to the data store after manipulating the play   

        this.setRelativeZone(gameAfterPlay, zoneDelta);

        // Determines if it's a touchdown or safety
        let scoreResult = this.checkForScore(gameAfterPlay);
        let isTouchdown = scoreResult === "TOUCHDOWN";
        let isSafety = scoreResult === "SAFETY";

        // Advance the clock
        this.advanceClock(gameAfterPlay);

        // Tally the yardage gained
        let actualDelta = (gameAfterPlay.situation.currentZone ?? 0) - (gameBeforePlay.situation.currentZone ?? 0);
        let passYardsGained = this.calculateYardage(gameBeforePlay.situation.currentZone ?? 0, actualDelta);

        let passingStat: ExpressTeamStat = {
            gameId: game.gameId,
            teamId: offenseTeam.teamId,
            passYardsGained,
            interception: 0,
            completion: 1
        }

        if (fumbleReturnZones !== null) {
            this.swapPossession(gameAfterPlay);
            this.reverseField(gameAfterPlay); // reverse the field for the defense
            this.setRelativeZone(gameAfterPlay, fumbleReturnZones);
            let scoreResult = this.checkForScore(gameAfterPlay);
            isTouchdown = scoreResult === "TOUCHDOWN";

            passingStat.fumble = 1;
            if (isTouchdown) passingStat.fumbleTD = 1;

        } else {
            if (isTouchdown) passingStat.passTD = 1;

            // If it's a safety, we need to swap possession back
            if (isSafety) this.swapPossession(gameAfterPlay);
        }

        if (!isTouchdown) this.checkForEndOfQuarter(gameAfterPlay);

        // Build the message
        let message = "UNKNOWN PASS PLAY";
        message = `${offenseTeam?.abbreviation} pass sequence for ${actualDelta} zone${actualDelta === 1 ? "" : "s"}`;

        if (fumbleReturnZones !== null) {
            message += `, FUMBLE`;
            if (isTouchdown) message += ` ret. for TD!`;
            else if (fumbleReturnZones === 0) message += `, no return.`;
            else message += ` ret. ${fumbleReturnZones} zone${fumbleReturnZones === 1 ? "" : "s"}`;

        } else if (isTouchdown) {
            message += `, TD!`;

        } else if (isSafety) {
            message += `, SAFETY!`;
        }

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            passYardsGained: passYardsGained,
            TD: isTouchdown ? 1 : 0,
            Safeties: isSafety ? 1 : 0,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        }

        return { gameAfterPlay, log, stats: [passingStat] };
    },

    processRun: function (game: ExpressGame, zones: number, fumbleReturnZones: number | null, offenseTeam: Team, defenseTeam: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let zoneDelta = Number(zones);

        if (!game.situation.currentZone) throw new Error("You cannot move the ball when the currentZone is not set");

        let gameAfterPlay = structuredClone(game);  // for saving to the data store after manipulating the play   

        this.setRelativeZone(gameAfterPlay, zoneDelta);

        // Determines if it's a touchdown or safety
        let scoreResult = this.checkForScore(gameAfterPlay);
        let isTouchdown = scoreResult === "TOUCHDOWN";
        let isSafety = scoreResult === "SAFETY";

        // Advance the clock
        this.advanceClock(gameAfterPlay);

        // Tally the yardage gained
        let actualDelta = (gameAfterPlay.situation.currentZone ?? 0) - (gameBeforePlay.situation.currentZone ?? 0);
        let rushYardsGained = this.calculateYardage(gameBeforePlay.situation.currentZone ?? 0, actualDelta);

        let rushingStat: ExpressTeamStat = {
            gameId: game.gameId,
            teamId: offenseTeam.teamId,
            rushYardsGained
        }

        if (fumbleReturnZones !== null) {
            this.swapPossession(gameAfterPlay);
            this.reverseField(gameAfterPlay); // reverse the field for the defense
            this.setRelativeZone(gameAfterPlay, fumbleReturnZones);
            let scoreResult = this.checkForScore(gameAfterPlay);
            isTouchdown = scoreResult === "TOUCHDOWN";

            rushingStat.fumble = 1;
            if (isTouchdown) rushingStat.fumbleTD = 1;

        } else {
            if (isTouchdown) rushingStat.rushTD = 1;

            // If it's a safety, we need to swap possession back
            if (isSafety) this.swapPossession(gameAfterPlay);
        }

        // Handles the cut between quarters, setting the correct mode and everything else
        // If a TD is scored, we don't check for end of quarter, we need the mode to be PAT
        // So run the check for end of quarter after the PAT is processed.
        if (!isTouchdown) this.checkForEndOfQuarter(gameAfterPlay);

        // Build the message
        let message = "UNKNOWN RUN PLAY";
        message = `${offenseTeam?.abbreviation} run sequence for ${actualDelta} zone${actualDelta === 1 ? "" : "s"}`;

        if (fumbleReturnZones !== null) {
            message += `, FUMBLE`;
            if (isTouchdown) message += ` ret. for TD!`;
            else if (fumbleReturnZones === 0) message += `, no return.`;
            else message += ` ret. ${fumbleReturnZones} zone${fumbleReturnZones === 1 ? "" : "s"}`;

        } else if (isTouchdown) {
            message += `, TD!`;

        } else if (isSafety) {
            message += `, SAFETY!`;
        }

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,

            rushYardsGained: rushYardsGained,
            offenseTeamId: offenseTeam.teamId,
            defenseTeamId: defenseTeam.teamId,
            scoringTeamId: isTouchdown ? offenseTeam.teamId : undefined,

            TD: isTouchdown ? 1 : 0,
            Safeties: isSafety ? 1 : 0,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        }

        return { gameAfterPlay, log, stats: [rushingStat] };
    },

    processInterception: function (game: ExpressGame, finalZone: number, offenseTeam: Team, defenseTeam: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);

        let passingStat: ExpressTeamStat = {
            gameId: game.gameId,
            teamId: offenseTeam.teamId,
            interception: 1
        }

        this.advanceClock(gameAfterPlay);
        this.swapPossession(gameAfterPlay);

        // play is going the other way now
        let reversedZone = this.getReverseZone(finalZone);
        this.setNewZone(gameAfterPlay, reversedZone);

        let scoreResult = this.checkForScore(gameAfterPlay);
        let isTouchdown = scoreResult === "TOUCHDOWN";

        // Build the message
        let message = `${offenseTeam?.abbreviation} pass is intercepted, `;
        message += isTouchdown ? ` returned for a TD!` : ` returned to zone ${finalZone}`;

        let log = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,

            offenseTeamId: offenseTeam.teamId,
            defenseTeamId: defenseTeam.teamId,
            TD: isTouchdown ? 1 : 0,
            Interceptions: 1,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        }

        return { gameAfterPlay, log, stats: [passingStat] };
    },

    processSack: function (game: ExpressGame, zonesLost: number, fumbleReturnZones: number | null, offenseTeam: Team, defenseTeam: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);
        if (!gameAfterPlay.situation.currentZone) throw new Error("You cannot sack when the currentZone is not set");

        let stats: ExpressTeamStat = {
            gameId: game.gameId,
            teamId: defenseTeam.teamId,
            sack: 1
        }

        let passYardsLost = zonesLost * 7; // sacks are a flat 7 yards per zone lost

        this.advanceClock(gameAfterPlay);
        this.setRelativeZone(gameAfterPlay, zonesLost);

        // check for a safety, since a sack can result in a safety (checkForScore)
        let isSafety = this.checkForScore(gameAfterPlay) === "SAFETY";
        let isFumble = fumbleReturnZones !== null;
        let isTouchdown = false;

        // Check for a fumble, which can be returned for a TD.  
        // fumbleReturnZones = null -> no fumble
        // fumbleReturnZones = 0 -> fumble with no return
        // fumbleReturnZones > 0 -> fumble returned that many zones
        if (fumbleReturnZones !== null) {
            this.swapPossession(gameAfterPlay);
            this.reverseField(gameAfterPlay); // reverse the field for the defense
            this.setRelativeZone(gameAfterPlay, fumbleReturnZones);
            let scoreResult = this.checkForScore(gameAfterPlay);
            isTouchdown = scoreResult === "TOUCHDOWN";
        }

        // if(!isTouchdown) check for end of quarter (we don't do this if there was a touchdown, because we 
        // need mode to be PAT, not EOH or FINAL)
        if (!isTouchdown) this.checkForEndOfQuarter(gameAfterPlay);

        let message = `${offenseTeam?.abbreviation} is sacked`;
        if (!isFumble) {
            if (isSafety) message += ` for a SAFETY!`;
            else if (gameAfterPlay.situation.currentZone == gameBeforePlay.situation.currentZone) message += `, same zone`;
            else message += ` to zone ${gameAfterPlay.situation.currentZone}`;
        } else {
            message += `, FUMBLE`;
            if (isTouchdown) message += ` ret. for TD!`;
            else if (fumbleReturnZones === 0) message += `, no return.`;
            else message += ` ret. to zone ${gameAfterPlay.situation.currentZone}`;
        }

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,

            passYardsGained: passYardsLost,
            offenseTeamId: offenseTeam.teamId,
            defenseTeamId: defenseTeam.teamId,
            Safeties: isSafety ? 1 : 0,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        }

        return { gameAfterPlay, log, stats: [stats] };

    },

    processKickoff: function (game: ExpressGame, finalZone: number, offenseTeamBeforePlay: Team, defenseTeamBeforePlay: Team, isFumble: boolean): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);

        gameAfterPlay.situation.mode = "DRIVE";
        this.advanceClock(gameAfterPlay);
        this.setNewZone(gameAfterPlay, finalZone);
        this.swapPossession(gameAfterPlay);

        let scoreResult = this.checkForScore(gameAfterPlay); // sacks can't score, but we need to check for safeties
        let isTouchdown = scoreResult === "TOUCHDOWN";

        // Build the message
        let message = `${offenseTeamBeforePlay?.abbreviation} kickoff to zone ${finalZone}`;
        if (isFumble) {
            message += `, fumble!`;
            this.swapPossession(gameAfterPlay);
            this.reverseField(gameAfterPlay);
        }
        else if (isTouchdown) message += `, returned for TD!`;

        if (!isTouchdown) this.checkForEndOfQuarter(gameAfterPlay);

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: defenseTeamBeforePlay.teamId,
            defenseTeamId: offenseTeamBeforePlay.teamId,
            TD: isTouchdown ? 1 : 0,
            scoringTeamId: isTouchdown ? defenseTeamBeforePlay.teamId : undefined,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log, stats: [] };
    },

    processIncomplete: function (game: ExpressGame, offenseTeamBeforePlay: Team, defenseTeamBeforePlay: Team): ProcessPlayResult {
        let gameAfterPlay = structuredClone(game);
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things

        // increase clock
        this.advanceClock(gameAfterPlay);

        let message = `${offenseTeamBeforePlay?.abbreviation} throws incomplete pass`;

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: offenseTeamBeforePlay.teamId,
            defenseTeamId: defenseTeamBeforePlay.teamId,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log, stats: [] };
    },

    processPAT: function (game: ExpressGame, isMade: boolean, offenseTeamBeforePlay: Team, defenseTeamBeforePlay: Team): ProcessPlayResult {
        let gameAfterPlay = structuredClone(game);
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things

        let stats: ExpressTeamStat = {
            gameId: game.gameId,
            teamId: offenseTeamBeforePlay.teamId,
            XPA: 1,
            XPM: isMade ? 1 : 0
        }

        gameAfterPlay.situation.currentZone = null;
        gameAfterPlay.situation.mode = "KICKOFF";

        if (isMade) {
            if (offenseTeamBeforePlay.teamId == gameAfterPlay.homeTeamId) {
                gameAfterPlay.situation.homeScore += 1;
            } else {
                gameAfterPlay.situation.awayScore += 1;
            }
        }

        this.checkForEndOfQuarter(gameAfterPlay);

        let message = `${offenseTeamBeforePlay.abbreviation} PAT is ${isMade ? "good!" : "no good!"}`;

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: offenseTeamBeforePlay.teamId,
            defenseTeamId: defenseTeamBeforePlay.teamId,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log, stats: [stats] };
    },

    process2PT: function (game: ExpressGame, isMade: boolean, offenseTeamBeforePlay: Team, defenseTeamBeforePlay: Team): ProcessPlayResult {
        let gameAfterPlay = structuredClone(game);
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things

        gameAfterPlay.situation.currentZone = null;
        gameAfterPlay.situation.mode = "KICKOFF";

        if (isMade) {
            if (offenseTeamBeforePlay.teamId == gameAfterPlay.homeTeamId) {
                gameAfterPlay.situation.homeScore += 2;
            } else {
                gameAfterPlay.situation.awayScore += 2;
            }
        }

        this.checkForEndOfQuarter(gameAfterPlay);

        let message = `${offenseTeamBeforePlay.abbreviation} 2-pt try is ${isMade ? "successful!" : "unsuccessful!"}`;

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: offenseTeamBeforePlay.teamId,
            defenseTeamId: defenseTeamBeforePlay.teamId,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log, stats: [] };
    },

    processFieldGoal: function (game: ExpressGame, isMade: boolean, offenseTeamBeforePlay: Team, defenseTeamBeforePlay: Team): ProcessPlayResult {
        let gameAfterPlay = structuredClone(game);
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        if (!gameBeforePlay.situation.currentZone) throw new Error("Current zone is required to process a field goal");

        let stats: ExpressTeamStat = {
            gameId: game.gameId,
            teamId: offenseTeamBeforePlay.teamId,
            FGA: 1,
            FGM: isMade ? 1 : 0
        }


        gameAfterPlay.situation.currentZone = null;
        gameAfterPlay.situation.mode = "KICKOFF";

        if (isMade) {
            if (offenseTeamBeforePlay.teamId == gameAfterPlay.homeTeamId) {
                gameAfterPlay.situation.homeScore += 3;
            } else {
                gameAfterPlay.situation.awayScore += 3;
            }
        } else {

            // possession changes on a missed FG
            this.swapPossession(gameAfterPlay);

            // Reverse the field position for the defense, since they take over on downs where the offense left off
            this.setNewZone(gameAfterPlay, this.getReverseZone(gameBeforePlay.situation.currentZone)); // missed FG possession starts at zone 7
        }

        let message = `${offenseTeamBeforePlay.abbreviation} FG attempt is ${isMade ? "good!" : "no good!"}`;

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: offenseTeamBeforePlay.teamId,
            defenseTeamId: defenseTeamBeforePlay.teamId,
            scoringTeamId: isMade ? offenseTeamBeforePlay.teamId : undefined,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log, stats: [stats] };
    },

    processPunt: function (game: ExpressGame, finalZone: number, offenseTeamBeforePlay: Team, defenseTeamBeforePlay: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);

        gameAfterPlay.situation.mode = "DRIVE";
        this.advanceClock(gameAfterPlay);
        this.setNewZone(gameAfterPlay, this.getReverseZone(finalZone));
        this.swapPossession(gameAfterPlay);

        let scoreResult = this.checkForScore(gameAfterPlay); // sacks can't score, but we need to check for safeties
        let isTouchdown = scoreResult === "TOUCHDOWN";

        // Build the message
        let message = `${offenseTeamBeforePlay?.abbreviation} Punts to zone ${finalZone}`;
        if (isTouchdown) {
            message += `, returned for TD!`;
            gameAfterPlay.situation.mode = "PAT";
        }

        if (!isTouchdown) this.checkForEndOfQuarter(gameAfterPlay);

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: defenseTeamBeforePlay.teamId,
            defenseTeamId: offenseTeamBeforePlay.teamId,
            TD: isTouchdown ? 1 : 0,
            scoringTeamId: isTouchdown ? defenseTeamBeforePlay.teamId : undefined,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log, stats: [] };
    },

    /**************************************************************************************************************************
    * Helper functions
    **************************************************************************************************************************/
    swapPossession: function (gameAfterPlay: ExpressGame) {
        if (gameAfterPlay.situation.possessionId == null) throw new Error("Possession ID is required to swap possession");
        gameAfterPlay.situation.possessionId = gameAfterPlay.situation.possessionId == gameAfterPlay.homeTeamId
            ? gameAfterPlay.awayTeamId
            : gameAfterPlay.homeTeamId;
    },

    getReverseZone: function (zone: number): number {
        return (9 - zone);
    },

    reverseField: function (gameAfterPlay: ExpressGame) {
        if (!gameAfterPlay?.situation?.currentZone) throw new Error("Game is required");
        gameAfterPlay.situation.currentZone = this.getReverseZone(gameAfterPlay.situation.currentZone);
    },

    calculateYardage: function (startZone: number, delta: number) {
        let newZone = startZone + delta;
        let yardsGained = 0;
        let modifier = delta < 0 ? -1 : 1; // determine if we're moving forward or backward

        for (let z = Math.min(startZone, newZone); z < Math.max(startZone, newZone); z++) {
            const zoneYards = (z === 1 || z === 2 || z === 7 || z === 8) ? 10 : 15;
            yardsGained += modifier * zoneYards;
        }
        return yardsGained;
    },

    setRelativeZone: function (gameAfterPlay: ExpressGame, zones: number) {
        if (!gameAfterPlay) throw new Error("Game is required");

        if (gameAfterPlay.situation.currentZone == null) throw new Error("You cannot move the ball when the currentZone is not set");

        let newZone = zones + gameAfterPlay.situation.currentZone;

        newZone = zones > 0
            ? Math.min(9, newZone)
            : Math.max(0, newZone);

        gameAfterPlay.situation.currentZone = newZone;

        return gameAfterPlay;
    },

    setNewZone: function (gameAfterPlay: ExpressGame, finalZone: number) {
        if (!gameAfterPlay) throw new Error("Game is required");

        let newZone = finalZone > 0
            ? Math.min(9, finalZone)
            : Math.max(0, finalZone);

        gameAfterPlay.situation.currentZone = newZone;

        return gameAfterPlay;
    },

    // If a TD is scored, we don't perform all of the clock advancement logicf
    advanceClock: function (gameAfterPlay: ExpressGame) {
        if (!gameAfterPlay.situation.quarter) throw new Error("Quarter is required to advance the clock");
        gameAfterPlay.situation.minute--;
    },

    checkForEndOfQuarter: function (gameAfterPlay: ExpressGame) {
        if (!gameAfterPlay.situation.quarter) throw new Error("Quarter is required to check for end of quarter");

        let isEndOfQuarter = gameAfterPlay.situation.minute <= 0;
        let isEndOfHalf = isEndOfQuarter && (gameAfterPlay.situation.quarter == 2);
        let isEndOfRegulation = isEndOfQuarter && (gameAfterPlay.situation.quarter == 4);
        let isEndOfOvertime = isEndOfQuarter && (gameAfterPlay.situation.quarter == 5);
        let isGameTied = gameAfterPlay.situation.homeScore == gameAfterPlay.situation.awayScore;

        if (isEndOfOvertime) {
            gameAfterPlay.situation.mode = "FINAL";

        } else if (isEndOfRegulation) {
            gameAfterPlay.situation.mode = isGameTied ? "OT COIN TOSS" : "FINAL";

            gameAfterPlay.situation.minute = 15;
            gameAfterPlay.situation.possessionId = null; // reset possession for the OT coin toss

        } else if (isEndOfHalf) {
            gameAfterPlay.situation.mode = "EOH";

            gameAfterPlay.situation.minute = 0;
            gameAfterPlay.situation.possessionId = null;

        } else if (isEndOfQuarter) {
            gameAfterPlay.situation.quarter++;
            gameAfterPlay.situation.minute = 15;
        }
    },

    checkForScore: function (gameAfterPlay: ExpressGame): ScoreResult {
        const TDzone = 9;
        const safetyZone = 0;

        let isTouchdown = gameAfterPlay.situation.currentZone == TDzone;
        let isSafety = gameAfterPlay.situation.currentZone == safetyZone;

        if (isTouchdown) {
            gameAfterPlay.situation.mode = "PAT";

            if (gameAfterPlay.situation.possessionId == gameAfterPlay.homeTeamId) {
                gameAfterPlay.situation.homeScore += 6;
            } else {
                gameAfterPlay.situation.awayScore += 6;
            }
        } else if (isSafety) {
            gameAfterPlay.situation.mode = "KICKOFF";

            if (gameAfterPlay.situation.possessionId == gameAfterPlay.homeTeamId) {
                gameAfterPlay.situation.awayScore += 2;
            } else {
                gameAfterPlay.situation.homeScore += 2;
            }
        }

        if (isTouchdown) return "TOUCHDOWN";
        if (isSafety) return "SAFETY";

        return null;
    }

};

