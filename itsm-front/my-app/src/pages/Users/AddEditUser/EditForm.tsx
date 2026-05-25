import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect, type FC } from "react"
import { api } from "../../../api"
import { SelectField } from "../../../components/ui/FormElements/SelectField/SelectField"
import { FieldGroup } from "../../../components/ui/FormElements/FieldGroup/FieldGroup"
import { InputField } from "../../../components/ui/FormElements/InputField/InputField"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/Button/Button"
import { useToast } from "../../../context/ToastContext"
import type IRole from "../../../interfaces/entities/role"
import type IUser from "../../../interfaces/entities/User"


const UserSchema = z.object({
    first_name: z.string().min(1, "Имя обязательно"),
    last_name: z.string().min(1, "Фамилия обязательна"),
    role_id: z.string().min(1, "Роль обязателена"),
})

interface EditFormProps {
    entity?: IUser | null;
}

export const EditForm: FC<EditFormProps> = ({
    entity,
}) => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const navigate = useNavigate();
    const toast = useToast()

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await api.getList<IRole>("/roles")
            if (response.success) {
                const items = Array.isArray(response.data.results) ? response.data.results : []
                setRoles(items)
            }
        }


        fetchRoles();
    }, [])



    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            first_name: entity ? entity.first_name : '',
            last_name: entity ? entity.last_name : '',
            role_id: entity ? String(entity.role.id) : '',
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })


    const onSubmitEdit = async (data: z.infer<typeof UserSchema>) => {
        const response = await api.put(
            `/users/${entity?.id}/`,
            data,
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            toast.success("Пользователь успешно изменён");
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                navigate('/users', { replace: true });
            }
        } else {
            toast.error(response.error.message);
        }
    }

    const roleOptions = [
        ...roles.map((role) => ({
            value: String(role.id),
            label: role.name
        }))
    ];

    return (
        <form onSubmit={form.handleSubmit(onSubmitEdit)}>
            <FieldGroup orientation="horizontal">
                <InputField
                    name="first_name"
                    control={form.control}
                    type="text"
                    label="Имя"
                />
                <InputField
                    name="last_name"
                    control={form.control}
                    type="text"
                    label="Фамилия"
                />
            </FieldGroup>
            <FieldGroup orientation="horizontal">
                <SelectField
                    name="role_id"
                    control={form.control}
                    label="Роль"
                    options={roleOptions}
                    placeholder="Выберите роль"
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