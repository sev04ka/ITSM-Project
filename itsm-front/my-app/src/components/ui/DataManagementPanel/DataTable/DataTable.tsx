import type { DataTableProps } from './types';
import styles from './datatable.module.css'
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../Button/Button';
import { ErrorState } from '../../ErrorState/ErrorState';
import { LoadingState } from '../../LoadingState/LoadingState';
import { EmptyState } from '../../EmptyState/EmptyState';





export const DataTable = <T extends { id: number }>({
    data,
    columns,
    deleteHandler,
    loading,
    error,
    allowControls = true
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

    if (error) return <ErrorState message={error} />

    if (loading && !data) return <LoadingState />

    if (data.length == 0) return <EmptyState />

    return (
        <div className={styles["table-wrapper"]}>
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                onClick={col.sortable ? () => setOrdering(String(col.key)) : () => null}
                            >
                                <span className={`
                                ${styles["col-title"]} 
                                ${col.sortable && styles['sortable']} 
                                ${col.sortable ? styles[setOrderingIndication(String(col.key))] : ""}
                                `}>
                                    {col.title}
                                </span>
                            </th>
                        ))}
                        {allowControls &&
                            <th key={"edit-delete-th"}></th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            {columns.map((col) => (
                                <td key={String(col.key)}>
                                    {item[col.key as keyof T] ?
                                        col.template ?
                                            col.template(item) :
                                            String(item[col.key as keyof T]) :
                                        '-'
                                    }
                                </td>
                            ))}
                            {allowControls &&
                                <td key={"edit-delete-td"} className={styles["table-row-controls"]}>
                                    <Button className='edit' svgButton={true} onClick={() => navigate(`edit/${item.id}`)}></Button>
                                    <Button className='delete' svgButton={true} onClick={() => deleteHandler(item.id)}></Button>
                                </td>
                            }
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};