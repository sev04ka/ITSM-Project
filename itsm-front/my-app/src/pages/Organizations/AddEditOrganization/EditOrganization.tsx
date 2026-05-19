import { type FC } from "react";
import { useParams } from "react-router-dom";
import { useEntityDetails } from "../../../hooks/useEntityDetails";
import NotFound from "../../NotFound";
import { AddEditForm } from "./AddEditForm";
import type IOrganization from "../../../interfaces/entities/Organizations";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";

interface EditOrganizationProps {
}

export const EditOrganization: FC<EditOrganizationProps> = ({

}) => {
    const { id } = useParams();

    if (!id) {
        return (
            <NotFound />
        )
    }

    const { entity, isLoading, error } = useEntityDetails<IOrganization>('/organizations', id)


    if (error) return <div>{error}</div>

    if (isLoading) return <div>Loading...</div>

    return (
        <FormCard
            title="Изменение организации"
        >
            <AddEditForm entity={entity} />
        </FormCard>
    )
}