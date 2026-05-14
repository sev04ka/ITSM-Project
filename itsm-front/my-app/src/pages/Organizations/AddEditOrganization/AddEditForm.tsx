import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { type FC } from "react"
import { api } from "../../../api"
import { FieldGroup } from "../../../components/ui/FormElements/FieldGroup/FieldGroup"
import { InputField } from "../../../components/ui/FormElements/InputField/InputField"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/Button/Button"
import { useToast } from "../../../context/ToastContext"
import type IOrganization from "../../../interfaces/entities/Organizations"


const OrganizationsSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
})


interface AddEditFormProps {
    entity?: IOrganization | null;
}

export const AddEditForm: FC<AddEditFormProps> = ({
    entity,
}) => {
    const navigate = useNavigate();
    const toast = useToast()


    const form = useForm<z.infer<typeof OrganizationsSchema>>({
        resolver: zodResolver(OrganizationsSchema),
        defaultValues: {
            name: entity ? entity.name : '',
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })


    const onSubmitAdd = async (data: z.infer<typeof OrganizationsSchema>) => {
        const response = await api.post(
            '/organizations/',
            data,
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            form.reset();
            toast.success("Организация успешно создана");
        } else {
            toast.error(response.error.message);
        }
    }

    const onSubmitEdit = async (data: z.infer<typeof OrganizationsSchema>) => {
        const response = await api.put(
            `/organizations/${entity?.id}/`,
            data,
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            toast.success("Организация успешно изменена");
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                navigate('/organizations', { replace: true });
            }
        } else {
            toast.error(response.error.message);
        }
    }



    return (
        <form onSubmit={form.handleSubmit(entity ? onSubmitEdit : onSubmitAdd)}>
            <FieldGroup orientation="horizontal">
                <InputField
                    name="name"
                    control={form.control}
                    type="text"
                    label="name"
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