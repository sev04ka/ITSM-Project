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
    title: z.string().min(1, "Заголовок обязателен"),
    description: z.string().min(1, "Описание обязательно"),
    ticket_type: z.enum(["incident", "service_request", "problem"], "Тип заявки обязателен"),
    impact: z.enum(["1", "2", "3", "4", "5"], "Укажите степень влияния"),
    urgency: z.enum(["1", "2", "3", "4", "5"], "Укажите срочность")
})

const TICKET_TYPES = [
    { value: "incident", label: "Инцидент" },
    { value: "service_request", label: "Запрос на обслуживание" },
    { value: "problem", label: "Проблема" }
] as const

const TICKET_IMPACT = [
    { value: "1", label: "Минимальное" },
    { value: "2", label: "Низкое" },
    { value: "3", label: "Среднее" },
    { value: "4", label: "Высокое" },
    { value: "5", label: "Критическое" }
] as const

const TICKET_URGENCY = [
    { value: "1", label: "Низкая" },
    { value: "2", label: "Ниже среднего" },
    { value: "3", label: "Средняя" },
    { value: "4", label: "Высокая" },
    { value: "5", label: "Экстренная" }
] as const

export const AddForm: FC = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const form = useForm<z.infer<typeof TicketCreateSchema>>({
        resolver: zodResolver(TicketCreateSchema),
        defaultValues: {
            title: '',
            description: '',
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
                    label="Заголовок"
                />
                <SelectField
                    name="ticket_type"
                    control={form.control}
                    label="Тип заявки"
                    options={TICKET_TYPES}
                />
            </FieldGroup>
            <FieldGroup orientation="horizontal">
                <SelectField
                    name="impact"
                    control={form.control}
                    label="Влияние на работу"
                    options={TICKET_IMPACT}
                />
                <SelectField
                    name="urgency"
                    control={form.control}
                    label="Срочность исполнения"
                    options={TICKET_URGENCY}
                />
            </FieldGroup>
            <FieldGroup>
                <TextArea
                    name="description"
                    control={form.control}
                    label="Описание"
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