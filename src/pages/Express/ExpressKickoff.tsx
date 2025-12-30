import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { Button } from '@/components/ui/button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useLogPlay } from '@/queries/playLogQueries';
import { useSaveGame } from '@/queries/expressGameQueries';
import { useNavigate } from 'react-router-dom';
import es from '@/services/expressService';

export default function ExpressKickoff() {
  const { game, offenseTeam, defenseTeam, gameUrl } = useExpressGameTools();

  const navigate = useNavigate();
  usePageTitle("Express Kickoff");

  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();

  const handleZoneSelect = (zone: number) => {
    let { gameAfterPlay, log } = es.processKickoff(game, zone, offenseTeam, defenseTeam, false);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  const handleFumble = () => {
    let { gameAfterPlay, log } = es.processKickoff(game, 2, offenseTeam, defenseTeam, true);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  return (
    <>
      <ContentWrapper>
        <div className="text-center"><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
        <div className="text-center mt-2">
          What was the resulting zone after the kickoff?
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            return <Button key={`zone_${n}`} onClick={() => handleZoneSelect(n)}>{(n == 9 ? "TD" : n)}</Button>
          })}
        </div>

        <div className="text-center">
          <div className="my-4 font-bold">or</div>
          <Button color="error" onClick={() => handleFumble()}>Zone 2 + Fumble</Button>
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}