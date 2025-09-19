import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';

export default function ExpressKickoff() {

  usePageTitle("Express Kickoff");

  const handleZoneSelect = (zone: number) => {
    alert(zone);
  }

  const handleFumble = () => {
    alert("fumble");
  }

  return (
    <>
      <ContentWrapper>
        <div className="font-bold">What was the resulting zone after the kickoff? (number or TD)</div>

        <div className="flex flex-wrap gap-2 mt-4">
        {[1,2,3,4,5,6,7,8,9].map((n) => {
          return <Button key={`zone_${n}`}  onClick={() => handleZoneSelect(n)}>{(n==9 ? "TD" : n)}</Button>
        })}
        </div>

        <div className="my-4 font-bold">or</div>

        <Button color="error" onClick={() => handleFumble()}>Zone 2 + Fumble</Button>
        
      </ContentWrapper>
    </>
  );
}