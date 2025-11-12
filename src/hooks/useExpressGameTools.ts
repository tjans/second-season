import { useExpressGame, useSaveGame, useUndo } from "@/queries/expressGameQueries";
import { useSaveTeamStats } from "@/queries/expressTeamStatQueries";
import { useLogPlay } from "@/queries/playLogQueries";
import { useTeam } from "@/queries/teamQueries";
import { useState } from "react";
import { useParams } from "react-router-dom";

const useExpressGameTools = () => {
    const [isFumble, setIsFumble] = useState(false)
    const { gameId } = useParams<{ gameId: string }>();
    if (!gameId) throw new Error("gameId is required");

    const game = useExpressGame(gameId, { staleTime: Infinity });
    if (!game.data) throw new Error("game data is required");

    const homeTeam = useTeam(game.data?.homeTeamId || "", { staleTime: Infinity });
    const awayTeam = useTeam(game.data?.awayTeamId || "", { staleTime: Infinity });
    const saveGameMutation = useSaveGame();
    const logPlayMutation = useLogPlay();
    const undoMutation = useUndo();
    const saveTeamStatMutation = useSaveTeamStats();

    const offenseTeam = game.data.situation.possessionId === game.data.homeTeamId ? homeTeam.data : awayTeam.data;
    const defenseTeam = game.data.situation.possessionId === game.data.homeTeamId ? awayTeam.data : homeTeam.data;
    const gameUrl = (url: string = "") => `/express/game/${gameId}/${url}`;

    // Clock display formatter
    const clockDisplay = (minute: number) => minute.toString() + ":00";
    const yardDisplay = (zone: number) => {
        if (zone == 0) return "SAFETY";
        if (zone === 9) return "TD";
        return zone;
    }

    const quarterDisplay = () => {
        let quarter = game.data.situation.quarter;

        switch (quarter) {
            case 1: return "1st";
            case 2: return "2nd";
            case 3: return "3rd";
            case 4: return "4th";
            case 5: return "OT";
        }

        return "??";
    }

    return {
        gameUrl,
        clockDisplay,
        yardDisplay,
        quarterDisplay,

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
        undoMutation,
        saveTeamStatMutation,
        isFumble, setIsFumble
    };
}

export default useExpressGameTools;
