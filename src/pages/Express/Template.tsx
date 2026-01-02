import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';

export default function ExpressStats() {
  const { gameUrl } = useExpressGameTools();

  usePageTitle("Express Stats");

  return (
    <>
      <ContentWrapper>
        <div className="text-center">
          Stats coming soon!
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}