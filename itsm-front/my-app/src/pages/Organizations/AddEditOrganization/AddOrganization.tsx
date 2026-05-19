import { type FC } from "react";
import { AddEditForm } from './AddEditForm';
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";


interface AddOrganizationProps {
}

export const AddOrganization: FC<AddOrganizationProps> = ({

}) => {

    return (
        <FormCard
            title="Создание организации"
        >
            <AddEditForm />
        </FormCard>
    )
}