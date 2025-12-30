import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { Button } from '@/components/ui/button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useLogPlay } from '@/queries/playLogQueries';
import { useSaveGame } from '@/queries/expressGameQueries';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import es from '@/services/expressService';

export default function ExpressPat() {
  const { game, offenseTeam, defenseTeam, homeTeam, gameUrl } = useExpressGameTools();
  const [result, setResult] = useState<"PAT" | "2PT" | null>(null);

  const navigate = useNavigate();
  usePageTitle("Express Point after Touchdown");

  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();

  const handlePAT = (isMade: boolean) => {
    let { gameAfterPlay, log } = es.processPAT(game, isMade, offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  const handle2PT = (isMade: boolean) => {
    let { gameAfterPlay, log } = es.process2PT(game, isMade, offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
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
          <Button onClick={() => setResult("PAT")} variant={result == "PAT" ? "filled" : "outlined"} className="w-24">PAT</Button>
          <Button onClick={() => setResult("2PT")} variant={result == "2PT" ? "filled" : "outlined"} className="w-24">2-pt</Button>
          <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
        </div>


        {result == "PAT" &&
          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={() => handlePAT(true)} color="info">PAT Good</Button>
            <Button onClick={() => handlePAT(false)} color="info">PAT Missed</Button>
          </div>
        }

        {result == "2PT" &&
          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={() => handle2PT(true)} color="info">2-pt Success</Button>
            <Button onClick={() => handle2PT(false)} color="info">2-pt Failed</Button>
          </div>
        }

      </ContentWrapper>
    </>
  );
}