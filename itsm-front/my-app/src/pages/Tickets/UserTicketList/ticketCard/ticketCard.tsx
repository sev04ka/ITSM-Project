import type { FC } from "react";
import type ITicket from "../../../../interfaces/entities/Ticket";
import styles from './ticketcard.module.css'
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../../utils/dateFormatter";
import { statusLabels } from "../../../../consts/statusLabels";
import { priorityLabels } from "../../../../consts/priorityLables";
import { priorityBadge } from "../../../../consts/Badges/priorityBadges";
import { statusBadge } from "../../../../consts/Badges/statusBadges";

interface TicketCardProps extends ITicket { }



export const TicketCard: FC<TicketCardProps> = (ticket) => {
    return (
        <div className={styles["ticket-card"]}>
            <div className={styles["card-header"]}>
                <span className={styles["card-title"]}>{ticket.title}</span>
                <span className={styles["card-number"]}>{ticket.ticket_number}</span>
            </div>

            <div className={styles["card-description"]}>{ticket.description}</div>

            <div className={styles["card-meta"]}>
                <span className={`badge ${statusBadge[ticket.status] || ''}`}>
                    {statusLabels[ticket.status] || ticket.status}
                </span>
                <span className={`badge ${priorityBadge[ticket.priority] || ''}`}>
                    {priorityLabels[ticket.priority] || ticket.priority}
                </span>
            </div>

            <div className={styles["card-footer"]}>
                <span className={styles["card-date"]}>{formatDateTime(ticket.created_at)}</span>
                <Link to={`/tickets/${ticket.id}`} className={styles["card-link"]}>Подробнее</Link>
            </div>
        </div>
    )
}