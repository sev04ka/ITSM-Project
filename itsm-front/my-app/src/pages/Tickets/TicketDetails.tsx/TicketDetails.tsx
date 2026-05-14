import { type FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type ITicket from "../../../interfaces/entities/Ticket";
import { api } from "../../../api";
import { TicketCommentList } from "../../../components/tickets/TicketCommentList/TicketCommentList";
import { CreateComment } from "../../../components/tickets/CreateComment/CreateComment";
import styles from './ticketdetails.module.css'
import { formatDateTime } from "../../../utils/dateFormatter";

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

const typeBadge: Record<string, string> = {
    'incident': styles['badge-incident'],
    'service_request': styles['badge-service_request'],
    'change_request': styles['badge-change_request'],
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

const typeLabels: Record<string, string> = {
    'incident': 'Инцидент',
    'service_request': 'Запрос',
    'change_request': 'Изменение',
}

export const TicketDetails: FC = () => {
    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    if (!id) return <div className={styles.error}>Ошибка: ID тикета не указан</div>

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
    }, [id]);

    if (loading) return (<div>loading....</div>)

    if (!ticket) return (
        <div className={styles.error}>Тикет не найден</div>
    )

    const initials = `
    ${ticket.requester.first_name[0] ? ticket.requester.first_name[0].toUpperCase() : ''}
    ${ticket.requester.last_name[0] ? ticket.requester.last_name[0].toUpperCase() : ''}` || '?'

    return (
        <div className={styles.page}>
            <div className={styles["ticket-card"]}>
                <div className={styles["ticket-header"]}>
                    <h1 className={styles["ticket-title"]}>{ticket.title}</h1>
                    <span className={styles["ticket-number"]}>{ticket.ticket_number}</span>
                </div>

                <div className={styles["meta-grid"]}>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Тип</span>
                        <span className={`${styles.badge} ${typeBadge[ticket.ticket_type] || ''}`}>
                            {typeLabels[ticket.ticket_type] || ticket.ticket_type}
                        </span>
                    </div>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Приоритет</span>
                        <span className={`${styles.badge} ${priorityBadge[ticket.priority] || ''}`}>
                            {priorityLabels[ticket.priority] || ticket.priority}
                        </span>
                    </div>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Статус</span>
                        <span className={`${styles.badge} ${statusBadge[ticket.status] || ''}`}>
                            {statusLabels[ticket.status] || ticket.status}
                        </span>
                    </div>
                </div>

                <div className={styles["requester-section"]}>
                    <div className={styles.avatar}>{initials}</div>
                    <div className={styles["requester-info"]}>
                        <span className={styles["requester-name"]}>
                            {ticket.requester.first_name} {ticket.requester.last_name}
                        </span>
                        <span className={styles["requester-email"]}>{ticket.requester.email}</span>
                    </div>
                </div>

                <div className={styles["description-section"]}>
                    <div className={styles["description-label"]}>Описание</div>
                    <div className={styles["description-text"]}>{ticket.description}</div>
                </div>

                <div className={styles.timestamps}>
                    <div className={styles["timestamp-item"]}>
                        <span className={styles["timestamp-label"]}>Создан</span>
                        <span className={styles["timestamp-value"]}>{formatDateTime(ticket.created_at)}</span>
                    </div>
                    <div className={styles["timestamp-item"]}>
                        <span className={styles["timestamp-label"]}>Обновлён</span>
                        <span className={styles["timestamp-value"]}>{formatDateTime(ticket.updated_at)}</span>
                    </div>
                    {ticket.resolved_at && (
                        <div className={styles["timestamp-item"]}>
                            <span className={styles["timestamp-label"]}>Решён</span>
                            <span className={styles["timestamp-value"]}>{formatDateTime(ticket.resolved_at)}</span>
                        </div>
                    )}
                    {ticket.closed_at && (
                        <div className={styles["timestamp-item"]}>
                            <span className={styles["timestamp-label"]}>Закрыт</span>
                            <span className={styles["timestamp-value"]}>{formatDateTime(ticket.closed_at)}</span>
                        </div>
                    )}
                </div>
            </div>

            <TicketCommentList ticketId={id} />
            <CreateComment ticketId={id} />
        </div>
    )

}
