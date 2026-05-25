import { useState, useEffect, useCallback, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type IConfigurationItem from "../../../interfaces/entities/ConfigurationItem";
import { api } from "../../../api";
import { EmptyState } from "../../../components/ui/EmptyState/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState/LoadingState";
import styles from './cidetails.module.css'
import { OwnerControls } from "./components/OwnerControls/OwnerControls";
import RoleGuard from "../../../components/security/RoleGuard";
import { ciStatusLabels } from "../../../consts/Labels/ciStatusLabels";
import { CreateDependencyForm } from "./components/CreateDependencyForm/CreateDependencyForm";
import { DependencyList } from "./components/DependencyList/DependencyList";
import { Button } from "../../../components/ui/Button/Button";

export const CIDetails: FC = () => {
    const [confItem, setConfItem] = useState<IConfigurationItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [depRefreshKey, setDepRefreshKey] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams();

    if (!id) return <div className={styles.error}>Ошибка: ID конфигурационной единицы не указан</div>

    const fetchCI = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.getDetail<IConfigurationItem>(`/conf-items/${id}/`);
            if (response.success) {
                const data = response.data
                setConfItem(data);
                setError(null);
            }
        } catch (err) {
            setConfItem(null);
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCI();
    }, [id]);

    if (loading) return (<LoadingState />)

    if (error) return (<ErrorState message={error} />)

    if (!confItem) return (<EmptyState message="Конфигурационная единица не найдена" />)

    const ownerInitials = confItem.owner
        ? `${confItem.owner.first_name[0]?.toUpperCase() ?? ''}${confItem.owner.last_name[0]?.toUpperCase() ?? ''}`
        : '?'

    return (
        <>
            <div className={styles["ci-card"]}>
                <div className={styles["ci-header"]}>
                    <div>
                        <h1 className={styles["ci-title"]}>{confItem.name}</h1>
                        <Button className='edit' svgButton={true} onClick={() => navigate(`/conf-items/edit/${id}`)}></Button>

                    </div>
                    {confItem.serial_number && (
                        <span className={styles["ci-serial"]}>{confItem.serial_number}</span>
                    )}
                </div>

                <div className={styles["meta-grid"]}>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Статус</span>
                        <span className={`badge badge-${confItem.status}`}>
                            {ciStatusLabels[confItem.status] || confItem.status}
                        </span>
                    </div>
                    <div className={styles["meta-item"]}>
                        <span className={styles["meta-label"]}>Тип</span>
                        <span className={styles["meta-value"]}>{confItem.ci_type.name}</span>
                    </div>
                </div>

                <div className={styles["owner-section"]}>
                    <div className={styles["owner-item"]}>
                        <div className={styles["owner-label"]}>Владелец</div>
                        {confItem.owner ? (
                            <div className={styles["owner-content"]}>
                                <div className={styles.avatar}>{ownerInitials}</div>
                                <div className={styles["owner-info"]}>
                                    <span className={styles["owner-name"]}>
                                        {confItem.owner.first_name} {confItem.owner.last_name}
                                    </span>
                                    <span className={styles["owner-email"]}>{confItem.owner.email}</span>
                                </div>
                            </div>
                        ) : (
                            <span className={styles["no-owner"]}>Владелец не назначен</span>
                        )}
                    </div>
                    <RoleGuard roles={["support", "admin"]} hideMode={true}>
                        <OwnerControls
                            confItem={confItem}
                            onCIUpdated={fetchCI}
                        />
                    </RoleGuard>
                </div>

                {confItem.ci_type.description && (
                    <div className={styles["description-section"]}>
                        <div className={styles["description-label"]}>Описание типа</div>
                        <div className={styles["description-text"]}>{confItem.ci_type.description}</div>
                    </div>
                )}
            </div>
            <div className={styles["dependencies-section"]}>
                <div className={styles["dependencies-header"]}>
                    <h2 className={styles["dependencies-title"]}>Зависимости</h2>
                </div>
                <RoleGuard roles={["support", "admin"]} hideMode={true}>
                    <div className={styles["dependencies-form"]}>
                        <CreateDependencyForm
                            id={id}
                            ciName={confItem.name}
                            onDependencyCreated={() => setDepRefreshKey(k => k + 1)}
                        />
                    </div>
                </RoleGuard>
                <DependencyList
                    ciId={id}
                    refreshTrigger={depRefreshKey}
                />

            </div>
        </>
    )
}