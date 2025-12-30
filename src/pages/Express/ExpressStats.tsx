import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import { useTeamStats } from '@/queries/expressTeamStatQueries';
import { ExpressTeamStat } from '@/types/ExpressTeamStats';
import { Button } from '@/components/ui/button';

export default function ExpressStats() {
  const { gameId, homeTeam, awayTeam, gameUrl } = useExpressGameTools();
  const homeTeamStats = useTeamStats(gameId, homeTeam.teamId);
  const awayTeamStats = useTeamStats(gameId, awayTeam.teamId);

  // Calculate total rushing stats from team stats
  const getRushingStats = (teamStats: ExpressTeamStat[]) => {
    if (!teamStats || !teamStats) return { totalRushYards: 0, totalRushTD: 0 };

    return teamStats.reduce((totals, statLine: ExpressTeamStat) => {
      return {
        totalRushYards: totals.totalRushYards + (statLine.rushYardsGained || 0),
        totalRushTD: totals.totalRushTD + (statLine.rushTD || 0)
      };
    }, { totalRushYards: 0, totalRushTD: 0 });
  }

  const getPassingStats = (teamStats: ExpressTeamStat[]) => {
    if (!teamStats || !teamStats) return { totalPassYards: 0, totalPassTD: 0 };

    return teamStats.reduce((totals, statLine: ExpressTeamStat) => {
      return {
        totalPassYards: totals.totalPassYards + (statLine.passYardsGained || 0),
        totalPassTD: totals.totalPassTD + (statLine.passTD || 0)
      };
    }, { totalPassYards: 0, totalPassTD: 0 });
  }

  usePageTitle("Express Stats");

  // This is seemgingly repeated a bunch of times.  We should make this more efficient, or memoize it.
  const homeRushingStats = getRushingStats(homeTeamStats.data);
  const awayRushingStats = getRushingStats(awayTeamStats.data);

  const homePassingStats = getPassingStats(homeTeamStats.data);
  const awayPassingStats = getPassingStats(awayTeamStats.data);

  return (
    <>
      <ContentWrapper>

        {homeTeamStats &&
          <div className="mt-4">
            <div className="text-lg font-semibold">{homeTeam.city} Stats</div>
            <div>Rushing Yards: {homeRushingStats.totalRushYards}</div>
            <div>Rushing Touchdowns: {homeRushingStats.totalRushTD}</div>
            <div>Passing Yards: {homePassingStats.totalPassYards}</div>
            <div>Passing Touchdowns: {homePassingStats.totalPassTD}</div>
          </div>
        }

        {awayTeamStats &&
          <div className="mt-4">
            <div className="text-lg font-semibold">{awayTeam.city} Stats</div>
            <div>Rushing Yards: {awayRushingStats.totalRushYards}</div>
            <div>Rushing Touchdowns: {awayRushingStats.totalRushTD}</div>
            <div>Passing Yards: {awayPassingStats.totalPassYards}</div>
            <div>Passing Touchdowns: {awayPassingStats.totalPassTD}</div>
          </div>
        }

        <div className="text-center">
          <Button to={gameUrl()} variant="secondary" className="ml-2">Cancel</Button>
        </div>
      </ContentWrapper>
    </>
  );
}