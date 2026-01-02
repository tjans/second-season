import { useAllTeams } from "@/queries/teamQueries";
import FloatingAddButton from "@/components/ui/floatingAddButton";

const TeamsHome = () => {
    const teamsQuery = useAllTeams();

    return (
        <div>
            <h1>Teams</h1>
            <FloatingAddButton to="/teams/new" />
            <ul>
                {teamsQuery.data?.map(team => (
                    <li key={team.teamId}>{team.city} ({team.abbreviation})</li>
                ))}
            </ul>
        </div>
    );
};

export default TeamsHome;
