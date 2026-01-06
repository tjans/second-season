// foundation
import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { db } from '@/db';

// components


export default function Home() {

  useEffect(() => {
    const foo = async () => {
      // this is here to force a query to open the DB
      let test = await db.expressGames.where("gameId").equals("foo").toArray();
      console.log("test", test);
    }

    foo();
  }, []);

  usePageTitle("Home");

  return (
    <>
      <ContentWrapper>
        <Link to={"/express/game/game-id-1"}>View Express Game</Link><br />
        <Link to={"/teams"}>Teams</Link> <br />
        <Link to={"/games"}>Games</Link>

      </ContentWrapper>

      {/* <ConfirmationModal
        isModalOpen={isNotAvailableModalOpen}
        showYes={false}
        noText='Ok'
        onReject={() => setIsNotAvailableModalOpen(false)}
        title="Not available"
        message="This is a modal message" /> */}
    </>
  );
}