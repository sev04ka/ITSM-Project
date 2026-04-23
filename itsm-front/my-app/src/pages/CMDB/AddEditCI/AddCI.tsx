import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import type { IConfigurationItem } from "../../../interfaces/entities/ConfigurationItem";
import { useEntityDetails } from "../../../hooks/useEntityDetails";
import NotFound from "../../NotFound";
import { AddEditForm } from "./AddEditForm";

interface AddCIProps {
}

export const AddCI: FC<AddCIProps> = ({

}) => {

    return (
        <AddEditForm />
    )
}