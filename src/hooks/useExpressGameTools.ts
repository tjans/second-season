import { useExpressGame, useSaveGame, useUndo } from "@/queries/expressGameQueries";
import { useLogPlay } from "@/queries/playLogQueries";
import { useTeam } from "@/queries/teamQueries";
import { P } from "node_modules/framer-motion/dist/types.d-Cjd591yU";
import { use } from "react";
import { useParams } from "react-router-dom";

const useExpressGameTools = () => {
    const { gameId } = useParams<{ gameId: string }>();
      if (!gameId) throw new Error("gameId is required");
    
      const game = useExpressGame(gameId, { staleTime: Infinity });
      if(!game.data) throw new Error("game data is required");

      const homeTeam = useTeam(game.data?.homeTeamId || "", { staleTime: Infinity });
      const awayTeam = useTeam(game.data?.awayTeamId || "", { staleTime: Infinity });
      const saveGameMutation = useSaveGame();
      const logPlayMutation = useLogPlay();
      const undoMutation = useUndo();

      const offenseTeam = game.data.situation.possessionId === game.data.homeTeamId ? homeTeam.data : awayTeam.data;
      const defenseTeam = game.data.situation.possessionId === game.data.homeTeamId ? awayTeam.data : homeTeam.data;
      const gameUrl = (url:string = "") => `/express/game/${gameId}/${url}`;

      /// Helper function to move the ball down the field.  Handles TDs, safeties, and logging yards as you enter new zones.
      const moveBall = async (zones: number, type: "pass" | "sack" | "interception" | "run" | "KR" | "PR", usesTime: boolean, setZone: boolean = false) : Promise<void> => {
        const currentZone = game.data.situation.currentZone ?? 0;
        let gameAfterPlay = {...game};
        let playMinute = game.data.situation.minute; // store this for the log to indicate what time the play happened
        
        let offenseTeamId = game.data.situation.possessionId;
        let defenseTeamId = offenseTeamId === game.data.homeTeamId ? game.data.awayTeamId : game.data.homeTeamId;

        if(!offenseTeamId) throw new Error("Offense team is required");
        if(!defenseTeamId) throw new Error("Defense team is required");
        if(!gameAfterPlay.data.situation.currentZone) throw new Error("You cannot move the ball when the currentZone is not set");

        let isTouchdown = false;
        let isInterceptionTD = false;
        let isSafety = false;
        let isInterception = false;
        let newZone = zones + gameAfterPlay.data.situation.currentZone;
         
        // setZone means we're placing the ball, not setting it relative to current zone
        if(setZone) {
            newZone = zones;
        } else {
            newZone = zones > 0
                ? Math.min(9, newZone)
                : Math.max(0, newZone);
        }

        gameAfterPlay.data.situation.currentZone = newZone;
        let delta = newZone - currentZone;
        
        if(usesTime) gameAfterPlay.data.situation.minute++;
        
        // Check for TD or safety
        if(newZone === 9) {
            isTouchdown = true;
            gameAfterPlay.data.situation.mode = "PAT";

            if(offenseTeam.teamId == homeTeam.data.teamId) {
                gameAfterPlay.data.situation.homeScore += 6;
            } else {
                gameAfterPlay.data.situation.awayScore += 6;
            }

        } else if(newZone === 0 && type === "sack") {
            isSafety = true;
            gameAfterPlay.data.situation.mode = "KICKOFF";

            if(offenseTeam.teamId == homeTeam.data.teamId) {
                gameAfterPlay.data.situation.awayScore += 2;
            } else {
                gameAfterPlay.data.situation.homeScore += 2;
            }
        } else if(newZone === 0 && type === "interception") {
            isInterceptionTD = true;
            gameAfterPlay.data.situation.mode = "PAT";

            if(offenseTeam.teamId == homeTeam.data.teamId) {
                gameAfterPlay.data.situation.awayScore += 6;
            } else {
                gameAfterPlay.data.situation.homeScore += 6;
            }
        }

        /*
            if minute > 15 and Q1/Q3, set to minute 1 and Q2/Q4
            if minute > 15 and Q2
                set to minute 1 and Q3
                set possession to correct team (team who won toss in first half)
                set currentZone to null
            if minute > 15 and Q4
                set to minute 1 and OT
                new coin toss
        */

        // If interception, we'd need to swap possession
        if(type === "interception") {
            gameAfterPlay.data.situation.possessionId = defenseTeam?.teamId || "";
            
            // the new zone is relative to the offense, but we need to rotate the field because the defense is now on offense
            gameAfterPlay.data.situation.currentZone = 9 - newZone;
        }

        // Save the game situation changes
        //TODO: saveGameMutation.mutate(gameAfterPlay.data);

        let yardsGained = 0;
        
        // Tally the "actual yards" gained or lost.  Skip this for interceptions, and handle sacks a little differently.
        // We need to track whether we've included the 10 yards for entering zone 8.  If they enter zone 8 on a drive, you don't include it if they score from 8 since you've already tallied it.
        // Basically this can be solved by only tallying yards for zones you've just left, not the zone you're entering.

        if(zones > 0 && type != "interception") { // moving forward and not an interception
            for(let z = currentZone; z < newZone; z++) {
                if(z === 1 || z === 2 || z === 7 || z === 8) {
                    yardsGained += 10;
                } else {
                    yardsGained += 15;
                }
            }
        } else if(zones < 0 && type != "interception") { // moving backwards and not an interception
            if(type === "sack") {
                yardsGained = 7 * delta; // sacks are a flat 7 yards per zone lost
            } else {
                for(let z = currentZone; z > newZone; z--) {
                    if(z === 8 || z === 7 || z === 2 || z === 1) {
                        yardsGained -= 10;
                    } else {
                        yardsGained -= 15;
                    }
                }
            }
        }

        let message = "UNKNOWN PLAY TYPE";
        switch(type) {
            case "pass":
                message = `${offenseTeam?.abbreviation} pass sequence ${delta} zone${delta === 1 ? "" : "s"}`;
                message += isTouchdown ? ` for a TD!` : ``;
                break;
            case "run":
                message = `${offenseTeam?.abbreviation} run sequence ${delta} zone${delta === 1 ? "" : "s"}`;
                message += isTouchdown ? ` for a TD!` : ``;
                break;
            case "KR":
                message = `${offenseTeam?.abbreviation} returns the kickoff`;
                message += isTouchdown ? ` ${delta} zones for a TD!` : ` to zone ${newZone}`;
                break;
            case "PR":
                message = `${offenseTeam?.abbreviation} returns the punt`;
                message += isTouchdown ? ` ${delta} zones for a TD!` : ` to zone ${newZone}`;
                break;
            case "sack":
                message = `${offenseTeam?.abbreviation} is sacked`;
                if(delta < 0) {
                    message += ` for loss of ${-delta} zone${delta === -1 ? "" : "s"} to zone ${newZone}`;
                    if(isSafety) message += ", SAFETY!"
                } else {
                    message += `, same zone.`;
                }
               break;
            case "interception":
                isInterception = true;
                message = `${offenseTeam?.abbreviation} pass is intercepted, `;
                message += isInterceptionTD ? ` returned ${delta} zones for a TD!` : ` returned to zone ${newZone}`;
                break;
        }

        let rushYardsGained = type === "run" ? yardsGained : null;
        let passYardsGained = type === "pass" || type==="sack" ? yardsGained : null;

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
            InterceptionTD: isInterceptionTD ? 1 : 0,
            Safeties: isSafety ? 1 : 0,
            Interceptions: isInterception ? 1 : 0,
            playMinute
        });
      }

      // Clock display formatter
      const clockDisplay = (minute: number) => minute.toString() + ":00";
      const yardDisplay = (zone: number) => {
        if(zone == 0) return "SAFETY";
        if(zone === 9) return "TD";
        return zone;
      }

    return {
        gameUrl,
        moveBall,
        clockDisplay,
        yardDisplay,
        gameTools: game,
        game: game.data,
        situation: game.data.situation,
        gameId: game.data.gameId,
        homeTeam: homeTeam.data,
        awayTeam: awayTeam.data,
        offenseTeam,
        defenseTeam,
        saveGameMutation,
        logPlayMutation,
        undoMutation
    };
}

export default useExpressGameTools;
