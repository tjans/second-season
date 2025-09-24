import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TextInput } from '@/components/Elements/TextInput';
import { useForm } from 'react-hook-form';

export default function ExpressPass() {
  const {offenseTeam, gameUrl, moveBall, game, saveGameMutation, logPlayMutation, gameId, situation} = useExpressGameTools();
  const [result, setResult] = useState<"CMP" | "INC" | "INT" | "SACK" | null>(null);
  
  const navigate = useNavigate();
  usePageTitle("Express Pass");

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();

    const {
      register: intRegister,
      handleSubmit: handleIntSubmit,
      formState: { errors: intErrors },
    } = useForm<IntFormData>();

  type FormData = {
    zones: string;
  }
  type IntFormData = {
    interceptionZone: string;
  }

  const handleIncomplete = () => {
    let gameAfterPlay = {...game};
    let playMinute = game.situation.minute; // store this for the log to indicate what time the play happened

    // increase clock
    gameAfterPlay.situation.minute++;
    saveGameMutation.mutate(gameAfterPlay);

    // log the play
    logPlayMutation.mutate({      
            situation: gameAfterPlay.situation,
            message: `${offenseTeam?.abbreviation} throws incomplete pass`,
            date: new Date().toISOString(),
            gameId: gameId,
            yardsGained: 0,
            teamId: offenseTeam?.teamId || "",
            logId: crypto.randomUUID(),
            TD: 0,
            playMinute
        });

    navigate(gameUrl());
  }

  const handleSack = (oneZoneLoss: boolean) => {
    moveBall(oneZoneLoss ? -1 : 0, "sack", true);
    navigate(gameUrl());
  }

  const onSubmit = (data: FormData) => {
    moveBall(Number(data.zones), "pass", true); // I don't think the clock stops, each play takes a minute regardless.    
    navigate(gameUrl());
  } 

  const onIntSubmit = (data: IntFormData) => {
    console.log(data)
  }

  return (
    <>
      <ContentWrapper>
        <div className="text-center">
          <div><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
          <div><span className="font-bold">Current Zone:</span> {situation.currentZone}</div>
        </div>

        <div className="text-center mt-2">
          What was the result of the pass play? <span className="text-red-500 block">Plays where drive started in zone 8</span>

          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={() => setResult("CMP")} variant={result=="CMP" ? "filled" : "outlined"} className="w-24">Complete</Button>
            <Button onClick={() => setResult("INC")} variant={result=="INC" ? "filled" : "outlined"} className="w-24">Incomplete</Button>
            <Button onClick={() => setResult("INT")} variant={result=="INT" ? "filled" : "outlined"} className="w-24">Intercepted</Button>
            <Button onClick={() => setResult("SACK")} variant={result=="SACK" ? "filled" : "outlined"} className="w-24">Sack</Button>
            <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
          </div>
          
          {result == "CMP" && <>
            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        label="How many zones did the pass gain?"
                        name="zones"
                        register={register}
                        error={errors.zones}
                        type="number"
                        required
                        rules={{
                          required: "Zones is required"
                        }}
                    />                    
                    <Button type="submit">Submit</Button>
                </form>
            </section>
          </>}

          {result == "INC" && 
            <Button onClick={handleIncomplete} color="info">Confirm Incomplete</Button>
          }

          {result == "INT" && 
            <>
            <section>
                <form onSubmit={handleIntSubmit(onIntSubmit)}>
                    <TextInput
                        label="What zone did the interception (and return) end in?"
                        name="interceptionZone"
                        register={intRegister}
                        error={intErrors.interceptionZone}
                        type="number"
                        required
                        rules={{
                          required: "Interception zone is required"
                        }}
                    />                    
                    <Button type="submit">Submit</Button>
                </form>
            </section>
            </>          }

          {result == "SACK" && 
            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleSack(false)} color="info">Same zone</Button>
              <Button onClick={() => handleSack(true)} color="info">1-zone Loss</Button>
            </div>
          }
          
        </div>
        
        <div className="text-center">
          
        </div>
      </ContentWrapper>
    </>
  );
}