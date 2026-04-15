import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { api } from "../../../api"
import './createform.css'
import { Field } from "../../ui/FormElements/Field/Field"
import { FieldLabel } from "../../ui/FormElements/FieldLabel/FieldLabel"
import { FieldError } from "../../ui/FormElements/FieldError/FieldError"
import { Input } from "../../ui/FormElements/Input/Input"
import { Select } from "../../ui/FormElements/Select/Select"
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

// const TICKET_STATUSES = [
//     { value: "new", label: "Новый" },
//     { value: "in_progress", label: "В работе" },
//     { value: "waiting", label: "Ожидание" },
//     { value: "resolved", label: "Решено" },
//     { value: "closed", label: "Закрыто" },
//     { value: "cancelled", label: "Отменено" },
// ] as const


export const TicketCreateForm = () => {
    const form = useForm<z.infer<typeof TicketCreateSchema>>({
        resolver: zodResolver(TicketCreateSchema),
        defaultValues: {
            title: '',
            description: '',
            ticket_type: 'service_request',
            priority: 'low',
            // status: 'new'
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
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="ticket-form-title">title</FieldLabel>

                            <Input
                                field={field}
                                id="ticket-form-title"
                            />

                            {fieldState.invalid && (
                                <FieldError>{[fieldState.error?.message]}</FieldError>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="ticket-form-description">description</FieldLabel>
                            <TextArea field={field} id="ticket-form-description"> </TextArea>
                            {fieldState.invalid && (
                                <FieldError>{[fieldState.error?.message]}</FieldError>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="ticket_type"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="ticket-form-ticket-type">ticket_type</FieldLabel>

                            <Select
                                field={field}
                                id="ticket-form-ticket-type"
                                options={TICKET_TYPES}
                            />

                            {fieldState.invalid && (
                                <FieldError>{[fieldState.error?.message]}</FieldError>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="priority"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="ticket-form-priority">priority</FieldLabel>

                            <Select
                                field={field}
                                id="ticket-form-priority"
                                options={TICKET_PRIORITIES}
                            />

                            {fieldState.invalid && (
                                <FieldError>{[fieldState.error?.message]}</FieldError>
                            )}
                        </Field>
                    )}
                />

                {/* <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="ticket-form-status">status</FieldLabel>

                            <Select
                                field={field}
                                id="ticket-form-status"
                                options={TICKET_STATUSES}
                            />

                            {fieldState.invalid && (
                                <FieldError>{[fieldState.error?.message]}</FieldError>
                            )}
                        </Field>
                    )}
                /> */}

                <button type="submit">Submit</button>
            </FieldGroup>
        </form>
    )
}

