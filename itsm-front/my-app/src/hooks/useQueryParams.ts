import { useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface QueryParams {
    page?: number;
    search?: string;
    ordering?: string;
}

export const useQueryParams = <T extends QueryParams>() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setParams = (newParams: Partial<T>, filter: boolean = false, debounceMs: number = 0) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const update = () => {
            const newSearchParams = new URLSearchParams(searchParams);

            Object.entries(newParams).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            });

            if (newParams.search || newParams.ordering || filter) {
                newSearchParams.set('page', '1');
            }

            setSearchParams(newSearchParams, { replace: false });
        };

        if (debounceMs > 0) {
            timeoutRef.current = setTimeout(update, debounceMs);
        } else {
            update();
        }
    }

    const resetParams = () => {
        setSearchParams({}, { replace: false });
    }

    return { searchParams, setParams, resetParams }
}