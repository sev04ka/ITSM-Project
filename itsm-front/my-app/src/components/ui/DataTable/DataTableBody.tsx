import type { Column } from './types';

interface DataTableBodyProps<T> {
    columns: Column<T>[];
    data: T[]
}

export const DataTableBody = <T extends { id: number }>({
    data,
    columns
}: DataTableBodyProps<T>) => {
    return (

        <tbody>
            {data.map((item) => (
                <tr key={item.id}>
                    {columns.map((col) => (
                        <td key={String(col.key)}>
                            {col.template ? col.template(item) : String(item[col.key as keyof T])}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};