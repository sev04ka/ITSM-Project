import { DataTable } from "./DataTable/DataTable";
import type { Column } from './DataTable/types';
import { FilterBar } from "./FilterBar/FilterBar";
import { Pagination } from "../Pagination/Pagination";
import { useEntityList } from '../../../hooks/useEntityList';
import styles from './managementpanel.module.css'
import type { FilterParams } from "./Filter/Filter";
import { Button } from "../Button/Button";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../../../api";
import { useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { useQueryParams } from "../../../hooks/useQueryParams";

interface DataManagementPanelProps<T> {
    header: string;
    columns: Column<T>[];
    endpoint: string;
    filters?: FilterParams[];
}



export const DataManagementPanel = <T extends { id: number }>({
    header,
    columns,
    endpoint,
    filters
}: DataManagementPanelProps<T>) => {
    const { data, itemCount, loading, error, refetch } = useEntityList<T>(endpoint);
    const navigate = useNavigate();
    const { searchParams, setParams } = useQueryParams();
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        id: number | null;
    }>({ isOpen: false, id: null });

    const handleDeleteClick = async (id: number) => {
        setDeleteConfirm({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm.id) {
            const response = await api.delete(`${endpoint}/${deleteConfirm.id}/`);
            if (response.success) {
                if (data.length == 1) {
                    handleEmptyPageAfterDelete();
                }
                setDeleteConfirm({ isOpen: false, id: null });
                refetch();
            }
        }
    };

    const handleEmptyPageAfterDelete = () => {
        const currentPage = Number(searchParams.get('page'))
        const totalPages = Math.ceil(itemCount / 5);

        if (currentPage == totalPages && totalPages != 1)
            setParams({ page: currentPage - 1 });
    }

    return (
        <>
            <div className={styles.container}>

                <div className={styles["data-panel"]}>
                    <div className={styles["data-panel-header"]}>
                        <div>
                            <h2>{header}</h2>

                        </div>
                        <Button onClick={() => navigate("add")}>add</Button>
                    </div>
                    <FilterBar filters={filters} />

                    {data.length > 0 && (
                        <DataTable
                            data={data}
                            columns={columns}
                            loading={loading}
                            error={error}
                            deleteHandler={handleDeleteClick}
                        />
                    )}

                    {data.length == 0 && (
                        <div className={styles["no-data"]}>Ничего не найдено</div>
                    )}
                </div>
                <Pagination itemCount={itemCount} />
            </div>
            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                title="Подтверждение удаления"
                message="Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
                isLoading={loading}
            />
        </>
    );
}

