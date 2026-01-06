import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";

export default function GameList() {

    usePageTitle("Games");

    return (
        <>
            <ContentWrapper>
                Games list
            </ContentWrapper>
        </>
    );
}