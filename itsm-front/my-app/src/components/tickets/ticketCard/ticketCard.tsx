import type { FC } from "react";
import type { ITicket } from "../../../interfaces/entities/Ticket";
import './ticketcard.css'
import { Link } from "react-router-dom";

interface TicketCardProps extends ITicket { }

export const TicketCard: FC<TicketCardProps> = (ticket) => {

    return (
        <div className="ticket-card">
            <h2>{ticket.title}</h2>
            <p>{ticket.ticket_number}</p>
            <p>{ticket.description}</p>
            <p>{ticket.priority}</p>
            <p>{ticket.status}</p>
            <Link to={`/tickets/${ticket.id}`}>details</Link>
        </div>
    )
}