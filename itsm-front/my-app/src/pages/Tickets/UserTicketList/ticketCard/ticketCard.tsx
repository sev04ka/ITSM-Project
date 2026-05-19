import type { FC } from "react";
import type ITicket from "../../../../interfaces/entities/Ticket";
import styles from './ticketcard.module.css'
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../../utils/dateFormatter";

interface TicketCardProps extends ITicket { }

const statusBadge: Record<string, string> = {
    'open': styles['badge-open'],
    'in_progress': styles['badge-in_progress'],
    'resolved': styles['badge-resolved'],
    'closed': styles['badge-closed'],
}

const priorityBadge: Record<string, string> = {
    'critical': styles['badge-critical'],
    'high': styles['badge-high'],
    'medium': styles['badge-medium'],
    'low': styles['badge-low'],
}

const statusLabels: Record<string, string> = {
    'open': 'Открыт',
    'in_progress': 'В работе',
    'resolved': 'Решён',
    'closed': 'Закрыт',
}

const priorityLabels: Record<string, string> = {
    'critical': 'Критичный',
    'high': 'Высокий',
    'medium': 'Средний',
    'low': 'Низкий',
}

export const TicketCard: FC<TicketCardProps> = (ticket) => {
    return (
        <div className={styles["ticket-card"]}>
            <div className={styles["card-header"]}>
                <span className={styles["card-title"]}>{ticket.title}</span>
                <span className={styles["card-number"]}>{ticket.ticket_number}</span>
            </div>

            <div className={styles["card-description"]}>{ticket.description}</div>

            <div className={styles["card-meta"]}>
                <span className={`${styles.badge} ${statusBadge[ticket.status] || ''}`}>
                    {statusLabels[ticket.status] || ticket.status}
                </span>
                <span className={`${styles.badge} ${priorityBadge[ticket.priority] || ''}`}>
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