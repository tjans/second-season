import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';

export default function ExpressFieldGoal() {
  const {game, offenseTeam, defenseTeam, gameId, gameUrl} = useExpressGameTools();
  
  const navigate = useNavigate();
  usePageTitle("Express Field Goal");

  return (
    <>
      <ContentWrapper>
        <div className="text-center"><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
        
        FG attempt

        <div className="text-center">
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}