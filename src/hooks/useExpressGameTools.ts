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
      const moveBall = async (zones: number, type: "pass" | "run" | "KR" | "PR", usesTime: boolean) : Promise<void> => {
        const currentZone = game.data.situation.currentZone ?? 0;
        let gameAfterPlay = {...game};
        let playMinute = game.data.situation.minute; // store this for the log to indicate what time the play happened

        if(!gameAfterPlay.data.situation.currentZone) throw new Error("You cannot move the ball when the currentZone is not set");

        let isTouchdown = false;
        let newZone = zones + gameAfterPlay.data.situation.currentZone;
                       
        newZone = zones > 0
            ? Math.min(9, newZone)
            : Math.max(0, newZone);        

        gameAfterPlay.data.situation.currentZone = newZone;
        let delta = newZone - currentZone;
        
        if(usesTime) gameAfterPlay.data.situation.minute++;
        
        if(newZone === 9) {
            isTouchdown = true;
            gameAfterPlay.data.situation.mode = "PAT";

            if(offenseTeam == homeTeam.data) {
                gameAfterPlay.data.situation.homeScore += 6;
            } else {
                gameAfterPlay.data.situation.awayScore += 6;
            }
        }

        saveGameMutation.mutate(gameAfterPlay.data);

        // yardsGained needs to get calculated based on old zone and new zone.  For every zone moved into, it's either 10 yards or 15.
        // Zones 1, 2, 7, 8 are worth 10 yards
        // Zones 3, 4, 5, 6 are worth 15 yards
        // Zones 0 and 9 are endzones.  If a score happens from the 8th zone, only add the yards if you haven't already logged the yards
        // Basically if you START THE DRIVE in 8 and score, you get 10 yards, otherwise the 10 was already logged when you moved into the 
        // 8th zone on a previous play.
        // Sacks and losses do not remove yards
        //let yardsGained = 0; // Temporary for now
        
        let yardsGained = 0;
        if(zones > 0) {
            for(let z = currentZone + 1; z <= newZone; z++) {
                if(z === 0 || z === 9) {
                    yardsGained += 10; // endzones
                } else if(z >= 3 && z <= 6) {
                    yardsGained += 15; // 30, 40, 50
                } else {
                    yardsGained += 10; // 10, 20
                }
            }
        }

        //console.log("currentZone", currentZone, "newZone", newZone, "yardsGained", yardsGained);

        let message = "UNKNOWN PLAY TYPE";
        switch(type) {
            case "pass":
                message = `${offenseTeam?.abbreviation} pass sequence ${delta} zone${delta === 1 ? "" : "s"}`;
                message += isTouchdown ? ` for a TD!` : ` to zone ${newZone}`;
                break;
            case "run":
                message = `${offenseTeam?.abbreviation} run sequence ${delta} zone${delta === 1 ? "" : "s"}`;
                message += isTouchdown ? ` for a TD!` : ` to zone ${newZone}`;
                break;
            case "KR":
                message = `${offenseTeam?.abbreviation} returns the kickoff`;
                message += isTouchdown ? ` ${delta} zones for a TD!` : ` to zone ${newZone}`;
                break;
            case "PR":
                message = `${offenseTeam?.abbreviation} returns the punt`;
                message += isTouchdown ? ` ${delta} zones for a TD!` : ` to zone ${newZone}`;
                break;
        }

        logPlayMutation.mutate({      
            situation: gameAfterPlay.data.situation,
            message,
            date: new Date().toISOString(),
            gameId: gameId,
            yardsGained,
            teamId: offenseTeam?.teamId || "",
            logId: crypto.randomUUID(),
            TD: isTouchdown ? 1 : 0,
            playMinute
        });
      }

      // Clock display formatter
      const clockDisplay = (minute: number) => minute.toString().padStart(2, "0") + ":00";

    return {
        gameUrl,
        moveBall,
        clockDisplay,
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
