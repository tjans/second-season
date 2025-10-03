import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useLogPlay } from '@/queries/playLogQueries';
import { useSaveGame } from '@/queries/expressGameQueries';
import { useNavigate } from 'react-router-dom';

export default function ExpressKickoff() {
  const {game, offenseTeam, defenseTeam, gameUrl} = useExpressGameTools();
  
  const navigate = useNavigate();
  usePageTitle("Express Kickoff");

  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();

  const handleZoneSelect = (zone: number) => {
    let gameAfterPlay = {...game};

    let playMinute = game.situation.minute;  // store this so we can add it to the play log
    gameAfterPlay.situation.minute++;
    gameAfterPlay.situation.currentZone = zone;
    gameAfterPlay.situation.mode = "DRIVE";
    gameAfterPlay.situation.possessionId = defenseTeam.teamId; // switch possession to defense team
    saveGameMutation.mutate(gameAfterPlay);
    
    logPlayMutation.mutate({      
      situation: game.situation,
      message: `${offenseTeam.abbreviation} kickoff to zone ${zone}`,
      date: new Date().toISOString(),
      gameId: game.gameId,
      defenseTeamId: defenseTeam.teamId,
      offenseTeamId: offenseTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute
    });

    navigate(gameUrl());
  }

  const handleFumble = () => {
    alert("fumble");
  }

  return (
    <>
      <ContentWrapper>
        <div className="text-center"><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
        <div className="text-center mt-2">
          What was the resulting zone after the kickoff?
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {[1,2,3,4,5,6,7,8,9].map((n) => {
          return <Button key={`zone_${n}`}  onClick={() => handleZoneSelect(n)}>{(n==9 ? "TD" : n)}</Button>
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