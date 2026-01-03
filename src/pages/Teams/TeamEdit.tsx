import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from '@/components/ui/Button';
import * as z from "zod";

// Zod schema for form validation
const team = z.object({
    city: z.string().min(1, "ZCity is required"),
});

// Infer the form data type from the Zod schema
type Inputs = z.infer<typeof team>;



export default function TeamEdit() {
    usePageTitle("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }

    return (
        <>
            <ContentWrapper>
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">
                    <input {...register("city", { required: true })} className="border border-gray-300 rounded px-2 py-1" />
                    {/* errors will return when field validation fails  */}
                    <div>{errors.city && <span>City is required</span>}</div>

                    <div className="my-4"><Button type="submit">Submit</Button></div>
                </form>
            </ContentWrapper>
        </>
    );
}