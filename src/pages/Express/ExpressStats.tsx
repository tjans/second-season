import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import useExpressGameTools from '@/hooks/useExpressGameTools';
import { useTeamStats } from '@/queries/expressTeamStatQueries';
import { ExpressTeamStat } from '@/types/ExpressTeamStats';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

export default function ExpressStats() {
  console.log('Rendering ExpressStats component');
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
    if (!teamStats || !teamStats) return {
      totalPassYards: 0,
      totalPassTD: 0,
      totalInterceptions: 0,
      totalCompletions: 0
    };

    return teamStats.reduce((totals, statLine: ExpressTeamStat) => {
      return {
        totalPassYards: totals.totalPassYards + (statLine.passYardsGained || 0),
        totalPassTD: totals.totalPassTD + (statLine.passTD || 0),
        totalInterceptions: totals.totalInterceptions + (statLine.interception || 0),
        totalCompletions: totals.totalCompletions + (statLine.completion || 0)
      };
    }, { // defaults
      totalPassYards: 0,
      totalPassTD: 0,
      totalInterceptions: 0,
      totalCompletions: 0
    })
  }

  const getDefenseStats = (teamStats: ExpressTeamStat[]) => {
    if (!teamStats || !teamStats) return {
      totalSacks: 0
    };

    return teamStats.reduce((totals, statLine: ExpressTeamStat) => {
      return {
        totalSacks: totals.totalSacks + (statLine.sack || 0)
      };
    }, { // defaults
      totalSacks: 0
    })
  }

  const getKickingStats = (teamStats: ExpressTeamStat[]) => {
    if (!teamStats || !teamStats) return {
      totalFGM: 0,
      totalFGA: 0,
      totalXPM: 0,
      totalXPA: 0
    };

    return teamStats.reduce((totals, statLine: ExpressTeamStat) => {
      return {
        totalFGM: totals.totalFGM + (statLine.FGM || 0),
        totalFGA: totals.totalFGA + (statLine.FGA || 0),
        totalXPM: totals.totalXPM + (statLine.XPM || 0),
        totalXPA: totals.totalXPA + (statLine.XPA || 0)
      };
    }, { // defaults
      totalFGM: 0,
      totalFGA: 0,
      totalXPM: 0,
      totalXPA: 0
    })
  }

  usePageTitle("Express Stats");

  const homeRushingStats = useMemo(() => getRushingStats(homeTeamStats.data), [homeTeamStats.data]);
  const awayRushingStats = useMemo(() => getRushingStats(awayTeamStats.data), [awayTeamStats.data]);

  const homePassingStats = useMemo(() => getPassingStats(homeTeamStats.data), [homeTeamStats.data]);
  const awayPassingStats = useMemo(() => getPassingStats(awayTeamStats.data), [awayTeamStats.data]);

  const homeDefenseStats = useMemo(() => getDefenseStats(homeTeamStats.data), [homeTeamStats.data]);
  const awayDefenseStats = useMemo(() => getDefenseStats(awayTeamStats.data), [awayTeamStats.data]);

  const awayKickingStats = useMemo(() => getKickingStats(awayTeamStats.data), [awayTeamStats.data]);
  const homeKickingStats = useMemo(() => getKickingStats(homeTeamStats.data), [homeTeamStats.data]);

  return (
    <>
      <ContentWrapper>

        {homeTeamStats &&
          <div className="mt-4">
            <div className="text-lg font-semibold">{homeTeam.city} Stats</div>
            <div>Rushing Yards: {homeRushingStats.totalRushYards}</div>
            <div>Rushing Touchdowns: {homeRushingStats.totalRushTD}</div>
            <div>Completions: {homePassingStats.totalCompletions}</div>
            <div>Passing Yards: {homePassingStats.totalPassYards}</div>
            <div>Passing Touchdowns: {homePassingStats.totalPassTD}</div>
            <div>Interceptions: {homePassingStats.totalInterceptions}</div>
            <div>Defensive Sacks: {homeDefenseStats.totalSacks}</div>
            <div>PAT: {homeKickingStats.totalXPM} / {homeKickingStats.totalXPA}</div>
            <div>FG: {homeKickingStats.totalFGM} / {homeKickingStats.totalFGA}</div>
          </div>
        }

        {awayTeamStats &&
          <div className="mt-4">
            <div className="text-lg font-semibold">{awayTeam.city} Stats</div>
            <div>Rushing Yards: {awayRushingStats.totalRushYards}</div>
            <div>Rushing Touchdowns: {awayRushingStats.totalRushTD}</div>
            <div>Passing Yards: {awayPassingStats.totalPassYards}</div>
            <div>Passing Touchdowns: {awayPassingStats.totalPassTD}</div>
            <div>Interceptions: {awayPassingStats.totalInterceptions}</div>
            <div>Defensive Sacks: {awayDefenseStats.totalSacks}</div>
            <div>PAT: {awayKickingStats.totalXPM} / {awayKickingStats.totalXPA}</div>
            <div>FG: {awayKickingStats.totalFGM} / {awayKickingStats.totalFGA}</div>
          </div>
        }

        <div className="text-center">
          <Button to={gameUrl()} variant="secondary" className="ml-2">Cancel</Button>
        </div>
      </ContentWrapper>
    </>
  );
}