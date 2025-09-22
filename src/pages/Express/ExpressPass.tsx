import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useLogPlay } from '@/queries/playLogQueries';
import { useSaveGame } from '@/queries/expressGameQueries';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TextInput } from '@/components/Elements/TextInput';
import { useForm } from 'react-hook-form';

export default function ExpressPass() {
  const {offenseTeam, gameUrl, moveBall} = useExpressGameTools();
  const [result, setResult] = useState<"CMP" | "INC" | "INT" | null>(null);
  
  const navigate = useNavigate();
  usePageTitle("Express Pass");

  const {
      register,
      handleSubmit,
      formState: { errors },
      setFocus,
      setValue
    } = useForm<FormData>();

  const handleZoneSelect = (zone: number) => {
  
  }

  type FormData = {
    zones: string;
  }

  const onSubmit = (data: FormData) => {
    moveBall(Number(data.zones), "pass", true); // I don't think the clock stops, each play takes a minute regardless.    
    navigate(gameUrl());
  } 

  return (
    <>
      <ContentWrapper>
        <div className="text-center"><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
        <div className="text-center mt-2">
          What was the result of the pass play?

          <div className="text-red-400 my-4">There's an issue where we're on minute 1, but the pass play gets logged as minute 2</div>

          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={() => setResult("CMP")} variant={result=="CMP" ? "filled" : "outlined"} className="w-24">Complete</Button>
            <Button onClick={() => setResult("INC")} variant={result=="INC" ? "filled" : "outlined"} className="w-24">Incomplete</Button>
            <Button onClick={() => setResult("INT")} variant={result=="INT" ? "filled" : "outlined"} className="w-24">Intercepted</Button>
            <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
          </div>
          
          {result == "CMP" && <>
             <section>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    label="Zones"
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
          {result == "INC" && <div className="font-bold">Incomplete!</div>}
          {result == "INT" && <div className="font-bold">Intercepted!</div>}
          
        </div>
        
        <div className="text-center">
          
        </div>
      </ContentWrapper>
    </>
  );
}