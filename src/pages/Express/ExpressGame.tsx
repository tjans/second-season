// react
import { useNavigate } from 'react-router-dom';

// hooks
import usePageTitle from '@/hooks/usePageTitle'

// components
import ContentWrapper from "@/components/ContentWrapper";

// queries
import { useSaveGame, useUndo } from '@/queries/expressGameQueries';
import { useLogPlay, usePlayLogs } from '@/queries/playLogQueries';

// elements
import Button from '@/components/Elements/Button';
import ButtonLink from '@/components/Elements/ButtonLink';
import useExpressGameTools from '@/hooks/useExpressGameTools';



// This is the main entry point for a game
export default function ExpressGame() {
  
  const expressGameTools = useExpressGameTools();
  const navigate = useNavigate(); 
  const playLogs = usePlayLogs(expressGameTools.gameId);

  // mutations
  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();
  const useUndoMutation = useUndo();

  usePageTitle("Express Gameday");

  // functions
  const handleCoinFlip = (teamId: string) => {    
    let coinTossWinner = teamId == expressGameTools.awayTeam.teamId ? expressGameTools.awayTeam : expressGameTools.homeTeam;

    let gameData = {...expressGameTools.game};

    logPlayMutation.mutate({      
      situation: expressGameTools.situation,
      message: `${coinTossWinner.abbreviation} wins the coin toss`,
      date: new Date().toISOString(),
      gameId: expressGameTools.gameId,
      yardsGained: null,
      teamId: coinTossWinner.teamId,
      logId: crypto.randomUUID()
    });

    gameData.situation.possessionId = teamId;
    gameData.situation.mode = "KICKOFF";
    saveGameMutation.mutate(gameData);
    navigate(`/express/game/${expressGameTools.gameId}/kickoff`);
  }

  const handleUndo = () => {
    if(confirm("Are you sure you want to undo the last action?")){
      // delete the most recent play log for this game
      // if there are no more play logs left, reset the game to pregame state
      // invalidate log and game queries
      useUndoMutation.mutate( expressGameTools.game);
    }
  }

  return (
    <>
      <ContentWrapper>

        <table className="mb-6 w-full table-fixed border">
          <tbody>
            <tr>
              <td className="p-2 w-28 font-bold pr-4 border border-black">Home:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.homeScore}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Away:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.awayScore}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Zone:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.currentZone}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Minute:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.minute}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Possession:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.possessionId}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Quarter:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.quarter}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Mode:</td>
              <td className="p-2 border border-black">{expressGameTools.situation.mode}</td>
            </tr>
          </tbody>
        </table>

        {expressGameTools.situation.mode == "PREGAME" && 
          <>
          <Button onClick={() => handleCoinFlip(expressGameTools.awayTeam.teamId)}>{expressGameTools.awayTeam.abbreviation}</Button>
          <Button onClick={() => handleCoinFlip(expressGameTools.homeTeam.teamId)}>{expressGameTools.homeTeam.abbreviation}</Button>
          </>
        }        

        <Button onClick = {handleUndo} color="secondary">
          Undo
        </Button>

        {expressGameTools.situation.mode == "KICKOFF" && 
          <ButtonLink to={`/express/game/${expressGameTools.gameId}/kickoff`} className="mr-2 mb-2">
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