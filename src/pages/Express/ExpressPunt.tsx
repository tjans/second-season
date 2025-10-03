import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '@/components/Elements/TextInput';
import { useForm } from 'react-hook-form';
import { SelectInput } from '@/components/Elements/SelectInput';

export default function ExpressPunt() {
  const {offenseTeam, gameUrl, situation, moveBall} = useExpressGameTools();
    
  const navigate = useNavigate();
  usePageTitle("Express Punt");

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();

  type FormData = {
    puntZone: string;
  }
  
  const onSubmit = ({puntZone}: FormData) => {
    let usesTime = true;
    let setZone = true;
    moveBall(Number(puntZone), "punt", usesTime, setZone);
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

            <form onSubmit={handleSubmit(onSubmit)}>

                   <SelectInput
                    label="Which zone did the punt (and return) end in?"
                    name="puntZone"
                    register={register}
                    error={errors.puntZone}
                    required={true}
                    options={[
                      { value: '9', label: "TOUCHBACK" },
                      { value: '8', label: "Zone " + (situation.currentZone == 8 ? '8 (current)' : '8') },
                      { value: '7', label: "Zone " + (situation.currentZone == 7 ? '7 (current)' : '7') },
                      { value: '6', label: "Zone " + (situation.currentZone == 6 ? '6 (current)' : '6') },
                      { value: '5', label: "Zone " + (situation.currentZone == 5 ? '5 (current)' : '5') },
                      { value: '4', label: "Zone " + (situation.currentZone == 4 ? '4 (current)' : '4') },
                      { value: '3', label: "Zone " + (situation.currentZone == 3 ? '3 (current)' : '3') },
                      { value: '2', label: "Zone " + (situation.currentZone == 2 ? '2 (current)' : '2') },
                      { value: '1', label: "Zone " + (situation.currentZone == 1 ? '1 (current)' : '1') },
                      { value: '0', label: 'Zone 0 - Punt Return TD' },
                    ]}
                    defaultValue=""
                    placeholder="Select final zone"
                    rules={{
                      required: "Final zone is required"
                    }}
                  />
                  <div className="flex justify-center mt-4 gap-2 mb-4">
                      <Button type="submit" color="info">Confirm PUNT</Button>
                      <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
                    </div>
                </form>
                    
        </div>
        
        <div className="text-center">
          
        </div>
      </ContentWrapper>
    </>
  );
}