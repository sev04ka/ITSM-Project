import type { FC } from "react";
import { useEntityList } from "../../../hooks/useEntityList";
import type { ITicket } from "../../../interfaces/entities/Ticket";
import { TicketCard } from "../ticketCard/ticketCard";
import './mytickets.css'


export const MyTickets: FC = () => {
    const { data } = useEntityList<ITicket>('/tickets')
    // const { data } = useEntityList<ITicket>('/tickets/my')

    console.log(data)

    return (
        <div className="ticket-cards-container">
            {data.map((item) => <TicketCard {...item} />)}
        </div>
    )
}