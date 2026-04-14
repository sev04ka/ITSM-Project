import { DataTable } from "../DataTable/DataTable";
import type { Column } from '../../ui/DataTable/types';
import { FilterBar } from "../FilterBar/FilterBar";
import { Pagination } from "../Pagination/Pagination";
import { useEntityList } from '../../../hooks/useEntityList';

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
        <>
            <FilterBar />
            <DataTable
                data={data}
                columns={columns}
                loading={loading}
                error={error}
            />
            <Pagination itemCount={itemCount} />
        </>
    );
}

