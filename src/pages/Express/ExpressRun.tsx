import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '@/components/Elements/TextInput';
import { useForm } from 'react-hook-form';

export default function ExpressRun() {
  const {offenseTeam, gameUrl, moveBall, situation} = useExpressGameTools();
    
  const navigate = useNavigate();
  usePageTitle("Express Run");

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();

  type FormData = {
    zones: string;
  }
  
  const onSubmit = (data: FormData) => {
    moveBall(Number(data.zones), "run", true); // I don't think the clock stops, each play takes a minute regardless.    
    navigate(gameUrl());
  } 
  
  return (
    <>
      <ContentWrapper>
        <div className="text-center">
          <div><span className="font-bold">Possession:</span> {offenseTeam.abbreviation}</div>
          <div><span className="font-bold">Current Zone:</span> {situation.currentZone}</div>
        </div>

        <div className="text-center mt-2">                    

            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        label="How many zones did the run sequence gain?"
                        name="zones"
                        register={register}
                        error={errors.zones}
                        type="number"
                        required
                        rules={{
                          required: "Zones is required"
                        }}
                    />    

                    <div className="flex justify-center mt-4 gap-2 mb-4">
                      <Button type="submit" color="info">Confirm RUN</Button>
                      <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
                    </div>                
                </form>
            </section>
                    
        </div>
        
        <div className="text-center">
          
        </div>
      </ContentWrapper>
    </>
  );
}