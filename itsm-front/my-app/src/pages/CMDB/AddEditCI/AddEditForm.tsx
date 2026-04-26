import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect, type FC } from "react"
import { api } from "../../../api"
import { type ICIType } from "../../../interfaces/entities/CIType"
import { SelectField } from "../../../components/ui/FormElements/SelectField/SelectField"
import { FieldGroup } from "../../../components/ui/FormElements/FieldGroup/FieldGroup"
import { InputField } from "../../../components/ui/FormElements/InputField/InputField"
import { useNavigate, useParams } from "react-router-dom"
import type { IConfigurationItem } from "../../../interfaces/entities/ConfigurationItem"
import { Button } from "../../../components/ui/Button/Button"
import { useToast } from "../../../context/ToastContext"


const CISchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    serial_number: z.string(),
    ci_type_id: z.string().min(1, "Тип обязателен"),
    status: z.string().refine(
        (val) => ["active", "inactive", "maintenance", "retired"].includes(val),
        { message: "Статус обязателен" }
    )
})

const STATUS_OPTIONS = [
    { value: "active", label: "Активен" },
    { value: "inactive", label: "Неактивен" },
    { value: "maintenance", label: "Обслуживание" },
    { value: "retired", label: "Выведен" },
] as const

interface AddEditFormProps {
    entity?: IConfigurationItem | null;
}

export const AddEditForm: FC<AddEditFormProps> = ({
    entity,
}) => {
    const [ciTypes, setCITypes] = useState<ICIType[]>([]);
    const navigate = useNavigate();
    const toast = useToast()

    useEffect(() => {
        const fetchCITypes = async () => {
            const response = await api.getList<ICIType>("/ci-type")
            if (response.success) {
                const items = Array.isArray(response.data.results) ? response.data.results : []
                setCITypes(items)
            }
        }
        fetchCITypes();
    }, [])



    const form = useForm<z.infer<typeof CISchema>>({
        resolver: zodResolver(CISchema),
        defaultValues: {
            name: entity ? entity.name : '',
            serial_number: entity ? entity.serial_number : '',
            ci_type_id: entity ? String(entity.ci_type.id) : '',
            status: entity ? entity.status : ''
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })


    const onSubmitAdd = async (data: z.infer<typeof CISchema>) => {
        const response = await api.post(
            '/conf-items/',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) form.reset()
    }

    const onSubmitEdit = async (data: z.infer<typeof CISchema>) => {
        const response = await api.put(
            `/conf-items/${entity?.id}/`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                navigate('/conf-items', { replace: true });
            }
        }
    }

    const ciTypeOptions = [
        ...ciTypes.map((type) => ({
            value: String(type.id),
            label: type.name
        }))
    ];

    return (
        <form onSubmit={form.handleSubmit(entity ? onSubmitEdit : onSubmitAdd)}>
            <FieldGroup>
                <InputField
                    name="name"
                    control={form.control}
                    type="text"
                    label="name"
                />
                <InputField
                    name="serial_number"
                    control={form.control}
                    type="text"
                    label="serial number"
                />
                <SelectField
                    name="ci_type_id"
                    control={form.control}
                    label="ci type"
                    options={ciTypeOptions}
                    placeholder="Выберите тип"
                />
                <SelectField
                    name="status"
                    control={form.control}
                    label="status"
                    options={STATUS_OPTIONS}
                    placeholder="Выберите статус"
                />
            </FieldGroup>
            <FieldGroup className="button">
                <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                >
                    Submit
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        toast.error("Toast test Toast test Toast test Toast test Toast test")
                    }}
                >
                    reset
                </Button>
            </FieldGroup>

        </form>
    )
}