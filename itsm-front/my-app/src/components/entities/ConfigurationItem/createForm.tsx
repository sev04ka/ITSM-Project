import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { api } from "../../../api"
import { type ICIType } from "../../../interfaces/entities/CIType"

const CICreateSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    ci_type_id: z.number().min(1, "Тип обязателен"),
    status: z.enum(["active", "inactive", "maintenance", "retired"])
})

const STATUS_OPTIONS = [
    { value: "active", label: "Активен" },
    { value: "inactive", label: "Неактивен" },
    { value: "maintenance", label: "Обслуживание" },
    { value: "retired", label: "Выведен" },
] as const


export const CICreateForm = () => {
    const [ciTypes, setCITypes] = useState<ICIType[]>([])

    useEffect(() => {
        const fetchCITypes = async () => {
            const response = await api.get<ICIType>("/ci-type")
            if (response.success) {

                const items = Array.isArray(response.data.results) ? response.data.results : []

                setCITypes(items)
            }
        }
        fetchCITypes()
    }, [])

    const form = useForm<z.infer<typeof CICreateSchema>>({
        resolver: zodResolver(CICreateSchema),
        defaultValues: {
            name: '',
            ci_type_id: 1,
            status: 'active'
        },
        mode: 'onBlur'
    })


    const onSubmit = async (data: z.infer<typeof CICreateSchema>) => {
        const response = await api.post(
            '/conf-items/',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
                {...form.register('name')}
                type="text"
                id="name"
            />
            <select
                {...form.register("ci_type_id", { valueAsNumber: true })}
                id="ci_type_id"
            >
                <option value={0}>Выберите тип</option>
                {ciTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
            </select>
            <select
                {...form.register("status")}
                id="status"
            >
                {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button type="submit">Submit</button>
        </form>
    )
}

