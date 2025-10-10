import { ExpressGame } from "@/types/ExpressGame";
import { MutablePlayLog, PlayLog } from "@/types/PlayLog";
import { ScoreResult } from "@/types/ScoreResult";
import { Team } from "@/types/Team";
import { reverse } from "dns";

type ProcessPlayResult = {
    gameAfterPlay: ExpressGame;
    log: MutablePlayLog;
}

export default {

    /**************************************************************************************************************************
    * Main functions to process plays
    **************************************************************************************************************************/
    processPass: function (game: ExpressGame, zones: number, offenseTeam: Team, defenseTeam: Team): ProcessPlayResult {
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
        let rushYardsGained = 0;
        let passYardsGained = this.calculateYardage(gameBeforePlay.situation.currentZone ?? 0, actualDelta);

        // Build the message
        let message = "UNKNOWN PASS PLAY";
        message = `${offenseTeam?.abbreviation} pass sequence for ${actualDelta} zone${actualDelta === 1 ? "" : "s"}`;
        if (isTouchdown) message += `, TD!`;
        if (isSafety) message += `, SAFETY!`;

        // If it's a safety, we need to swap possession
        if (isSafety) this.swapPossession(gameAfterPlay);

        let log = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,

            passYardsGained: passYardsGained,
            rushYardsGained: rushYardsGained,
            offenseTeamId: offenseTeam.teamId,
            defenseTeamId: defenseTeam.teamId,
            TD: isTouchdown ? 1 : 0,
            Safeties: isSafety ? 1 : 0,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        }

        return { gameAfterPlay, log };
    },

    processInterception: function (game: ExpressGame, finalZone: number, offenseTeam: Team, defenseTeam: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);

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

        return { gameAfterPlay, log };
    },

    processSack: function (game: ExpressGame, zonesLost: number, offenseTeam: Team, defenseTeam: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);

        let passYardsLost = zonesLost * 7; // sacks are a flat 7 yards per zone lost

        this.advanceClock(gameAfterPlay);
        this.setRelativeZone(gameAfterPlay, zonesLost);

        let scoreResult = this.checkForScore(gameAfterPlay); // sacks can't score, but we need to check for safeties
        let isSafety = scoreResult === "SAFETY";

        let message = `${offenseTeam?.abbreviation} is sacked`;
        if (zonesLost < 0) {
            message += ` for a loss to zone ${gameAfterPlay.situation.currentZone}`;
            if (isSafety) message += ", SAFETY!"
        } else {
            message += `, same zone.`;
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

        return { gameAfterPlay, log };
    },

    processKickoff: function (game: ExpressGame, finalZone: number, homeTeamBeforePlay: Team, awayTeamBeforePlay: Team): ProcessPlayResult {
        let gameBeforePlay = structuredClone(game); // for calculating the delta of zones moved, and other things
        let gameAfterPlay = structuredClone(game);

        gameAfterPlay.situation.mode = "DRIVE";
        this.advanceClock(gameAfterPlay);
        this.setNewZone(gameAfterPlay, finalZone);
        this.swapPossession(gameAfterPlay);

        let scoreResult = this.checkForScore(gameAfterPlay); // sacks can't score, but we need to check for safeties
        let isTouchdown = scoreResult === "TOUCHDOWN";

        // Build the message
        let message = `${homeTeamBeforePlay?.abbreviation} kickoff to zone ${finalZone}`;
        if (isTouchdown) message += `, returned for TD!`;

        let log: MutablePlayLog = {
            gameId: gameAfterPlay.gameId,
            situation: gameAfterPlay.situation,
            message,
            offenseTeamId: awayTeamBeforePlay.teamId,
            defenseTeamId: homeTeamBeforePlay.teamId,
            TD: isTouchdown ? 1 : 0,
            scoringTeamId: isTouchdown ? awayTeamBeforePlay.teamId : undefined,
            playMinute: gameBeforePlay.situation.minute // store this for the log to indicate what time the play happened
        };

        return { gameAfterPlay, log };
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

    advanceClock: function (gameAfterPlay: ExpressGame) {
        return gameAfterPlay.situation.minute++;
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


/*
  /// Helper function to move the ball down the field.  Handles TDs, safeties, and logging yards as you enter new zones.
    const moveBall = async (
        zones: number,
        type: PlayTypes,
        usesTime: boolean,
        setZone: boolean = false,
        isFumble: boolean = false
    ): Promise<void> => {

        const currentZone = game.data.situation.currentZone ?? 0;
        let gameAfterPlay = { ...game };
        let playMinute = game.data.situation.minute; // store this for the log to indicate what time the play happened

        let offenseTeamId = game.data.situation.possessionId;
        let defenseTeamId = offenseTeamId === game.data.homeTeamId ? game.data.awayTeamId : game.data.homeTeamId;

        if (!offenseTeamId) throw new Error("Offense team is required");
        if (!defenseTeamId) throw new Error("Defense team is required");
        if (!gameAfterPlay.data.situation.currentZone) throw new Error("You cannot move the ball when the currentZone is not set"); 

        let isPunt = type === "punt";
        let isTouchdown = false;
        let isSafety = false;
        let isInterception = false;
        let newZone = zones + gameAfterPlay.data.situation.currentZone;

        // setZone means we're placing the ball, not setting it relative to current zone
        if (setZone) {
            newZone = zones > 0
                ? Math.min(9, zones)
                : Math.max(0, zones);
        } else {
            newZone = zones > 0
                ? Math.min(9, newZone)
                : Math.max(0, newZone);
        }

        let delta = newZone - currentZone;

        // TIMING CHECK
        if (usesTime) gameAfterPlay.data.situation.minute++;

        // SCORING CHECK - TD, SAFETY
        if (newZone === 9 && !isPunt) {
            isTouchdown = true;
            gameAfterPlay.data.situation.mode = "PAT";

            if (offenseTeam.teamId == homeTeam.data.teamId) {
                gameAfterPlay.data.situation.homeScore += 6;
            } else {
                gameAfterPlay.data.situation.awayScore += 6;
            }

        } else if (newZone === 0 && type === "sack") {
            isSafety = true;
            gameAfterPlay.data.situation.mode = "KICKOFF";

            if (offenseTeam.teamId == homeTeam.data.teamId) {
                gameAfterPlay.data.situation.awayScore += 2;
            } else {
                gameAfterPlay.data.situation.homeScore += 2;
            }

        } else if (newZone === 0 && (type === "interception" || isPunt)) {
            gameAfterPlay.data.situation.mode = "PAT";

            if (offenseTeam.teamId == homeTeam.data.teamId) {
                gameAfterPlay.data.situation.awayScore += 6;
            } else {
                gameAfterPlay.data.situation.homeScore += 6;
            }
        }

        
            if minute > 15 and Q1/Q3, set to minute 1 and Q2/Q4
            if minute > 15 and Q2
                set to minute 1 and Q3
                set possession to correct team (team who won toss in first half)
                set currentZone to null
            if minute > 15 and Q4
                set to minute 1 and OT
                new coin toss        

        // Check for POSSESSION CHANGE - interceptions and punts
        if (type === "interception" || isPunt) {
            gameAfterPlay.data.situation.possessionId = defenseTeam?.teamId || "";
        }

        // SET NEW ZONE (newZone is pre-flip, situation.currentZone is post-flip)
        if (isPunt || type === "interception") {
            // touchback on punt puts ball at zone 7 (check for punt touchback yard line?)
            //newZone < 9 ? newZone : gameAfterPlay.data.situation.currentZone = 7; 
            if (newZone === 9) {
                gameAfterPlay.data.situation.currentZone = getReverseZone(7);
            } else {
                gameAfterPlay.data.situation.currentZone = getReverseZone(newZone);
            }

        } else {
            gameAfterPlay.data.situation.currentZone = newZone;
        }

        // YARDAGE CHECK - Skip this for interceptions, and handle sacks a little differently.
        // We need to track whether we've included the 10 yards for entering zone 8.  If they enter zone 8 on a drive, you don't include it if they score from 8 since you've already tallied it.
        // Basically this can be solved by only tallying yards for zones you've just left, not the zone you're entering.
        let yardsGained = 0;

        // Basically gain/loss of yards is tracked on normal drives, not interceptions or punts.

        if (!isFumble) {
            let isDriveGainLoss = type !== "interception" && !isPunt;

            if (zones > 0 && isDriveGainLoss) { // moving forward and not an interception
                for (let z = currentZone; z < newZone; z++) {
                    if (z === 1 || z === 2 || z === 7 || z === 8) {
                        yardsGained += 10;
                    } else {
                        yardsGained += 15;
                    }
                }
            } else if (zones < 0 && isDriveGainLoss) { // moving backwards and not an interception
                if (type === "sack") {
                    yardsGained = 7 * delta; // sacks are a flat 7 yards per zone lost
                } else {
                    for (let z = currentZone; z > newZone; z--) {
                        if (z === 8 || z === 7 || z === 2 || z === 1) {
                            yardsGained -= 10;
                        } else {
                            yardsGained -= 15;
                        }
                    }
                }
            }
        }

        // MESSAGE BUILDER - create the message for the play log based on what happened in the play
        // At this point, newZone is the "pre-flipped" zone, situation.currentZone is the flipped zone if there was a possession change.

        // HANDLE FUMBLES 
        let message = "UNKNOWN PLAY TYPE";
        switch (type) {
            case "pass":
                message = `${offenseTeam?.abbreviation} pass sequence for ${delta} zone${delta === 1 ? "" : "s"}`;
                message += isTouchdown ? `, TD!` : ``;
                break;

            case "run":
                message = `${offenseTeam?.abbreviation} run sequence for ${delta} zone${delta === 1 ? "" : "s"}`;
                message += isTouchdown ? `, TD!` : ``;
                break;

            case "punt":
                message = `${offenseTeam?.abbreviation} punts`;
                if (newZone === 9) {
                    message += " for a TOUCHBACK";
                } else if (newZone === 0) {
                    message += `, returned by ${defenseTeam?.abbreviation} for a TD!`;
                } else {
                    message += `, returned to zone ${newZone}`;
                }
                break;

            case "sack":
                message = `${offenseTeam?.abbreviation} is sacked`;
                if (delta < 0) {
                    message += ` for loss of ${delta} zone${delta === -1 ? "" : "s"} to zone ${newZone}`;
                    if (isSafety) message += ", SAFETY!"
                } else {
                    message += `, same zone.`;
                }
                break;

            case "interception":
                isInterception = true;
                message = `${offenseTeam?.abbreviation} pass is intercepted, `;
                message += newZone == 0 ? ` returned for a TD!` : ` returned to zone ${newZone}`;
                break;
        }

        let rushYardsGained = type === "run" ? yardsGained : null;
        let passYardsGained = type === "pass" || type === "sack" ? yardsGained : null;

        // Make sure the stats page doesn't inlcude TD that are interceptions returns since it's recorded as an INT for the offense, and isTD is true, but the TD is actually for the defense.
        logPlayMutation.mutate({
            situation: gameAfterPlay.data.situation,
            message,
            date: new Date().toISOString(),
            gameId: gameId,
            passYardsGained: passYardsGained,
            rushYardsGained: rushYardsGained,
            offenseTeamId,
            defenseTeamId,
            logId: crypto.randomUUID(),
            TD: isTouchdown ? 1 : 0,
            InterceptionTD: type === "interception" && newZone == 0 ? 1 : 0,
            Safeties: isSafety ? 1 : 0,
            Interceptions: isInterception ? 1 : 0,
            playMinute
        });
    }

*/