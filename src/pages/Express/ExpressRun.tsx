import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '@/components/Elements/TextInput';
import { useForm } from 'react-hook-form';
import es from '@/services/expressService';
import ToggleButton from '@/components/Elements/ToggleButton';

export default function ExpressRun() {
  const { game, offenseTeam, defenseTeam, gameUrl, saveGameMutation, logPlayMutation, situation, isFumble, setIsFumble } = useExpressGameTools();

  const navigate = useNavigate();
  usePageTitle("Express Run");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  type FormData = {
    zones: string;
    isFumble: boolean;
    fumbleReturnZones: string;
  }

  const onSubmit = (data: FormData) => {
    let { gameAfterPlay, log } = es.processRun(game, Number(data.zones), offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
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

              <ToggleButton
                className="mt-4"
                label="Fumble!"
                name="isFumble"
                register={register}
                onChange={() => {
                  var newIsFumble = !isFumble;
                  setIsFumble(newIsFumble);
                  if (!newIsFumble) setValue("fumbleReturnZones", ""); // clear fumble return zones if toggled off
                }}
              />

              {isFumble &&
                <TextInput
                  label="How many zones was the fumble returned?"
                  name="fumbleReturnZones"
                  register={register}
                  error={errors.fumbleReturnZones}
                  type="number"
                  required
                  rules={{
                    required: "Fumble return zones is required"
                  }}
                />
              }

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