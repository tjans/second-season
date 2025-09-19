import { useExpressGame } from "@/queries/expressGameQueries";
import { useTeam } from "@/queries/teamQueries";
import { useParams } from "react-router-dom";

const useExpressGameTools = () => {
    const { gameId } = useParams<{ gameId: string }>();
      if (!gameId) throw new Error("gameId is required");
    
      const game = useExpressGame(gameId, { staleTime: Infinity });
      if(!game.data) throw new Error("game data is required");

      const homeTeam = useTeam(game.data?.homeTeamId || "", { staleTime: Infinity });
      const awayTeam = useTeam(game.data?.awayTeamId || "", { staleTime: Infinity });

      const offenseTeam = game.data.situation.possessionId === game.data.homeTeamId ? homeTeam.data : awayTeam.data;
      const defenseTeam = game.data.situation.possessionId === game.data.homeTeamId ? awayTeam.data : homeTeam.data;
      const gameUrl = `/express/${gameId}`;

    return {
        gameUrl,
        gameTools: game,
        game: game.data,
        situation: game.data.situation,
        gameId: game.data.gameId,
        homeTeam: homeTeam.data,
        awayTeam: awayTeam.data,
        offenseTeam,
        defenseTeam
    };
}

export default useExpressGameTools;
