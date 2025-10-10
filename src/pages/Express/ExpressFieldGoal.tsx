import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';
import es from '@/services/expressService';

export default function ExpressRun() {
  const { offenseTeam, defenseTeam, game, homeTeam, gameUrl, situation, saveGameMutation, logPlayMutation, getReverseZone } = useExpressGameTools();

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
              <Button onClick={() => handleFGA(true)} color="info">FG Good</Button>
              <Button onClick={() => handleFGA(false)} color="info">FG Missed</Button>
              <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
            </div>
          </section>

        </div>

        <div className="text-center">

        </div>
      </ContentWrapper>
    </>
  );
}