import { type FC } from "react";
import { AddForm } from "./AddTicketForm";
import { FormCard } from "../../../components/ui/FormElements/FormCard/FormCard";

interface AddTicketProps {
}

export const AddTicket: FC<AddTicketProps> = ({

}) => {

    return (
        <FormCard
            title="Создание заявки"
        >
            <AddForm />
        </FormCard>
    )
}