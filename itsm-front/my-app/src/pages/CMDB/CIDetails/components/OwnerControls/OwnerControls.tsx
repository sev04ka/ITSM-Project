import { useState, type FC } from "react";
import { useToast } from "../../../../../context/ToastContext";
import { api } from "../../../../../api";
import { Select } from "../../../../../components/ui/Select/Select";
import { Button } from "../../../../../components/ui/Button/Button";
import { useEntityList } from "../../../../../hooks/useEntityList";
import type IUser from "../../../../../interfaces/entities/User";
import { ConfirmModal } from "../../../../../components/ui/ConfirmModal/ConfirmModal";
import styles from './ownercontrols.module.css'
import type IConfigurationItem from "../../../../../interfaces/entities/ConfigurationItem";

interface OwnerControlsProps {
    confItem: IConfigurationItem;
    onCIUpdated: () => void;
}

function getSuccessMessage(action: string): string {
    const messages: Record<string, string> = {
        assign: 'Пользовтаель установлен как владелец',
        remove: 'Пользователь больше не является владельцем'

    };
    return messages[action] || 'Действие выполнено';
}

function getActionLabel(action: string): string {
    const labels: Record<string, string> = {
        assign: 'Установке владельца',
        remove: 'Снятии с владения'
    };
    return labels[action] || 'выполнении действия';
}

export const OwnerControls: FC<OwnerControlsProps> = ({
    confItem,
    onCIUpdated
}) => {
    const [ownerId, setOwnerId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { data } = useEntityList<IUser>('/users?all=true&exclude=false', false);
    const [isConfriming, setIsConfirming] = useState<boolean>(false);
    const toast = useToast();


    const handleAction = async (action: string, url: string, body?: Record<string, unknown>) => {
        setActionLoading(action);
        try {
            const response = await api.patch(url, body);
            if (response.success) {
                toast.success(getSuccessMessage(action));
                onCIUpdated();
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
        if (!ownerId) {
            toast.warning("Выберите владельца для назначения");
            return;
        }

        await handleAction(
            'assign',
            `/conf-items/${confItem.id}/set-owner/`,
            { owner_id: ownerId }
        );

        setOwnerId(null);
    };

    const handleClear = async () => {
        if (!confItem.owner) {
            toast.error("Владельца нет");
            return;
        }

        await handleAction(
            'remove',
            `/conf-items/${confItem.id}/remove-owner/`,
            { owner_id: confItem.owner.id }
        );
        setOwnerId(null);
    }

    const userOptions = data.map((user: IUser) => ({
        value: String(user.id),
        label: `${user.first_name} ${user.last_name}`.trim() || '?'
    }));

    return (
        <>
            <div className={styles["owner-controls"]}>
                {!confItem.owner &&
                    <>
                        < Select
                            value={ownerId || ""}
                            options={userOptions}
                            onChange={setOwnerId}
                            placeHolder="Выберите пользователя"
                        />
                        <Button
                            disabled={actionLoading !== null || !ownerId}
                            onClick={handleAssign}
                        >
                            {actionLoading === 'assign' ? <span className={styles.spinner} /> : null}
                            Назначить
                        </Button>
                    </>
                }
                {confItem.owner &&
                    <Button
                        disabled={actionLoading !== null || !confItem.owner}
                        onClick={() => setIsConfirming(true)}
                    >
                        {actionLoading === 'remove' ? <span className={styles.spinner} /> : null}
                        Снять
                    </Button>
                }
            </div>
            <ConfirmModal
                isOpen={isConfriming}
                title="Снятие пользователя с владения"
                message="Вы уверены, что хотите снять пользователя с владения данной конфигурационной единицой?"
                onConfirm={handleClear}
                onCancel={() => setIsConfirming(false)}
            />
        </>
    )



}