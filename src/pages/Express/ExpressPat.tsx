import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useLogPlay } from '@/queries/playLogQueries';
import { useSaveGame } from '@/queries/expressGameQueries';
import { useNavigate } from 'react-router-dom';

export default function ExpressPat() {
  const {game, offenseTeam, defenseTeam, gameId, gameUrl} = useExpressGameTools();
  
  const navigate = useNavigate();
  usePageTitle("Express Point after Touchdown");

  const saveGameMutation = useSaveGame();
  const logPlayMutation = useLogPlay();

  const handleZoneSelect = (zone: number) => {
    // let gameAfterPlay = {...game};

    // // Check for TD!!
    // let playMinute = game.situation.minute;  // store this so we can add it to the play log
    // gameAfterPlay.situation.minute++;
    // gameAfterPlay.situation.currentZone = zone;
    // gameAfterPlay.situation.mode = "DRIVE";
    // gameAfterPlay.situation.possessionId = defenseTeam.teamId; // switch possession to defense team
    // saveGameMutation.mutate(gameAfterPlay);

    // logPlayMutation.mutate({      
    //   situation: game.situation,
    //   message: `${defenseTeam.abbreviation} returns the kick to zone ${zone}`,
    //   date: new Date().toISOString(),
    //   gameId: game.gameId,
    //   yardsGained: null,
    //   teamId: defenseTeam.teamId,
    //   logId: crypto.randomUUID(),
    //   playMinute
    // });

    // navigate(gameUrl());
  }

  return (
    <>
      <ContentWrapper>
        <div className="text-center">
          <span className="font-bold">Possession:</span> {offenseTeam.abbreviation} 
          <div>2pt. conversion or kick PAT?</div>
        </div>
                
        <div className="text-center">
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}