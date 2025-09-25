// react
import { useNavigate } from 'react-router-dom';

// icons
import { IoMdAmericanFootball } from "react-icons/io";

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
  const handleCoinFlip = (receivingTeamId: string) => {    
    let kickingTeam = receivingTeamId == awayTeam.teamId ? homeTeam : awayTeam;
    let receivingTeam = receivingTeamId == awayTeam.teamId ? awayTeam : homeTeam;

    let gameAfterPlay = {...game};

    let playMinute = game.situation.minute;  // store this so we can add it to the play log
    gameAfterPlay.situation.possessionId = kickingTeam.teamId; // kicking team kicks off, receiving team receives
    gameAfterPlay.situation.mode = "KICKOFF";
    saveGameMutation.mutate(gameAfterPlay);

    /*
     I need to update the game to the new situation to reflect the play.  Then I need to log the game situation as it was before the play so we can undo/reset to that point if needed.
     I also need the play log to reflect what minute the play happened at.
    */
     let playLog: PlayLog = {      
      situation: game.situation,
      message: `${receivingTeam.abbreviation} will receive the kickoff`,
      date: new Date().toISOString(),
      gameId: gameId,
      yardsGained: null,
      offenseTeamId: kickingTeam.teamId,
      defenseTeamId: receivingTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute
    }

    logPlayMutation.mutate(playLog);
    navigate(gameUrl("kickoff"));
  }

  const handleTurnoverOnDowns = () => {
    // Increase minute
    // Change possession
    // Recalculate new zone
    // Switch quarters if necessary (maybe make a "update clock" function that handles this logic)
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
        
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-center text-xl font-bold">  
                <div className="flex justify-center items-center">
                  {game.situation.possessionId == homeTeam.teamId && <IoMdAmericanFootball className="mr-2 text-brown-600" />}
                  {homeTeam.abbreviation}&nbsp;&nbsp;&nbsp;<span className="text-blue-700">{game.situation.homeScore}</span>
                </div>
              </td>             
              
              <td className="text-center text-xl font-bold justify-center items-center">  
                 <div className="flex justify-center items-center">
                  {game.situation.possessionId == awayTeam.teamId && <IoMdAmericanFootball className="mr-2 text-brown-600" />}
                  {awayTeam.abbreviation}&nbsp;&nbsp;&nbsp;<span className="text-red-700">{game.situation.awayScore}</span>
                </div>
              </td>
                
            </tr>
          </tbody>
        </table>

        <table className="w-full table-fixed">
          <tbody>
            <tr>
              <td className="px-2 text-center text-2xl">{clockDisplay(game.situation.minute)}</td>
            </tr>

            <tr>
              <td className="px-2 text-center">Ball on {game.situation.currentZone}</td>
            </tr>
          </tbody>
        </table>

        <table className="mb-6 w-1/2 table-fixed mx-auto">
          <tbody>
            <tr>
              <td className="text-center"><span className="font-bold">Quarter:</span> {game.situation.quarter}</td>
              <td className="text-center"><span className="font-bold">Mode:</span> {game.situation.mode}</td>
            </tr>
          </tbody>
        </table>  

        {game.situation.mode == "PREGAME" && 
          <>
          <div className="text-center font-bold mb-4">Who will receive?</div>
          <div className="mb-4 flex justify-center items-center gap-2">
            <Button onClick={() => handleCoinFlip(awayTeam.teamId)}>{awayTeam.abbreviation}</Button>
            <Button onClick={() => handleCoinFlip(homeTeam.teamId)}>{homeTeam.abbreviation}</Button>
          </div>
          </>
        }        

        {game.situation.mode == "KICKOFF" && 
          <ButtonLink to={gameUrl("kickoff")} className="mr-2 mb-2">
            Kickoff
          </ButtonLink>
        }

         {game.situation.mode == "PAT" && 
          <ButtonLink to={gameUrl("pat")} className="mr-2 mb-2">
            PAT / 2PT
          </ButtonLink>
        }

        {game.situation.mode == "DRIVE" && 
          <div className="mb-4 flex justify-center items-center">
            <ButtonLink to={gameUrl("pass")} className="mr-2 mb-2">
              Pass
            </ButtonLink>

            <ButtonLink to={gameUrl("run")} className="mr-2 mb-2">
              Run
            </ButtonLink>

            <ButtonLink to={gameUrl("fg")} className="mr-2 mb-2">
              FG
            </ButtonLink>

            <ButtonLink to={gameUrl("punt")} className="mr-2 mb-2">
              Punt
            </ButtonLink>

            <Button onClick={handleTurnoverOnDowns} className="mr-2 mb-2">
              TOD
            </Button>
          </div>
        }

        <div className="mb-8 text-center">
          <ButtonLink color="info" to={gameUrl("stats")} className="mr-2">
            Stats
          </ButtonLink>

          <Button onClick = {handleUndo} color="secondary">
            Undo
          </Button>
        </div>

        {playLogs.data.map(log => {
          return <div className="text-center" key={log.logId}><span className="font-bold">{clockDisplay(log.playMinute)}</span> - {log.message}</div>
        })}

      </ContentWrapper>
    </>
  );
}