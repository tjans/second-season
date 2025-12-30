// react
import { useNavigate } from 'react-router-dom';

// icons
import { IoMdAmericanFootball } from "react-icons/io";

// hooks
import usePageTitle from '@/hooks/usePageTitle'

// components
import ContentWrapper from "@/components/ContentWrapper";
import { Button as ShadButton } from "@/components/ui/button"

// queries
import { usePlayLogs } from '@/queries/playLogQueries';

// elements
import Button from '@/components/Elements/Button';
import ButtonLink from '@/components/Elements/ButtonLink';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import { PlayLog } from '@/types/PlayLog';
import { useState } from 'react';
import { PlayCall } from '@/types/ExpressGame';


// This is the main entry point for a game
export default function ExpressGame() {
  const [playCall, setPlayCall] = useState<{ offense: PlayCall, defense: PlayCall } | null>(null);

  const {
    gameId,
    game,
    awayTeam, homeTeam, offenseTeam, defenseTeam,
    saveGameMutation, logPlayMutation, undoMutation,
    clockDisplay, quarterDisplay, gameUrl
  } = useExpressGameTools();

  const navigate = useNavigate();
  const playLogs = usePlayLogs(gameId);

  usePageTitle("Express Gameday");

  // functions
  const handleCoinFlip = (receivingTeamId: string) => {
    let kickingTeam = receivingTeamId == awayTeam.teamId ? homeTeam : awayTeam;
    let receivingTeam = receivingTeamId == awayTeam.teamId ? awayTeam : homeTeam;

    let gameAfterPlay = { ...game };

    let playMinute = game.situation.minute;  // store this so we can add it to the play log
    gameAfterPlay.situation.possessionId = kickingTeam.teamId; // kicking team kicks off, receiving team receives
    gameAfterPlay.coinTossWinnerId = receivingTeamId;
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
      offenseTeamId: kickingTeam.teamId,
      defenseTeamId: receivingTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute
    }

    logPlayMutation.mutate(playLog);
    navigate(gameUrl("kickoff"));
  }

  const handleClockChange = () => {
    let gameAfterPlay = structuredClone(game);

    gameAfterPlay.situation.minute = Math.max(game.situation.minute - 1, 1);

    saveGameMutation.mutate(gameAfterPlay);
  }

  const handleQuarterChange = () => {
    if (!game.situation.quarter) throw new Error("Quarter is not defined");

    let gameAfterPlay = structuredClone(game);
    gameAfterPlay.situation.quarter = game.situation.quarter == 5 ? 1 : game.situation.quarter + 1;
    saveGameMutation.mutate(gameAfterPlay);
  }

  const handleSwapPossession = () => {
    if (!game.situation.currentZone) return; // safety check

    let gameAfterPlay = { ...game };
    gameAfterPlay.situation.possessionId = game.situation.possessionId == homeTeam.teamId ? awayTeam.teamId : homeTeam.teamId;
    gameAfterPlay.situation.currentZone = 9 - game.situation.currentZone; // flip the zone
    saveGameMutation.mutate(gameAfterPlay);

    let playLog: PlayLog = {
      situation: game.situation,
      message: `${defenseTeam.abbreviation} takes over at Zone ${gameAfterPlay.situation.currentZone}`,
      date: new Date().toISOString(),
      gameId: gameId,
      offenseTeamId: defenseTeam.teamId,
      defenseTeamId: offenseTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute: game.situation.minute
    }

    logPlayMutation.mutate(playLog);
  }

  const getPlayClass = (call: PlayCall) => {
    switch (call) {
      case "PASS":
        return "text-[#40ad48]";
      case "RUN":
        return "text-[#d12229]";
      case "TEND":
        return "text-slate-500";
      case "AUDIBLE":
        return "text-purple-500";
      case "SAFE":
        return "text-[#ff9f00]";
      case "BLITZ":
        return "text-[#243f8e]";
    }
  }

  const handlePlayCall = () => {
    let isGoalLine = game.situation.currentZone == 8;
    let isRedZone = game.situation.currentZone == 7 && game.situation.quarter == 4;

    let useGoalLine = isGoalLine || isRedZone;

    let offenseChart: PlayCall[] = ["PASS", "PASS", "RUN", "RUN", "TEND", "AUDIBLE"];
    let normalDefenseChart: PlayCall[] = ["PASS", "SAFE", "SAFE", "SAFE", "RUN", "BLITZ"];
    let goalLineDefenseChart: PlayCall[] = ["PASS", "PASS", "RUN", "RUN", "BLITZ", "BLITZ"];

    let offenseCall: PlayCall = offenseChart[Math.floor(Math.random() * offenseChart.length)];
    let defenseCall: PlayCall = useGoalLine
      ? goalLineDefenseChart[Math.floor(Math.random() * goalLineDefenseChart.length)]
      : normalDefenseChart[Math.floor(Math.random() * normalDefenseChart.length)];

    setPlayCall({ offense: offenseCall, defense: defenseCall });
  }

  const handleUndo = () => {
    if (confirm("Are you sure you want to undo the last action?")) {
      setPlayCall(null);

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
              <td className="px-2 text-center text-2xl" onClick={handleClockChange}>{clockDisplay(game.situation.minute)}</td>
            </tr>

            <tr>
              <td className="px-2 text-center">
                Ball on: {game.situation.currentZone == 0 || game.situation.currentZone == 9 ? "N/A" : game.situation.currentZone}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="mb-6 w-1/2 table-fixed mx-auto">
          <tbody>
            <tr>
              <td className="text-center"><span className="font-bold" onClick={handleQuarterChange}>Quarter:</span> {quarterDisplay()}</td>
              <td className="text-center"><span className="font-bold">Mode:</span> {game.situation.mode}</td>
            </tr>
          </tbody>
        </table>

        {playCall &&
          <div className="text-center font-bold mb-6 text-2xl">
            <span className={getPlayClass(playCall.offense)}>{playCall.offense}</span> vs. <span className={getPlayClass(playCall.defense)}>{playCall.defense}</span>
          </div>
        }

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
          <div className="mb-4 flex justify-center items-center gap-2">
            <ButtonLink to={gameUrl("kickoff")} className="mr-2 mb-2">
              Kickoff
            </ButtonLink>
          </div>
        }

        {game.situation.mode == "PAT" &&
          <div className="mb-4 flex justify-center items-center gap-2">
            <ButtonLink to={gameUrl("pat")} className="mr-2 mb-2">
              PAT / 2-pt
            </ButtonLink>
          </div>
        }

        {game.situation.mode == "EOH" &&
          <div className="mb-4 flex justify-center items-center gap-2">
            <ButtonLink to={gameUrl("pat")} className="mr-2 mb-2">
              Start 2nd Half
            </ButtonLink>
          </div>
        }

        {game.situation.mode == "DRIVE" &&
          <>
            <div className="mb-4 flex justify-center items-center">
              <ShadButton to={gameUrl("pass")} className="mr-2 mb-2">
                Pass
              </ShadButton>

              <ShadButton to={gameUrl("run")} className="mr-2 mb-2">
                Run
              </ShadButton>
              <ShadButton to={gameUrl("fg")} className="mr-2 mb-2">
                FG
              </ShadButton>

              <ShadButton to={gameUrl("punt")} className="mr-2 mb-2">
                Punt
              </ShadButton>
            </div>

            <div className="mb-4 flex justify-center items-center">
              <Button onClick={handlePlayCall} color="info" className="mr-2 mb-2">
                Call Play
              </Button>
            </div>

            <div className="mb-4 flex justify-center items-center">
              <Button onClick={handleSwapPossession} color="warning" className="mr-2 mb-2">
                Swap Possession
              </Button>
            </div>

          </>
        }

        {game.situation.mode !== "PREGAME" &&
          <div className="mb-8 text-center">
            <ButtonLink color="secondary" to={gameUrl("stats")} className="mr-2">
              Stats
            </ButtonLink>

            <Button onClick={handleUndo} color="error">
              Undo
            </Button>
          </div>
        }


        {playLogs.data.length > 0 &&
          <table className="w-full mx-auto mb-4 table table-striped">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-1">Time</th>
                <th>Play</th>
              </tr>
            </thead>

            <tbody>

              {playLogs.data.map(log => {
                return <tr className="even:bg-gray-200" key={log.logId}>
                  <td className="font-bold p-1">{clockDisplay(log.playMinute)}</td>
                  <td>{log.message}</td>
                </tr>
              })}

            </tbody>

          </table>
        }

      </ContentWrapper>
    </>
  );
}