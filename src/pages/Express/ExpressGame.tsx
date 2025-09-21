// react
import { useNavigate } from 'react-router-dom';

// hooks
import usePageTitle from '@/hooks/usePageTitle'

// components
import ContentWrapper from "@/components/ContentWrapper";

// queries
import { usePlayLogs } from '@/queries/playLogQueries';

// elements
import Button from '@/components/Elements/Button';
import ButtonLink from '@/components/Elements/ButtonLink';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import { PlayLog } from '@/types/PlayLog';


// This is the main entry point for a game
export default function ExpressGame() {

  const {game, awayTeam, homeTeam, gameId, gameUrl, saveGameMutation, logPlayMutation, undoMutation, clockDisplay} = useExpressGameTools();
  const navigate = useNavigate(); 
  const playLogs = usePlayLogs(gameId);

  usePageTitle("Express Gameday");

  // functions
  const handleCoinFlip = (teamId: string) => {    
    let coinTossWinner = teamId == awayTeam.teamId ? awayTeam : homeTeam;

    let gameAfterPlay = {...game};

    let playMinute = game.situation.minute;  // store this so we can add it to the play log
    gameAfterPlay.situation.possessionId = teamId;
    gameAfterPlay.situation.mode = "KICKOFF";
    saveGameMutation.mutate(gameAfterPlay);


    /*
     I need to update the game to the new situation to reflect the play.  Then I need to log the game situation as it was before the play so we can undo/reset to that point if needed.
     I also need the play log to reflect what minute the play happened at.
    */
     let playLog: PlayLog = {      
      situation: game.situation,
      message: `${coinTossWinner.abbreviation} wins the coin toss`,
      date: new Date().toISOString(),
      gameId: gameId,
      yardsGained: null,
      teamId: coinTossWinner.teamId,
      logId: crypto.randomUUID(),
      playMinute
    }

    logPlayMutation.mutate(playLog);
    navigate(gameUrl("kickoff"));
  }

  const handleUndo = () => {
    if(confirm("Are you sure you want to undo the last action?")){
      // delete the most recent play log for this game
      // if there are no more play logs left, reset the game to pregame state
      // invalidate log and game queries
      undoMutation.mutate(game);
    }
  }

  return (
    <>
      <ContentWrapper>

        <table className="mb-6 w-full table-fixed border">
          <tbody>
            <tr>
              <td className="p-2 w-28 font-bold pr-4 border border-black">Home:</td>
              <td className="p-2 border border-black">{game.situation.homeScore}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Away:</td>
              <td className="p-2 border border-black">{game.situation.awayScore}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Zone:</td>
              <td className="p-2 border border-black">{game.situation.currentZone}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Minute:</td>
              <td className="p-2 border border-black">{game.situation.minute}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Possession:</td>
              <td className="p-2 border border-black">{game.situation.possessionId}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Quarter:</td>
              <td className="p-2 border border-black">{game.situation.quarter}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black ">Mode:</td>
              <td className="p-2 border border-black">{game.situation.mode}</td>
            </tr>
          </tbody>
        </table>

        {game.situation.mode == "PREGAME" && 
          <>
          <Button onClick={() => handleCoinFlip(awayTeam.teamId)}>{awayTeam.abbreviation}</Button>
          <Button onClick={() => handleCoinFlip(homeTeam.teamId)}>{homeTeam.abbreviation}</Button>
          </>
        }        

        <Button onClick = {handleUndo} color="secondary">
          Undo
        </Button>

        {game.situation.mode == "KICKOFF" && 
          <ButtonLink to={gameUrl("kickoff")} className="mr-2 mb-2">
            Kickoff
          </ButtonLink>
        }

        {game.situation.mode == "DRIVE" && 
          <>
          <ButtonLink to={gameUrl("pass")} className="mr-2 mb-2">
            Pass Play
          </ButtonLink>

          <ButtonLink to={gameUrl("run")} className="mr-2 mb-2">
            Run Play
          </ButtonLink>
          </>
        }

        {playLogs.data.map(log => {
          return <div key={log.logId}>{clockDisplay(log.playMinute)} - {log.message}</div>
        })}

      </ContentWrapper>
    </>
  );
}