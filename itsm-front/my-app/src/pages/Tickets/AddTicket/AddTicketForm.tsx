import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { type FC } from "react"
import { api } from "../../../api"
import { SelectField } from "../../../components/ui/FormElements/SelectField/SelectField"
import { FieldGroup } from "../../../components/ui/FormElements/FieldGroup/FieldGroup"
import { InputField } from "../../../components/ui/FormElements/InputField/InputField"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/Button/Button"
import { useToast } from "../../../context/ToastContext"
import { TextArea } from "../../../components/ui/FormElements/TextArea/TextArea"

const TicketCreateSchema = z.object({
    title: z.string().min(1, "Название обязательно"),
    description: z.string().min(1, "Описание обязательно"),
    ticket_type: z.enum(["incident", "service_request", "problem"]),
})

const TICKET_TYPES = [
    { value: "incident", label: "Инцидент" },
    { value: "service_request", label: "Запрос на обслуживание" },
    { value: "problem", label: "Проблема" }
] as const


export const AddForm: FC = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const form = useForm<z.infer<typeof TicketCreateSchema>>({
        resolver: zodResolver(TicketCreateSchema),
        defaultValues: {
            title: '',
            description: '',
            ticket_type: 'service_request',
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    });

    const onSubmitAdd = async (data: z.infer<typeof TicketCreateSchema>) => {
        const response = await api.post(
            '/tickets/',
            data,
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

        if (response.success) {
            toast.success("Заявка успешно создана");
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                navigate('/users', { replace: true });
            }
        } else {
            toast.error(response.error.message);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmitAdd)}>
            <FieldGroup orientation="horizontal">
                <InputField
                    name="title"
                    control={form.control}
                    label="title"
                />
                <SelectField
                    name="ticket_type"
                    control={form.control}
                    label="ticket_type"
                    options={TICKET_TYPES}
                />
            </FieldGroup>
            <FieldGroup>
                <TextArea
                    name="description"
                    control={form.control}
                    label="description"
                />
            </FieldGroup>
            <FieldGroup button="button-right">
                <Button
                    type="submit"
                    size="m"
                    disabled={!form.formState.isValid}
                >
                    Submit
                </Button>
            </FieldGroup>
        </form>
    )
}