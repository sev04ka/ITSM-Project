import { useState, type FC } from "react";
import { useToast } from "../../../../../context/ToastContext";
import { api } from "../../../../../api";
import type ITicket from "../../../../../interfaces/entities/Ticket";
import { Select } from "../../../../../components/ui/Select/Select";
import { Button } from "../../../../../components/ui/Button/Button";
import { useEntityList } from "../../../../../hooks/useEntityList";
import type IUser from "../../../../../interfaces/entities/User";
import { ConfirmModal } from "../../../../../components/ui/ConfirmModal/ConfirmModal";
import styles from './assigneecontrols.module.css'

interface AssigneeControlsProps {
    ticket: ITicket;
    onTicketUpdated: () => void;
}

function getSuccessMessage(action: string): string {
    const messages: Record<string, string> = {
        assign: 'Исполнитель назначен',
        remove: 'Исполнитель снят с назначения'

    };
    return messages[action] || 'Действие выполнено';
}

function getActionLabel(action: string): string {
    const labels: Record<string, string> = {
        assign: 'назначении исполнителя',
        remove: 'снятии с назначения'
    };
    return labels[action] || 'выполнении действия';
}

export const AssigneeControls: FC<AssigneeControlsProps> = ({
    ticket,
    onTicketUpdated
}) => {
    const [assigneeId, setAssigneeId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { data } = useEntityList<IUser>('/users/staff', false);
    const [isConfriming, setIsConfirming] = useState<boolean>(false);
    const toast = useToast();


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

    const handleAssign = async () => {
        if (!assigneeId) {
            toast.warning("Выберите сотрудника для назначения");
            return;
        }

        await handleAction(
            'assign',
            `/tickets/${ticket.id}/assign/`,
            { assignee_id: assigneeId }
        );

        setAssigneeId(null);
    };

    const handleClear = async () => {
        if (!ticket.assignee) {
            toast.error("Сотрудник не назначен");
            return;
        }

        await handleAction(
            'remove',
            `/tickets/${ticket.id}/remove-assignee/`,
            { assignee_id: assigneeId }
        );
        setAssigneeId(null);
    }

    const userOptions = data.map((user: IUser) => ({
        value: String(user.id),
        label: `${user.first_name} ${user.last_name}`.trim() || '?'
    }));

    return (
        <>
            <div className={styles["assignee-controls"]}>
                {!ticket.assignee &&
                    <>
                        < Select
                            value={assigneeId || ""}
                            options={userOptions}
                            onChange={setAssigneeId}
                            placeHolder="Выберите сотрудника"
                        />
                        <Button
                            disabled={actionLoading !== null || !assigneeId}
                            onClick={handleAssign}
                        >
                            {actionLoading === 'assign' ? <span className={styles.spinner} /> : null}
                            Назначить
                        </Button>
                    </>
                }
                {ticket.assignee && !["resolved", "closed", "mew", "waiting", "cancelled"].includes(ticket.status) &&
                    <Button
                        disabled={actionLoading !== null || !ticket.assignee}
                        onClick={() => setIsConfirming(true)}
                    >
                        {actionLoading === 'remove' ? <span className={styles.spinner} /> : null}
                        Снять
                    </Button>
                }
            </div>
            <ConfirmModal
                isOpen={isConfriming}
                title="Снятие исполнителя с назначения"
                message="Вы уверены, что хотите снять сотрудника с выполнения заявки? 
                После этого статус заявки будет переведн в ожидание."
                onConfirm={handleClear}
                onCancel={() => setIsConfirming(false)}
            />
        </>
    )



}