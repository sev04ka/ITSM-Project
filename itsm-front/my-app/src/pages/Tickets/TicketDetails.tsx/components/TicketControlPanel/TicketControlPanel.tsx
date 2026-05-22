import { useState, type FC } from "react";
import { Button } from "../../../../../components/ui/Button/Button";
import { api } from "../../../../../api";
import type ITicket from "../../../../../interfaces/entities/Ticket";
import { useUserAuthStore } from "../../../../../store/useUserAuthStore";
import { useToast } from "../../../../../context/ToastContext";
import styles from './ticketcontrolpanel.module.css'


interface TicketControlPanelProps {
    ticket: ITicket;
    onTicketUpdated: () => void;
}

const getSuccessMessage = (action: string): string => {
    const messages: Record<string, string> = {
        cancel: 'Заявка отменена',
        close: 'Заявка закрыта',
        resolve: 'Заявка решена',
        reopen: 'Заявка переоткрыта',
    };
    return messages[action] || 'Действие выполнено';
}

const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
        cancel: 'отмене заявки',
        close: 'закрытии заявки',
        resolve: 'решении заявки',
        reopen: 'переоткрытии заявки',
    };
    return labels[action] || 'выполнении действия';
}

export const TicketControlPanel: FC<TicketControlPanelProps> = ({
    ticket,
    onTicketUpdated
}) => {
    const { currentUser } = useUserAuthStore();
    const toast = useToast();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const isRequester = ticket.requester.id === currentUser?.id;
    const isAssignee = ticket.assignee?.id === currentUser?.id;

    const handleAction = async (action: string, url: string, body?: Record<string, unknown>) => {
        setActionLoading(action);
        try {
            const response = await api.patch(url, body);
            if (response.success) {
                toast.success(getSuccessMessage(action));
                onTicketUpdated();
            } else {
                toast.error(response.error?.message || `Ошибка при ${getActionLabel(action)}`);
            }
        } catch {
            toast.error(`Ошибка при ${getActionLabel(action)}`);
        } finally {
            setActionLoading(null);
        }
    };

    const showResolve = isAssignee && ticket.status === 'in_progress';
    const showCancel = isRequester && !["closed", "cancelled", "resolved"].includes(ticket.status);
    const showClose = isRequester && ticket.status === 'resolved';
    const showReopen = isRequester && ["closed", "cancelled"].includes(ticket.status);

    const hasActions = showResolve || showCancel || showClose || showReopen;


    if (!hasActions) return null;

    return (
        <div>
            <div className={styles["section-label"]}>Действия</div>
            <div className={styles.actions}>
                {showCancel && (
                    <Button
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('cancel', `/tickets/${ticket.id}/cancel/`)}
                    >
                        {actionLoading === 'cancel' ? <span className={styles.spinner} /> : null}
                        Отменить заявку
                    </Button>
                )}
                {showResolve && (
                    <Button
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('resolve', `/tickets/${ticket.id}/resolve/`)}
                    >
                        {actionLoading === 'resolve' ? <span className={styles.spinner} /> : null}
                        Решить заявку
                    </Button>
                )}
                {showClose && (
                    <Button
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('close', `/tickets/${ticket.id}/close/`)}
                    >
                        {actionLoading === 'close' ? <span className={styles.spinner} /> : null}
                        Закрыть заявку
                    </Button>
                )}
                {showReopen && (
                    <Button
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('reopen', `/tickets/${ticket.id}/reopen/`)}
                    >
                        {actionLoading === 'reopen' ? <span className={styles.spinner} /> : null}
                        Переоткрыть заявку
                    </Button>
                )}
            </div>
        </div>
    )
}


