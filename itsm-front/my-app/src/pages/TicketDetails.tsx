import { type FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ITicket } from "../interfaces/entities/Ticket";
import { api } from "../api";
import { TicketCard } from "../components/tickets/ticketCard/ticketCard";
import { TicketComments } from "./TicketComments";
import { TicketCommentList } from "../components/tickets/TicketCommentList/TicketCommentList";


export const TicketDetails: FC = () => {
    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setLoading(true);
                const response = await api.getDetail<ITicket>(`/tickets/${id}/`);
                if (response.success) {
                    const data = response.data
                    setTicket(data);
                    setError(null);
                }
            } catch (err) {
                setTicket(null);
                setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, []);

    if (loading) return (<div>loading....</div>)


    if (ticket) return (
        <>
            <div>
                <h1>{ticket.title}</h1>
                <h2>{ticket.ticket_number}</h2>
                <p>{`${ticket.requester.first_name} ${ticket.requester.last_name}`}</p>
                <p>{ticket.description}</p>
            </div>
            <TicketCommentList ticketId={id} />
        </>
    )

}
