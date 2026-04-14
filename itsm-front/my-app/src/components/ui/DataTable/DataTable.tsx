import { DataTableBody } from './DataTableBody';
import { DataTableHead } from './DataTableHead';
import type { DataTableProps } from './types';



export const DataTable = <T extends { id: number }>({
    data,
    columns,
    loading = false,
    error = null,
    emptyMessage = 'Нет данных',
}: DataTableProps<T>) => {
    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!data || data.length === 0) {
        return <div>{emptyMessage}</div>;
    }

    return (
        <table>
            <DataTableHead columns={columns} />
            <DataTableBody columns={columns} data={data} />
        </table>
    );
};