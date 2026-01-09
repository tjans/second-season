import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";

import { useParams, useNavigate } from 'react-router-dom';

// Form handling and validation
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from 'react';

// Queries
import { useExpressGame, useSaveGame } from '@/queries/expressGameQueries';
import { useSuspenseAllTeams } from '@/queries/teamQueries';

// UI components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import RI from '@/components/ui/requiredIndicator';
import { ExpressGame } from '@/types/ExpressGame';

// Zod schema for form validation
const game = z.object({
    homeTeamId: z.string().min(1, "Home team is required"),
    awayTeamId: z.string().min(1, "Away team is required"),
});

// Setup objects
// const expressGameState: ExpressGameState = {
//   homeScore: 0,
//   awayScore: 0,
//   currentZone: null,
//   minute: 15,
//   possessionId: null,
//   quarter: 1,
//   mode: "PREGAME"
// };

// const expressGame: ExpressGame = {
//   gameId: crypto.randomUUID(),
//   homeTeamId: homeTeamId,
//   awayTeamId: awayTeamId,
//   leagueId: null,
//   situation: expressGameState,

// }

// Infer the form data type from the Zod schema
type gameType = z.infer<typeof game>;

export default function GameEdit() {

    usePageTitle("Game Editor");

    const saveGameMutation = useSaveGame();
    const teams = useSuspenseAllTeams();

    const navigate = useNavigate();
    const { gameId } = useParams();

    // Form definitions
    const emptyGame: gameType = {
        homeTeamId: "",
        awayTeamId: "",
    }

    const isEdit = !!gameId;
    //const gameQuery = useExpressGame(gameId || "", { enabled: isEdit });

    // Set the resolver
    const form = useForm<gameType>({
        resolver: zodResolver(game),
        defaultValues: emptyGame
    });

    const onSubmit: SubmitHandler<gameType> = (data) => {
        console.log(data)

        // const gameToSave = {
        //     gameId: gameId || undefined,
        //     ...data
        // }

        // saveGameMutation.mutate(gameToSave);
        //navigate("/teams");
    }

    return (
        <>
            <ContentWrapper>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">

                        <FormField
                            control={form.control}
                            name="awayTeamId"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        value={field.value ?? ""}              // keep it controlled
                                        onValueChange={field.onChange}         // connect to RHF
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-[250px]">
                                                <SelectValue placeholder="Select the visiting team" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {teams.data?.map((team) => (
                                                <SelectItem
                                                    key={team.teamId}
                                                    value={String(team.teamId)}      // Select value must be a string
                                                >
                                                    {team.prefix ?? "????"} {team.city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <span className="mx-2">{" at "}</span>

                        <FormField
                            control={form.control}
                            name="homeTeamId"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        value={field.value ?? ""}              // keep it controlled
                                        onValueChange={field.onChange}         // connect to RHF
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-[250px]">
                                                <SelectValue placeholder="Select the home team" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {teams.data?.map((team) => (
                                                <SelectItem
                                                    key={team.teamId}
                                                    value={String(team.teamId)}      // Select value must be a string
                                                >
                                                    {team.prefix ?? "????"} {team.city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="mt-4 flex">
                            <Button>Save Game</Button>
                            <Button variant="ghost" onClick={() => navigate("/games")}>Cancel</Button>
                        </div>
                    </form>
                </Form>

            </ContentWrapper>
        </>
    );
}