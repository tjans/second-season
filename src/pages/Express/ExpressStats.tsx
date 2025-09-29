import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import { usePlayLogs } from '@/queries/playLogQueries';
import { useMemo } from "react";
import { PlayLog } from '@/types/PlayLog';
import ButtonLink from '@/components/Elements/ButtonLink';

export default function ExpressStats() {
  const {gameId, homeTeam, awayTeam, gameUrl} = useExpressGameTools();
  const playLogs = usePlayLogs(gameId);

  usePageTitle("Express Stats");
  let homeYards = 0;
  let awayYards = 0;
  const { homeStats, awayStats } = useMemo(() => {
    if (!playLogs.data) return { homeStats: [], awayStats: [] };

    const homeStats: PlayLog[] = [];
    const awayStats: PlayLog[] = [];
    

    for (const item of playLogs.data) {
      if (item.offenseTeamId === homeTeam.teamId) {
        homeStats.push(item);
      } else {
        awayStats.push(item);
      }
    }

    return { homeStats, awayStats };
  }, [playLogs.data]);

  return (
    <>
      <ContentWrapper>
       <div className="text-2xl font-bold">Home</div>
       {homeStats.map((log) => {
        homeYards += log.yardsGained ?? 0;
        return;
        return  (
          <div key={log.logId} className="mb-2">
            <div>{log.message}: ({log.yardsGained ?? 0})</div>
          </div>
        )
      })}

      Total: {homeYards} yards

      <div className="text-2xl mt-4 font-bold">Away</div>
       {awayStats.map((log) => {
        awayYards += log.yardsGained ?? 0;
        return;
        return  (
          <div key={log.logId} className="mb-2">
            <div>{log.message}: ({log.yardsGained ?? 0})</div>
          </div>
        )
      })}

      Total: {awayYards} yards

       <div className="text-center">
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}