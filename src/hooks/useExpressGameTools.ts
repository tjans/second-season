import { useExpressGame } from "@/queries/expressGameQueries";
import { useParams } from "react-router-dom";

const useExpressGameTools = () => {
    const { gameId } = useParams<{ gameId: string }>();
      if (!gameId) throw new Error("gameId is required");
    
      const game = useExpressGame(gameId, { staleTime: Infinity });
      if(!game.data) throw new Error("game data is required");

    return {
        game
    };
}

export default useExpressGameTools;
