import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import type { IConfigurationItem } from "../../../interfaces/entities/ConfigurationItem";
import { useEntityDetails } from "../../../hooks/useEntityDetails";
import NotFound from "../../NotFound";
import { AddEditForm } from "./AddEditForm";

interface EditCIProps {
}

export const EditCI: FC<EditCIProps> = ({

}) => {
    const { id } = useParams();

    if (!id) {
        return (
            <NotFound />
        )
    }

    const { entity, isLoading, error } = useEntityDetails<IConfigurationItem>('/conf-items', id)


    if (error) return <div>{error}</div>

    if (isLoading) return <div>Loading...</div>

    return (
        <AddEditForm entity={entity} />
    )
}