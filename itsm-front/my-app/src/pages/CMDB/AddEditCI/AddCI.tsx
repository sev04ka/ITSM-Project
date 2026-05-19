import { type FC } from "react";
import { AddEditForm } from "./AddEditForm";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";

interface AddCIProps {
}

export const AddCI: FC<AddCIProps> = ({
}) => {
    return (
        <FormCard
            title="Создание конфигурационной единицы"
        >
            <AddEditForm />
        </FormCard>
    )
}