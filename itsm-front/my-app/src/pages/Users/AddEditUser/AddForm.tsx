import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect, type FC } from "react"
import { api } from "../../../api"
import { SelectField } from "../../../components/ui/FormElements/SelectField/SelectField"
import { FieldGroup } from "../../../components/ui/FormElements/FieldGroup/FieldGroup"
import { InputField } from "../../../components/ui/FormElements/InputField/InputField"
import { Button } from "../../../components/ui/Button/Button"
import { useToast } from "../../../context/ToastContext"
import type IRole from "../../../interfaces/entities/role"
import type IOrganization from "../../../interfaces/entities/Organizations"


const UserSchema = z.object({
    first_name: z.string().min(1, "Имя обязательно"),
    last_name: z.string().min(1, "Фамилия обязательна"),
    email: z.email("Почта обязательна"),
    password: z.string().min(1, "Введите пароль"),
    role_id: z.string().min(1, "Роль обязателена"),
    organization_id: z.string().min(1, "Организация обязательна"),
})



export const AddForm: FC = () => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [organizations, setOrganizations] = useState<IOrganization[]>([]);
    const toast = useToast()

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await api.getList<IRole>("/roles")
            if (response.success) {
                const items = Array.isArray(response.data.results) ? response.data.results : []
                setRoles(items)
            }
        }

        const fetchOrganizations = async () => {
            const response = await api.getList<IOrganization>("/organizations")
            if (response.success) {
                const items = Array.isArray(response.data.results) ? response.data.results : []
                setOrganizations(items)
            }
        }

        fetchRoles();
        fetchOrganizations();
    }, [])



    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role_id: '',
            organization_id: '',
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })


    const onSubmitAdd = async (data: z.infer<typeof UserSchema>) => {
        const response = await api.post(
            '/users/',
            data,
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            form.reset();
            toast.success("Пользователь успешно создан");
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

    const organizationOptions = [
        ...organizations.map((organization) => ({
            value: String(organization.id),
            label: organization.name
        }))
    ];

    return (
        <form onSubmit={form.handleSubmit(onSubmitAdd)}>
            <FieldGroup orientation="horizontal">
                <InputField
                    name="email"
                    control={form.control}
                    type="email"
                    label="Электронная почта"
                />
                <InputField
                    name="password"
                    control={form.control}
                    type="password"
                    label="Пароль"
                />
            </FieldGroup>
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
                <SelectField
                    name="organization_id"
                    control={form.control}
                    label="Организация"
                    options={organizationOptions}
                    placeholder="Выберите организацию"
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