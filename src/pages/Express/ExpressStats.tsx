import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';

export default function ExpressStats() {
  const {gameUrl} = useExpressGameTools();
  
  usePageTitle("Express Stats");
  
  return (
    <>
      <ContentWrapper>        
        <div>Stats coming soon!!!</div>

        <div className="text-center">
        

          <div>
            <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
          </div>

        </div>
      </ContentWrapper>
    </>
  );
}