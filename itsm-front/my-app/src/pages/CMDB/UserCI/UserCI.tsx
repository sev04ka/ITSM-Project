import { type FC } from "react";
import { useEntityList } from "../../../hooks/useEntityList";
import type IConfigurationItem from "../../../interfaces/entities/ConfigurationItem";
import { CICard } from "./CICard/CICard";
import { LoadingState } from "../../../components/ui/LoadingState/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState/EmptyState";
import styles from './userci.module.css'
import { useUserAuthStore } from "../../../store/useUserAuthStore";

export const UserCI: FC = () => {
    const { data, loading, error } = useEntityList<IConfigurationItem>('/conf-items/my', false);
    const { currentUser } = useUserAuthStore();

    if (loading) return <LoadingState />;

    if (error) return <ErrorState message={error} />;

    if (data.length === 0) return <EmptyState message="У вас нет конфигурационных единиц" />;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Мои конфигурационные единицы</h1>
            <div className={styles.grid}>
                {data.map((item) => (
                    <CICard key={item.id} item={item} isUser={currentUser?.role.name != 'user'} />
                ))}
            </div>
        </div>
    )
}