import { type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import type IConfigurationItem from "../../../../interfaces/entities/ConfigurationItem";
import { ciStatusLabels } from "../../../../consts/Labels/ciStatusLabels";
import styles from './cicard.module.css'
import { useUserAuthStore } from "../../../../store/useUserAuthStore";

interface CICardProps {
    item: IConfigurationItem;
    isUser?: boolean;
}

export const CICard: FC<CICardProps> = ({
    item,
    isUser = false
}) => {
    const navigate = useNavigate();

    const ownerInitials = item.owner
        ? `${item.owner.first_name[0]?.toUpperCase() ?? ''}${item.owner.last_name[0]?.toUpperCase() ?? ''}`
        : '?';

    return (
        <div onClick={isUser ? () => navigate(`/conf-items/${item.id}`) : undefined} className={styles.card}>
            <div className={styles.header}>
                <span className={styles.name}>{item.name}</span>
                <span className={`badge badge-${item.status}`}>
                    {ciStatusLabels[item.status] || item.status}
                </span>
            </div>

            <div className={styles.body}>
                {item.serial_number && (
                    <div className={styles.row}>
                        <span className={styles.label}>Серийный номер</span>
                        <span className={styles.value}>{item.serial_number}</span>
                    </div>
                )}
                <div className={styles.row}>
                    <span className={styles.label}>Тип</span>
                    <span className={styles.value}>{item.ci_type.name}</span>
                </div>
            </div>
        </div>
    )
}