import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useTeamStats } from '@/queries/expressTeamStatQueries';
import { ExpressTeamStat } from '@/types/ExpressTeamStats';

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

  usePageTitle("Express Stats");

  const homeRushingStats = getRushingStats(homeTeamStats.data);
  const awayRushingStats = getRushingStats(awayTeamStats.data);

  return (
    <>
      <ContentWrapper>

        {homeTeamStats &&
          <div className="mt-4">
            <div className="text-lg font-semibold">{homeTeam.city} Stats</div>
            <div>Rushing Yards: {homeRushingStats.totalRushYards}</div>
            <div>Rushing Touchdowns: {homeRushingStats.totalRushTD}</div>
          </div>
        }

        {awayTeamStats &&
          <div className="mt-4">
            <div className="text-lg font-semibold">{awayTeam.city} Stats</div>
            <div>Rushing Yards: {awayRushingStats.totalRushYards}</div>
            <div>Rushing Touchdowns: {awayRushingStats.totalRushTD}</div>
          </div>
        }

        <div className="text-center">
          <ButtonLink to={gameUrl()} color="secondary" className="ml-2">Cancel</ButtonLink>
        </div>
      </ContentWrapper>
    </>
  );
}