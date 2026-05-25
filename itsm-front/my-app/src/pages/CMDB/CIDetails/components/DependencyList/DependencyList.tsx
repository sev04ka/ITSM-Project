import { type FC, useState, useCallback, useEffect } from "react";
import type ICIDependency from "../../../../../interfaces/entities/CIDependency";
import { api } from "../../../../../api";
import { ConfirmModal } from "../../../../../components/ui/ConfirmModal/ConfirmModal";
import { useToast } from "../../../../../context/ToastContext";
import { Button } from "../../../../../components/ui/Button/Button";
import { LoadingState } from "../../../../../components/ui/LoadingState/LoadingState";
import { EmptyState } from "../../../../../components/ui/EmptyState/EmptyState";
import styles from './dependencylist.module.css'
import { Link } from "react-router-dom";

interface DependencyListProps {
    ciId: string;
    refreshTrigger: number;
}

export const DependencyList: FC<DependencyListProps> = ({
    ciId,
    refreshTrigger
}) => {
    const [dependencies, setDependencies] = useState<ICIDependency[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        id: number | null;
    }>({ isOpen: false, id: null });
    const toast = useToast();

    const fetchCIDependencies = useCallback(async () => {
        setLoading(true);
        const response = await api.getList<ICIDependency>(`/ci-dependencies/for/${ciId}`)
        if (response.success) {
            const items = Array.isArray(response.data.results) ? response.data.results : []
            setDependencies(items)
        }
        setLoading(false);
    }, [])

    useEffect(() => {
        fetchCIDependencies();
    }, [refreshTrigger])

    const filteredDeps = dependencies.filter(
        (dep) => String(dep.parent.id) === ciId || String(dep.child.id) === ciId
    );

    const handleDeleteClick = async (id: number) => {
        setDeleteConfirm({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm.id) {
            const response = await api.delete(`/ci-dependencies/${deleteConfirm.id}/`);
            if (response.success) {
                setDeleteConfirm({ isOpen: false, id: null });
                fetchCIDependencies();
                toast.success("Зависимость удалена");
            } else {
                toast.error(response.error?.message || "Ошибка при удалении");
            }
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (filteredDeps.length === 0) {
        return <EmptyState message="Зависимости не найдены" />;
    }

    return (
        <>
            <div className={styles.list}>
                {filteredDeps.map((dependency) => {
                    return (
                        <div key={dependency.id} className={styles.card}>
                            <div className={styles["card-body"]}>
                                <div className={styles["card-content"]}>

                                    {String(dependency.parent.id) != ciId &&
                                        <Link to={`/conf-items/${dependency.parent.id}`}>
                                            <div className={styles["ci-block"]}>
                                                <span className={`${styles["ci-name"]}`}>
                                                    {dependency.parent.name}
                                                </span>
                                                <span className={styles["ci-role"]}>Родитель</span>
                                            </div>
                                        </Link>
                                    }

                                    {String(dependency.parent.id) == ciId &&
                                        <div className={styles["ci-block"]}>
                                            <span className={`${styles["ci-name"]} `}>
                                                {dependency.parent.name}
                                            </span>
                                            <span className={styles["ci-role"]}>Родитель</span>
                                        </div>
                                    }

                                    <div className={styles.arrow}>
                                        <span className="arrow-right"></span>
                                    </div>

                                    <div className={styles["label-block"]}>
                                        <span className={styles["label-text"]}>{dependency.label}</span>
                                    </div>

                                    <div className={styles.arrow}>
                                        <span className="arrow-right"></span>
                                    </div>

                                    {String(dependency.child.id) != ciId &&
                                        <Link to={`/conf-items/${dependency.child.id}`}>
                                            <div className={styles["ci-block"]}>
                                                <span className={`${styles["ci-name"]}`}>
                                                    {dependency.child.name}
                                                </span>
                                                <span className={styles["ci-role"]}>потомок</span>
                                            </div>
                                        </Link>
                                    }

                                    {String(dependency.child.id) == ciId &&
                                        <div className={styles["ci-block"]}>
                                            <span className={`${styles["ci-name"]}`}>
                                                {dependency.child.name}
                                            </span>
                                            <span className={styles["ci-role"]}>потомок</span>
                                        </div>
                                    }
                                </div>
                                <div className={styles["delete-wrapper"]}>
                                    <Button
                                        className="delete"
                                        svgButton={true}
                                        onClick={() => handleDeleteClick(dependency.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div >
            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                title="Подтверждение удаления"
                message="Вы уверены, что хотите удалить эту зависимость?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
            />
        </>
    )
}