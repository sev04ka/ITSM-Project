import { type FC, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import type ITicket from "../../../interfaces/entities/Ticket";
import { api } from "../../../api";
import styles from './ticketdetails.module.css'
import { formatDateTime } from "../../../utils/dateFormatter";
import { EmptyState } from "../../../components/ui/EmptyState/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState/LoadingState";
import { TicketControlPanel } from "./components/TicketControlPanel/TicketControlPanel";
import { AssigneeControls } from "./components/AssigneeControls/AssigneeControls";
import RoleGuard from "../../../components/security/RoleGuard";
import { CommentSection } from "./components/CommentSection/CommentSection";
import { statusLabels } from "../../../consts/statusLabels";
import { priorityLabels } from "../../../consts/priorityLables";
import { typeLabels } from "../../../consts/ticketTypeLabels";
import { statusBadge } from "../../../consts/Badges/statusBadges";
import { typeBadge } from "../../../consts/Badges/ticketTypeBadges";
import { priorityBadge } from "../../../consts/Badges/priorityBadges";

export const TicketDetails: FC = () => {
    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    if (!id) return <div className={styles.error}>Ошибка: ID тикета не указан</div>

    const fetchTicket = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    if (loading) return (<LoadingState />)

    if (error) return (<ErrorState message={error} />)

    if (!ticket) return (<EmptyState message="Тикет не найден" />)

    const initials = `
    ${ticket.requester.first_name[0] ? ticket.requester.first_name[0].toUpperCase() : ''}
    ${ticket.requester.last_name[0] ? ticket.requester.last_name[0].toUpperCase() : ''}` || '?'

    return (
        <>
            <div className={styles["ticket-card"]}>
                <div className={styles["ticket-header"]}>
                    <h1 className={styles["ticket-title"]}>{ticket.title}</h1>
                    <span className={styles["ticket-number"]}>{ticket.ticket_number}</span>
                </div>

                <div className={styles["meta-grid"]}>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Тип</span>
                        <span className={`badge ${typeBadge[ticket.ticket_type] || ''}`}>
                            {typeLabels[ticket.ticket_type] || ticket.ticket_type}
                        </span>
                    </div>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Приоритет</span>
                        <span className={`badge ${priorityBadge[ticket.priority] || ''}`}>
                            {priorityLabels[ticket.priority] || ticket.priority}
                        </span>
                    </div>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Статус</span>
                        <span className={`badge ${statusBadge[ticket.status] || ''}`}>
                            {statusLabels[ticket.status] || ticket.status}
                        </span>
                    </div>
                </div>

                <div className={styles["people-section"]}>
                    <div className={styles["people-item"]}>
                        <div className={styles["people-label"]}>Заявитель</div>
                        <div className={styles["people-content"]}>
                            <div className={styles.avatar}>{initials}</div>
                            <div className={styles["people-info"]}>
                                <span className={styles["people-name"]}>
                                    {ticket.requester.first_name} {ticket.requester.last_name}
                                </span>
                                <span className={styles["people-email"]}>{ticket.requester.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles["people-section"]}>
                    <div className={styles["people-item"]}>
                        <div className={styles["people-label"]}>Исполнитель</div>
                        {ticket.assignee && (
                            <div className={styles["people-content"]}>
                                <div className={`${styles.avatar} ${styles["avatar-assignee"]}`}>
                                    {ticket.assignee.first_name[0]?.toUpperCase() ?? ''}{ticket.assignee.last_name[0]?.toUpperCase() ?? ''}
                                </div>
                                <div className={styles["people-info"]}>
                                    <span className={styles["people-name"]}>
                                        {ticket.assignee.first_name} {ticket.assignee.last_name}
                                    </span>
                                    <span className={styles["people-email"]}>{ticket.assignee.email}</span>
                                </div>
                            </div>
                        ) || "Исполнитель не назначен"}
                    </div>
                    <RoleGuard roles={["support", "admin"]} hideMode={true}>
                        <AssigneeControls
                            ticket={ticket}
                            onTicketUpdated={fetchTicket}
                        />
                    </RoleGuard>
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
                    {/* <div className={styles["timestamp-item"]}>
                        <span className={styles["timestamp-label"]}>Обновлён</span>
                        <span className={styles["timestamp-value"]}>{formatDateTime(ticket.updated_at)}</span>
                        </div> */}
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
                <TicketControlPanel
                    ticket={ticket}
                    onTicketUpdated={fetchTicket}
                />
            </div>

            <CommentSection ticketId={id} />
        </>
    )
}
