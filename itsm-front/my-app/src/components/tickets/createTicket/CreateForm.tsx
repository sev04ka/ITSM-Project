import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { api } from "../../../api"
import './createform.css'
import { InputField } from "../../ui/FormElements/InputField/InputField"
import { SelectField } from "../../ui/FormElements/SelectField/SelectField"
import { FieldGroup } from "../../ui/FormElements/FieldGroup/FieldGroup"
import { TextArea } from "../../ui/FormElements/TextArea/TextArea"


const TicketCreateSchema = z.object({
    title: z.string().min(1, "Название обязательно"),
    description: z.string().min(1, "Описание обязательно"),
    ticket_type: z.enum(["incident", "service_request", "problem"]),
    // status: z.enum(["new", "in_progress", "waiting", "resolved", "closed", "cancelled"]),
    priority: z.enum(["low", "medium", "high", "critical"]),
})

const TICKET_TYPES = [
    { value: "incident", label: "Инцидент" },
    { value: "service_request", label: "Запрос на обслуживание" },
    { value: "problem", label: "Проблема" }
] as const

const TICKET_PRIORITIES = [
    { value: "low", label: "Низкий" },
    { value: "medium", label: "Средний" },
    { value: "high", label: "Высокий" },
    { value: "critical", label: "Критический" },
] as const

export const TicketCreateForm = () => {
    const form = useForm<z.infer<typeof TicketCreateSchema>>({
        resolver: zodResolver(TicketCreateSchema),
        defaultValues: {
            title: '',
            description: '',
            ticket_type: 'service_request',
            priority: 'low',
        },
        mode: 'onBlur'
    })


    const onSubmit = async (data: z.infer<typeof TicketCreateSchema>) => {
        const response = await api.post(
            '/tickets/',
            data
        )
    }

    return (
        <form id="ticket-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <InputField
                    name="title"
                    control={form.control}
                    type="text"
                    label="title"
                />

                <TextArea
                    name="description"
                    control={form.control}
                    label="description"
                />

                <SelectField
                    name="ticket_type"
                    control={form.control}
                    label="ticket_type"
                    options={TICKET_TYPES}
                />

                <SelectField
                    name="priority"
                    control={form.control}
                    label="priority"
                    options={TICKET_PRIORITIES}
                />
            </FieldGroup>
            <button type="submit">Submit</button>
        </form>
    )
}

