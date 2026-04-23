import { useQueryParams } from '../../../../hooks/useQueryParams';
import type { Column } from './types';
import styles from './datatable.module.css'


interface DataTableHeadProps<T> {
    columns: Column<T>[];
}

export const DataTableHead = <T,>({
    columns,
}: DataTableHeadProps<T>) => {
    const { searchParams, setParams } = useQueryParams()

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

    return (
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
    );
};