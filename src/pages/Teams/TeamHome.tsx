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
                    <div className="mb-4 flex gap-4 items-center" key={team.teamId}>
                        <TextIcon text={""} settings={{ textColor: '#000', color: '#ECECEC' }} />
                        <Link to={`/teams/${team.teamId}/edit`}>{team.city} {team.mascot} ({team.abbreviation})</Link>
                    </div>
                ))}



            </div>
        </ContentWrapper>
    );
};

export default TeamsHome;
