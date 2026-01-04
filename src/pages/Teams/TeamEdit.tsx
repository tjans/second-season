import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";

// Form handling and validation
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// Zod schema for form validation
const team = z.object({
    city: z.string().min(1, "City is required"),
    abbreviation: z.string().min(1, "Abbreviation is required").max(4, "Abbreviation must be at most 4 characters"),
    mascot: z.string().optional(),
});

// Infer the form data type from the Zod schema
type teamType = z.infer<typeof team>;


// Begin component -----------------------------------------
export default function TeamEdit() {
    usePageTitle("");

    // Set the resolver
    const form = useForm<teamType>({
        resolver: zodResolver(team),
        defaultValues: {
            city: "",
            abbreviation: "",
            mascot: "",
        } as teamType,
    });

    const onSubmit: SubmitHandler<teamType> = (data) => {
        console.log(data)
    }

    return (
        <>
            <ContentWrapper>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="abbreviation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Abbreviation</FormLabel>
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

                        <Button type="submit">Submit</Button>

                    </form>
                </Form>
            </ContentWrapper>
        </>
    );
}