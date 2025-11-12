import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';

export default function ExpressStats() {
  const { gameId, homeTeam, awayTeam, gameUrl } = useExpressGameTools();
  // useGameStats

  usePageTitle("Express Stats");


  return (
    <>
      <ContentWrapper>
        <div className="text-2xl font-bold">Home</div>

        <div className="text-center">
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}