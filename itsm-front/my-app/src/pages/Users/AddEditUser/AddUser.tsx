import { type FC } from "react";
import { AddForm } from "./AddForm";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";

interface AddUserProps {
}

export const AddUser: FC<AddUserProps> = ({

}) => {

    return (
        <FormCard
            title="Создание пользователя"
        >
            <AddForm />
        </FormCard>
    )
}