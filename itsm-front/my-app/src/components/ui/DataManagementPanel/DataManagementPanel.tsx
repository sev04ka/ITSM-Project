import { DataTable } from "../DataTable/DataTable";
import type { Column } from '../../ui/DataTable/types';
import { FilterBar } from "../FilterBar/FilterBar";
import { Pagination } from "../Pagination/Pagination";
import { useEntityList } from '../../../hooks/useEntityList';
import styles from './managementpanel.module.css'

interface DataManagementPanelProps<T> {
    columns: Column<T>[];
    endpoint: string;
}

export const DataManagementPanel = <T extends { id: number }>({
    columns,
    endpoint
}: DataManagementPanelProps<T>) => {
    const { data, itemCount, loading, error } = useEntityList<T>(endpoint);

    return (
        <div className={styles.container}>
            <div className={styles["data-and-filters"]}>
                <FilterBar />
                <DataTable
                    data={data}
                    columns={columns}
                    loading={loading}
                    error={error}
                />
            </div>
            <Pagination itemCount={itemCount} />
        </div>
    );
}

