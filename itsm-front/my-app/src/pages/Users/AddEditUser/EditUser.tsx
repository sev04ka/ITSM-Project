import { type FC } from "react";
import { useParams } from "react-router-dom";
import { useEntityDetails } from "../../../hooks/useEntityDetails";
import NotFound from "../../NotFound";
import { EditForm } from "./EditForm";
import type IUser from "../../../interfaces/entities/User";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";

interface EditUserProps {
}

export const EditUser: FC<EditUserProps> = ({

}) => {
    const { id } = useParams();

    if (!id) {
        return (
            <NotFound />
        )
    }

    const { entity, isLoading, error } = useEntityDetails<IUser>('/users', id)


    if (error) return <div>{error}</div>

    if (isLoading) return <div>Loading...</div>

    return (
        <FormCard
            title="Изменение пользователя"
        >
            <EditForm entity={entity} />
        </FormCard>
    )
}