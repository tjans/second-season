import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import Button from '@/components/Elements/Button';
import useExpressGameTools from '@/hooks/useExpressGameTools';
import ButtonLink from '@/components/Elements/ButtonLink';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TextInput } from '@/components/Elements/TextInput';
import { useForm } from 'react-hook-form';
import { SelectInput } from '@/components/Elements/SelectInput';
import ToggleButton from '@/components/Elements/ToggleButton';
import es from '@/services/expressService';

export default function ExpressPass() {
  const {
    offenseTeam, defenseTeam,
    gameUrl,
    game, saveGameMutation, logPlayMutation, gameId, situation,
    isFumble, setIsFumble } = useExpressGameTools();

  const [result, setResult] = useState<"CMP" | "INC" | "INT" | "SACK" | null>(null);

  const navigate = useNavigate();
  usePageTitle("Express Pass");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const {
    register: intRegister,
    handleSubmit: handleIntSubmit,
    formState: { errors: intErrors },
  } = useForm<IntFormData>();

  type FormData = {
    zones: string;
    isFumble: boolean;
    fumbleReturnZones: string;
  }
  type IntFormData = {
    interceptionZone: string;
  }

  const handleIncomplete = () => {
    let { gameAfterPlay, log } = es.processIncomplete(game, offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  const handleSack = (oneZoneLoss: boolean) => {
    let zonesLost = oneZoneLoss ? -1 : 0;
    let { gameAfterPlay, log } = es.processSack(game, zonesLost, offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  // Handle fumbles
  const onSubmit = (data: FormData) => {
    let { gameAfterPlay, log } = es.processPass(game, Number(data.zones), offenseTeam, defenseTeam);
    saveGameMutation.mutate(gameAfterPlay);
    logPlayMutation.mutate(log);
    navigate(gameUrl());
  }

  const onIntSubmit = (data: IntFormData) => {
    let { gameAfterPlay, log } = es.processInterception(game, Number(data.interceptionZone), offenseTeam, defenseTeam);
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

          <div className="flex justify-center mt-4 gap-2 mb-4">
            <Button onClick={() => setResult("CMP")} variant={result == "CMP" ? "filled" : "outlined"} className="w-24">CMP</Button>
            <Button onClick={() => setResult("INC")} variant={result == "INC" ? "filled" : "outlined"} className="w-24">INC</Button>
            <Button onClick={() => setResult("INT")} variant={result == "INT" ? "filled" : "outlined"} className="w-24">INT</Button>
            <Button onClick={() => setResult("SACK")} variant={result == "SACK" ? "filled" : "outlined"} className="w-24">SACK</Button>
          </div>

          {!result && <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>}

          {result == "CMP" && <>
            <section>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                  label="How many zones did the pass sequence gain?"
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
                  <Button type="submit" color="info">Confirm CMP</Button>
                  <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
                </div>
              </form>
            </section>
          </>}

          {result == "INC" &&
            <div className="flex justify-center mt-4 gap-2 mb-4">
              <Button onClick={handleIncomplete} color="info">Confirm INC</Button>
              <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
            </div>
          }

          {result == "INT" &&
            <>
              <section>
                <form onSubmit={handleIntSubmit(onIntSubmit)}>
                  <SelectInput
                    label="Which zone did the interception (and return) end in?"
                    name="interceptionZone"
                    register={intRegister}
                    error={intErrors.interceptionZone}
                    required={true}
                    options={[
                      { value: '8', label: "Zone " + (situation.currentZone == 8 ? '8 (current)' : '8') },
                      { value: '7', label: "Zone " + (situation.currentZone == 7 ? '7 (current)' : '7') },
                      { value: '6', label: "Zone " + (situation.currentZone == 6 ? '6 (current)' : '6') },
                      { value: '5', label: "Zone " + (situation.currentZone == 5 ? '5 (current)' : '5') },
                      { value: '4', label: "Zone " + (situation.currentZone == 4 ? '4 (current)' : '4') },
                      { value: '3', label: "Zone " + (situation.currentZone == 3 ? '3 (current)' : '3') },
                      { value: '2', label: "Zone " + (situation.currentZone == 2 ? '2 (current)' : '2') },
                      { value: '1', label: "Zone " + (situation.currentZone == 1 ? '1 (current)' : '1') },
                      { value: '0', label: 'Zone 0 - Defensive TD' },
                    ]}
                    defaultValue=""
                    placeholder="Select final zone"
                    rules={{
                      required: "Final zone is required"
                    }}
                  />
                  <div className="flex justify-center mt-4 gap-2 mb-4">
                    <Button type="submit" color="info">Confirm INT</Button>
                    <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
                  </div>
                </form>
              </section>
            </>}

          {result == "SACK" &&
            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleSack(false)} color="info">Same zone</Button>
              <Button onClick={() => handleSack(true)} color="info">1-zone Loss</Button>
              <ButtonLink to={gameUrl()} color="secondary" className="">Cancel</ButtonLink>
            </div>
          }

        </div>

        <div className="text-center">

        </div>
      </ContentWrapper>
    </>
  );
}