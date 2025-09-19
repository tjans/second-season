import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';

export default function ExpressKickoff() {
  const {offenseTeam, gameId} = useExpressGameTools();
  
  usePageTitle("Express Kickoff");

  const handleZoneSelect = (zone: number) => {
    //
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
          <ButtonLink to={`/express/${gameId}`} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}