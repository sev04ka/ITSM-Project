import type { FC } from "react";
import { useEntityList } from "../hooks/useEntityList";
import type { IComment } from "../interfaces/entities/Comment";


export const TicketComments: FC = () => {
    const { data, loading } = useEntityList<IComment>(`/comments/for/${1}`);

    if (loading) return <div>Зашрузка...</div>

    return (
        <div>{data.toString()}</div>
    )
}