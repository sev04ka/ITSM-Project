import { DataTableBody } from './DataTableBody';
import { DataTableHead } from './DataTableHead';
import type { DataTableProps } from './types';
import styles from './datatable.module.css'
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../Button/Button';




export const DataTable = <T extends { id: number }>({
    data,
    columns,
    loading = false,
    error = null,
    emptyMessage = 'Нет данных',
    deleteHandler
}: DataTableProps<T>) => {
    const { searchParams, setParams } = useQueryParams()
    const navigate = useNavigate();

    const setOrdering = (orderingParam: string): void => {
        const currentOrderingParam = searchParams.get('ordering');

        if (!currentOrderingParam) {
            setParams({ ordering: orderingParam })
            return
        }

        if (currentOrderingParam.includes(orderingParam)) {
            setParams({ ordering: currentOrderingParam.startsWith('-') ? orderingParam : `-${orderingParam}` })
            return
        }

        setParams({ ordering: orderingParam })
    }

    const setOrderingIndication = (colName: string): string => {
        const currentOrderingParam = searchParams.get('ordering');

        if (!currentOrderingParam) return ''

        if (currentOrderingParam.includes(colName)) {
            return currentOrderingParam.startsWith('-') ? 'desc' : `asc`
        }

        return ''
    }

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
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={String(col.key)} onClick={() => setOrdering(String(col.key))}>
                            <span>
                                {col.title}
                            </span>
                            <span>
                                {setOrderingIndication(String(col.key))}
                            </span>
                        </th>
                    ))}
                    <th key={"edit-delete-th"}></th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((col) => (
                            <td key={String(col.key)}>
                                {item[col.key as keyof T] ?
                                    col.template ? col.template(item) : String(item[col.key as keyof T]) :
                                    '-'
                                }
                            </td>
                        ))}
                        <td key={"edit-delete-td"} className={styles["table-row-controls"]}>
                            <Button className='edit' svgButton={true} onClick={() => navigate(`edit/${item.id}`)}></Button>
                            <Button className='delete' svgButton={true} onClick={() => deleteHandler(item.id)}></Button>
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    );
};