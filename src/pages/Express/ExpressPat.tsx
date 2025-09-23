import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useLogPlay } from '@/queries/playLogQueries';
import { useSaveGame } from '@/queries/expressGameQueries';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ExpressPat() {
  const {game, offenseTeam, homeTeam, gameUrl} = useExpressGameTools();
  const [result, setResult] = useState<"PAT" | "2PT" | null>(null);
  
  const navigate = useNavigate();
  usePageTitle("Express Point after Touchdown");

  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();

  const handlePAT = (isMade: boolean) => {
    let gameAfterPlay = {...game};
  
    gameAfterPlay.situation.currentZone = null;
    gameAfterPlay.situation.mode = "KICKOFF";

    if(isMade) {
      if(offenseTeam.teamId == homeTeam.teamId) {
          gameAfterPlay.situation.homeScore += 1;
      } else {
          gameAfterPlay.situation.awayScore += 1;
      }
    } 
    saveGameMutation.mutate(gameAfterPlay);

    logPlayMutation.mutate({      
      situation: gameAfterPlay.situation,
      message: `${offenseTeam.abbreviation} PAT is ${isMade ? "good!" : "no good!"}`,
      date: new Date().toISOString(),
      gameId: game.gameId,
      yardsGained: null,
      teamId: offenseTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute: gameAfterPlay.situation.minute,
    });

    navigate(gameUrl());
  }

  const handle2PT = (isMade: boolean) => {
    let gameAfterPlay = {...game};
  
    gameAfterPlay.situation.currentZone = null;
    gameAfterPlay.situation.mode = "KICKOFF";

    if(isMade) {
      if(offenseTeam.teamId == homeTeam.teamId) {
          gameAfterPlay.situation.homeScore += 2;
      } else {
          gameAfterPlay.situation.awayScore += 2;
      }
    } 
    saveGameMutation.mutate(gameAfterPlay);

    logPlayMutation.mutate({      
      situation: gameAfterPlay.situation,
      message: `${offenseTeam.abbreviation} 2PT try is ${isMade ? "successful!" : "unsuccessful!"}`,
      date: new Date().toISOString(),
      gameId: game.gameId,
      yardsGained: null,
      teamId: offenseTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute: gameAfterPlay.situation.minute,
    });

    navigate(gameUrl());
  }

  return (
    <>
      <ContentWrapper>
        <div className="text-center">
          <span className="font-bold">Possession:</span> {offenseTeam.abbreviation} 
          <div>PAT or 2pt Conversion?</div>        
        </div>

        <div className="flex justify-center mt-4 gap-2 mb-4">
          <Button onClick={() => setResult("PAT")} variant={result=="PAT" ? "filled" : "outlined"} className="w-24">PAT</Button>
          <Button onClick={() => setResult("2PT")} variant={result=="2PT" ? "filled" : "outlined"} className="w-24">2PT</Button>
          <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>           
        </div>


        {result == "PAT" && 
          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={()=>handlePAT(true)} color="info">PAT Good</Button>
            <Button onClick={()=>handlePAT(false)} color="info">PAT Missed</Button>
          </div>
        }

        {result == "2PT" && 
          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={()=>handle2PT(true)} color="info">2PT Success</Button>
            <Button onClick={()=>handle2PT(false)} color="info">2PT Failed</Button>
          </div>
        }

      </ContentWrapper>
    </>
  );
}