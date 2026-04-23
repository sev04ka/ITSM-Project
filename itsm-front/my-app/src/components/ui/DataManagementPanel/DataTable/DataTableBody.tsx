import type { Column } from './types';
import styles from './datatable.module.css'
import { Button } from '../../Button/Button';
import { useNavigate } from 'react-router-dom';

interface DataTableBodyProps<T> {
    columns: Column<T>[];
    data: T[]
}



export const DataTableBody = <T extends { id: number }>({
    data,
    columns
}: DataTableBodyProps<T>) => {
    const navigate = useNavigate();

    return (
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
                        <Button className='delete' svgButton={true}></Button>
                    </td>
                </tr>
            ))}

        </tbody>
    );
};