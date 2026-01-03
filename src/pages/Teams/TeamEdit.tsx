import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/Button';
import * as z from "zod";

// Zod schema for form validation
const team = z.object({
    city: z.string().min(1, "ZCity is required"),
});

// Infer the form data type from the Zod schema
type teamType = z.infer<typeof team>;

// Begin component
export default function TeamEdit() {
    usePageTitle("");

    // Set the resolver
    const form = useForm<teamType>({
        resolver: zodResolver(team),
    });

    // Register the form
    const {
        register,
        formState: { errors },
    } = form;

    const onSubmit: SubmitHandler<teamType> = (data) => {
        console.log(data)
    }

    return (
        <>
            <ContentWrapper>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
                    <input {...register("city")} className="border border-gray-300 rounded px-2 py-1" />
                    {/* errors will return when field validation fails  */}
                    <div>{errors.city && <span>{errors.city.message}</span>}</div>

                    <div className="my-4"><Button type="submit">Submit</Button></div>
                </form>
            </ContentWrapper>
        </>
    );
}