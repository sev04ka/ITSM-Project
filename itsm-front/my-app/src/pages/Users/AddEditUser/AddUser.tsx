import { type FC } from "react";
import { AddEditForm } from "./AddEditForm";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";

interface AddUserProps {
}

export const AddUser: FC<AddUserProps> = ({

}) => {

    return (
        <FormCard
            title="Создание пользователя"
        >
            <AddEditForm />
        </FormCard>
    )
}