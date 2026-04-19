import type { FC } from "react";
import { useQueryParams } from "../../../hooks/useQueryParams"
import styles from './pagination.module.css'
import { Button } from "../Button/Button";

interface PaginationProps {
    itemCount: number;
    pageSize?: number;
}

export const Pagination: FC<PaginationProps> = ({
    itemCount,
    pageSize = 5,
}) => {
    const { searchParams, setParams } = useQueryParams()

    const currentPage: number = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const totalPages = Math.ceil(itemCount / pageSize);

    return (
        <div className={styles.container}>
            <div>
                <Button disabled={currentPage === 1} onClick={() => setParams({ page: currentPage - 1 })}> предыдущая </Button>
            </div>
            <div className={styles.pagecounter}>
                {currentPage}
            </div>
            <div>
                <Button disabled={totalPages === currentPage} onClick={() => setParams({ page: currentPage + 1 })}> следующая</Button>
            </div>
        </div>
    )
}