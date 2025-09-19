// react
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// hooks
import usePageTitle from '@/hooks/usePageTitle'

// components
import ContentWrapper from "@/components/ContentWrapper";

// queries
import { useExpressGame, useSaveGame, useUndo } from '@/queries/expressGameQueries';
import { useTeam } from '@/queries/teamQueries';
import { useLogPlay, usePlayLogs } from '@/queries/playLogQueries';

// elements
import Button from '@/components/Elements/Button';
import ButtonLink from '@/components/Elements/ButtonLink';



// This is the main entry point for a game
export default function ExpressGame() {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId) throw new Error("gameId is required");

  const navigate = useNavigate();
  
  // queries - game is never garbage collected, always cached until invalidated
  const game = useExpressGame(gameId, { staleTime: Infinity });
  const homeTeam = useTeam(game.data?.homeTeamId || "", { staleTime: Infinity });
  const awayTeam = useTeam(game.data?.awayTeamId || "", { staleTime: Infinity });
  const playLogs = usePlayLogs(gameId);

  // mutations
  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();
  const useUndoMutation = useUndo();

  usePageTitle("Express Gameday");

  // functions
  const handleCoinFlip = (teamId: string) => {    
    let coinTossWinner = teamId == game.data.awayTeamId ? awayTeam.data : homeTeam.data;

    let gameData = {...game.data};

    logPlayMutation.mutate({      
      situation: game.data.situation,
      message: `${coinTossWinner.abbreviation} wins the coin toss`,
      date: new Date().toISOString(),
      gameId: game.data.gameId,
      yardsGained: null,
      teamId: coinTossWinner.teamId,
      logId: crypto.randomUUID()
    });

    gameData.situation.possessionId = teamId;
    gameData.situation.mode = "KICKOFF";
    saveGameMutation.mutate(gameData);
    navigate(`/express/game/${gameId}/kickoff`);
  }

  const handleUndo = () => {
    if(confirm("Are you sure you want to undo the last action?")){
      // delete the most recent play log for this game
      // if there are no more play logs left, reset the game to pregame state
      // invalidate log and game queries
      useUndoMutation.mutate(game.data);
    }
  }

  return (
    <>
      <ContentWrapper>

        <table className="mb-6 w-full table-fixed border">
          <tbody>
            <tr>
              <td className="p-2 w-28 font-bold pr-4 border border-black">Home:</td>
              <td className="p-2 border border-black">{game.data.situation.homeScore}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Away:</td>
              <td className="p-2 border border-black">{game.data.situation.awayScore}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Zone:</td>
              <td className="p-2 border border-black">{game.data.situation.currentZone}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Minute:</td>
              <td className="p-2 border border-black">{game.data.situation.minute}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Possession:</td>
              <td className="p-2 border border-black">{game.data.situation.possessionId}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Quarter:</td>
              <td className="p-2 border border-black">{game.data.situation.quarter}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Mode:</td>
              <td className="p-2 border border-black">{game.data.situation.mode}</td>
            </tr>
          </tbody>
        </table>

        {game.data.situation.mode == "PREGAME" && 
          <>
          <Button onClick={() => handleCoinFlip(awayTeam.data.teamId)}>{awayTeam.data.abbreviation}</Button>
          <Button onClick={() => handleCoinFlip(homeTeam.data.teamId)}>{homeTeam.data.abbreviation}</Button>
          </>
        }        

        <Button onClick = {handleUndo} color="secondary">
          Undo
        </Button>

        {game.data.situation.mode == "KICKOFF" && 
          <ButtonLink to={`/express/game/${gameId}/kickoff`} className="mr-2 mb-2">
            Kickoff
          </ButtonLink>
        }

        {playLogs.data.map(log => {
          return <div key={log.logId}>{log.situation.minute}: {log.message}</div>
        })}

      </ContentWrapper>
    </>
  );
}