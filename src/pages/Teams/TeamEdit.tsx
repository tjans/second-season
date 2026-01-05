import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";

import { useParams, useNavigate } from 'react-router-dom';

// Form handling and validation
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from 'react';

// Queries
import { useTeam, useSaveTeam } from '@/queries/teamQueries';

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
import RI from '@/components/ui/requiredIndicator';

// Zod schema for form validation
const team = z.object({
    prefix: z.string().min(1, "Prefix is required"),
    city: z.string().min(1, "City is required"),
    abbreviation: z.string().min(1, "Abbreviation is required").max(4, "Abbreviation must be at most 4 characters"),
    mascot: z.string().optional(),
});

// Infer the form data type from the Zod schema
type teamType = z.infer<typeof team>;


/************************************************************************************* 
*   A component for editing and creating teams
*   Handles both new team creation and existing team editing based on the presence of 
*   a teamId param
**************************************************************************************/
export default function TeamEdit() {
    usePageTitle("");

    const saveTeamMutation = useSaveTeam();
    const navigate = useNavigate();
    const { teamId } = useParams();

    // Form definitions
    const emptyTeam: teamType = {
        prefix: "",
        city: "",
        abbreviation: "",
        mascot: "",
    }

    const isEdit = !!teamId;
    const teamQuery = useTeam(teamId || "", { enabled: isEdit });

    // Set the resolver
    const form = useForm<teamType>({
        resolver: zodResolver(team),
        defaultValues: emptyTeam
    });

    // Update form when data is loaded
    useEffect(() => {
        if (teamQuery.data) {
            form.reset({
                prefix: teamQuery.data.prefix || "",
                city: teamQuery.data.city || "",
                abbreviation: teamQuery.data.abbreviation || "",
                mascot: teamQuery.data.mascot || "",
            });
        }
    }, [teamQuery.data, form]);
    // End form definitions


    const onSubmit: SubmitHandler<teamType> = (data) => {
        console.log(data)

        const teamToSave = {
            teamId: teamId || undefined,
            ...data
        }

        saveTeamMutation.mutate(teamToSave);
        navigate("/teams");
    }

    return (
        <>
            <ContentWrapper>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="abbreviation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Abbreviation <RI /></FormLabel>
                                    <FormControl>
                                        <Input {...field} maxLength={4} />
                                    </FormControl>
                                    <FormDescription>
                                        3-4 letter team abbreviation.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City/Location <RI /></FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Team city or location, e.g. "Springfield"
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="prefix"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prefix</FormLabel>
                                    <FormControl>
                                        <Input {...field} maxLength={4} />
                                    </FormControl>
                                    <FormDescription>
                                        Team prefix, usually the season year, e.g. 2026
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="mascot"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mascot/Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Team mascot or name, e.g. "Tigers"
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>



                        <Button type="submit">Submit</Button>
                        <Button to={"/teams"} variant="ghost" className="">Cancel</Button>

                    </form>
                </Form>
            </ContentWrapper>
        </>
    );
}