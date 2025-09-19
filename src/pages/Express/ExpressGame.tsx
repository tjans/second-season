// react
import { useParams } from 'react-router-dom';

// hooks
import usePageTitle from '@/hooks/usePageTitle'

// components
import ContentWrapper from "@/components/ContentWrapper";

// queries
import { useExpressGame, useSaveGame } from '@/queries/expressGameQueries';
import { useTeam } from '@/queries/teamQueries';
import { useLogPlay, usePlayLogs } from '@/queries/playLogQueries';

// elements
import Button from '@/components/Elements/Button';
import ButtonLink from '@/components/Elements/ButtonLink';



// This is the main entry point for a game
export default function ExpressGame() {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId) throw new Error("gameId is required");
  
  // queries
  const game = useExpressGame(gameId, { gcTime: 0 });
  const homeTeam = useTeam(game.data?.homeTeamId || "", { staleTime: Infinity });
  const awayTeam = useTeam(game.data?.awayTeamId || "", { staleTime: Infinity });
  const playLogs = usePlayLogs(gameId);

  // mutations
  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();


  usePageTitle("Express Gameday");

  const handleCoinFlip = (teamId: string) => {
    // set possession, zone, game mode
    
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
  }

  return (
    <>
      <ContentWrapper>

        <table className="mb-6 w-60 border">
          <tbody>
            <tr>
              <td className="p-2 font-bold pr-4 border border-black">Home:</td>
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

        <Button onClick = {() => null} color="secondary">
          Undo
        </Button>

        {game.data.situation.mode == "KICKOFF" && 
          <ButtonLink to={`/express/game/${gameId}/kickoff`} className="mr-2 mb-2">
            Kickoff
          </ButtonLink>
        }

        {/* <Debug title="Express Game Data" data={game.data} />
        <Debug title="Home Team Data" data={homeTeam.data} />
        <Debug title="Away Team Data" data={awayTeam.data} /> */}

        {playLogs.data.map(log => {
          return <div key={log.logId}>{log.situation.minute}: {log.message}</div>
        })}

      </ContentWrapper>
    </>
  );
}