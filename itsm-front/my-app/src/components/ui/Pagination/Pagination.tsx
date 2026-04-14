import type { FC } from "react";
import { useQueryParams } from "../../../hooks/useQueryParams"
import './pagination.css'

interface PaginationProps {
    itemCount: number;
    pageSize?: number;
}


export const Pagination: FC<PaginationProps> = ({
    itemCount,
    pageSize = 2,
}) => {
    const { searchParams, setParams } = useQueryParams()

    const currentPage: number = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const totalPages = Math.ceil(itemCount / pageSize);

    return (
        <div className="pagination-container">
            <div>
                <button disabled={currentPage === 1} onClick={() => setParams({ page: currentPage - 1 })}> {'<-'} </button>
            </div>
            <div>
                {currentPage}
            </div>
            <div>
                <button disabled={totalPages === currentPage} onClick={() => setParams({ page: currentPage + 1 })}>{'->'}</button>
            </div>
        </div>
    )
}