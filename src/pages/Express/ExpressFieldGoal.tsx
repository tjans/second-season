import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';

export default function ExpressRun() {
  const {offenseTeam, defenseTeam, game, homeTeam, gameUrl, situation, saveGameMutation, logPlayMutation, getReverseZone} = useExpressGameTools();
    
  const navigate = useNavigate();
  usePageTitle("Express Field Goal Attempt");

  const handleFGA = (isMade: boolean) => {
    if(!situation.currentZone) return; // should never happen
    
    let reversedZone = getReverseZone(situation.currentZone);
    let gameAfterPlay = {...game};
    let playMinute = gameAfterPlay.situation.minute;  // store this so we can add it to the play log

    gameAfterPlay.situation.currentZone = null;
    gameAfterPlay.situation.minute++;

    if(isMade) {
      gameAfterPlay.situation.mode = "KICKOFF";
      gameAfterPlay.situation.currentZone = null;

      if(offenseTeam.teamId == homeTeam.teamId) {
          gameAfterPlay.situation.homeScore += 3;
      } else {
          gameAfterPlay.situation.awayScore += 3;
      }
    } else {  
      gameAfterPlay.situation.mode = "DRIVE";
      gameAfterPlay.situation.possessionId = defenseTeam?.teamId;
      gameAfterPlay.situation.currentZone = reversedZone; // change sides, so if the offense was at the 7, the defense gets it at the 2
    }

    saveGameMutation.mutate(gameAfterPlay);

    logPlayMutation.mutate({      
      situation: gameAfterPlay.situation,
      message: `${offenseTeam.abbreviation} FG is ${isMade ? "good!" : "no good!"}`,
      date: new Date().toISOString(),
      gameId: game.gameId,
      offenseTeamId: offenseTeam.teamId,
      defenseTeamId: defenseTeam.teamId,
      logId: crypto.randomUUID(),
      playMinute: playMinute,
    });

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
                <Button onClick={()=>handleFGA(true)} color="info">FG Good</Button>
                <Button onClick={()=>handleFGA(false)} color="info">FG Missed</Button>
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