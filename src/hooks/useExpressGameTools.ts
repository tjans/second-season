import { useExpressGame, useSaveGame, useUndo } from "@/queries/expressGameQueries";
import { useLogPlay } from "@/queries/playLogQueries";
import { useTeam } from "@/queries/teamQueries";
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

      const moveBall = async (zones: number, usesTime: boolean) : Promise<void> => {
        if(!game.data.situation.currentZone) throw new Error("You cannot move the ball when the currentZone is not set")

        let newZone = zones + game.data.situation.currentZone;
        //let delta = newZone - game.data.situation.currentZone;

        newZone = zones > 0
            ? Math.min(9, newZone)
            : Math.max(0, newZone);        

        game.data.situation.currentZone = newZone;
        if(usesTime) game.data.situation.minute++;
        saveGameMutation.mutate(game.data);

        // yardsGained needs to get calculated based on old zone and new zone.  For every zone moved into, it's either 10 yards or 15.
        // Zones 1, 2, 7, 8 are worth 10 yards
        // Zones 3, 4, 5, 6 are worth 15 yards
        // Zones 0 and 9 are endzones.  If a score happens from the 8th zone, only add the yards if you haven't already logged the yards
        // Basically if you START THE DRIVE in 8 and score, you get 10 yards, otherwise the 10 was already logged when you moved into the 
        // 8th zone on a previous play.
        
        let yardsGained = 0; // Temporary for now

        logPlayMutation.mutate({      
            situation: game.data.situation,
            message: `${offenseTeam?.abbreviation} completes a pass to zone ${newZone}`,
            date: new Date().toISOString(),
            gameId: game.data.gameId,
            yardsGained: yardsGained,
            teamId: offenseTeam?.teamId || "",
            logId: crypto.randomUUID(),
            playMinute: game.data.situation.minute
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
