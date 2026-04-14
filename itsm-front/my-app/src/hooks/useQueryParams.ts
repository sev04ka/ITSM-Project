import { useSearchParams } from "react-router-dom";

interface QueryParams {
    page?: number;
    search?: string;
    ordering?: string;
}

export const useQueryParams = <T extends QueryParams>() => {
    const [searchParams, setSearchParams] = useSearchParams();

    const setParams = (newParams: Partial<T>) => {
        const newSearchParams = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                newSearchParams.delete(key);
            } else {
                newSearchParams.set(key, String(value));
            }
        });

        if (newParams.search || newParams.ordering) {
            newSearchParams.set('page', '1');
        }

        setSearchParams(newSearchParams, { replace: false });
    }

    const resetParams = () => {
        setSearchParams({}, { replace: false });
    }

    return { searchParams, setParams, resetParams }
}