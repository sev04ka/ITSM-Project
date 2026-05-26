import { type FC } from "react";
import { useParams } from "react-router-dom";
import type IConfigurationItem from "../../../interfaces/entities/ConfigurationItem";
import { useEntityDetails } from "../../../hooks/useEntityDetails";
import NotFound from "../../NotFound";
import { AddEditForm } from "./AddEditForm";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";
import { ErrorState } from "../../../components/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState/LoadingState";

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

    return (
        <>
            {isLoading && <LoadingState />}
            {error && !isLoading && <ErrorState message={error} />}

            {!isLoading && !error &&
                <FormCard
                    title="Редактирование конфигурационной единицы"
                >
                    <AddEditForm entity={entity} />
                </FormCard>
            }
        </>
    )
}