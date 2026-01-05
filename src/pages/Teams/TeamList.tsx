import { useAllTeams } from "@/queries/teamQueries";
import FloatingAddButton from "@/components/ui/FloatingAddButton";
import ContentWrapper from "@/components/ContentWrapper"
import TextIcon from "@/components/ui/TextIcon";
import { Link } from "react-router-dom";

const TeamsHome = () => {
    const teamsQuery = useAllTeams();

    return (
        <ContentWrapper align="center">
            <div>
                <FloatingAddButton to="/teams/new" />
                {teamsQuery.data?.map(team => (
                    <div key={team.teamId}>
                        <div className="mb-4 flex gap-4 items-center" key={team.teamId}>
                            <div><TextIcon text={team.abbreviation} settings={{ textColor: '#1e3035ff', color: '#ECECEC' }} /></div>
                            <div className="text-start">
                                <Link to={`/teams/${team.teamId}/edit`}>{team.prefix ?? "    "} {team.city} {team.mascot} ({team.abbreviation})</Link>
                                <div className="text-sm">Roster</div>
                            </div>
                        </div>
                    </div>
                ))}



            </div>
        </ContentWrapper>
    );
};

export default TeamsHome;
