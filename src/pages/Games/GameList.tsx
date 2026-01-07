import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { useGames } from "@/queries/expressGameQueries";
import Debug from '@/components/Debug';
import { useAllTeams } from '@/queries/teamQueries';
import teamService from '@/services/teamService';
import { Team } from '@/types/Team';
import { Link } from "react-router-dom";

export default function GameList() {
    usePageTitle("Games");
    var teamLookup: Record<string, Team> = {};

    const teamsQuery = useAllTeams();
    if (teamsQuery.data) {
        teamLookup = teamService.createTeamLookup(teamsQuery.data);
    }

    /*
        Create a dictionary of teams for easy lookup
        "teamId": "away-team-id-1",
        "prefix": "2026",
        "city": "Away City",
        "abbreviation": "AWAY",
        "mascot": "Away Mascot"
    */

    // Now query the games, using the existence of the teams data to enable the query
    const gamesQuery = useGames({ enabled: !!teamsQuery.data });

    return (
        <>
            <ContentWrapper>

                {teamsQuery?.data && gamesQuery?.data?.map(game => {
                    // use the teams dictionary to show team names
                    const homeTeam = teamLookup[game.homeTeamId];
                    const awayTeam = teamLookup[game.awayTeamId];

                    return <div key={game.gameId} className="mb-4">
                        <Link to={`/express/game/${game.gameId}`}>
                            <span className='font-bold'>{awayTeam.prefix} {awayTeam.abbreviation} {game.situation.awayScore}</span>
                            {" at "}
                            <span className='font-bold'>{homeTeam.prefix} {homeTeam.abbreviation} {game.situation.homeScore}</span>
                        </Link>
                    </div>
                })}



            </ContentWrapper>
        </>
    );
}