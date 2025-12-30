import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import { Button as ShadButton } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import es from '@/services/expressService';

export default function ExpressRun() {
  const { offenseTeam, defenseTeam, game, homeTeam, gameUrl, situation, saveGameMutation, logPlayMutation } = useExpressGameTools();

  const navigate = useNavigate();
  usePageTitle("Express Field Goal Attempt");

  const handleFGA = (isMade: boolean) => {
    let { gameAfterPlay, log } = es.processFieldGoal(game, isMade, offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  return (
    <>
      <ContentWrapper>
        <div className="text-center">
          <div><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
          <div><span className="font-bold">Current Zone:</span> {situation.currentZone}</div>
        </div>

        <div className="text-center mt-2">

          <section>
            <div className="flex justify-center mt-4 gap-2 mb-4">
              <ShadButton onClick={() => handleFGA(true)} variant="info">FG Good</ShadButton>
              <ShadButton onClick={() => handleFGA(false)} variant="info">FG Missed</ShadButton>
              <ShadButton to={gameUrl()} variant="secondary" className="">Cancel</ShadButton>
            </div>
          </section>

        </div>

        <div className="text-center">

        </div>
      </ContentWrapper>
    </>
  );
}