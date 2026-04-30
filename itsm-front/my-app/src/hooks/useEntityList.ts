import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { useQueryParams } from './useQueryParams';

interface UseEntityListResult<T> {
    data: T[];
    itemCount: number;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useEntityList = <T>(endpoint: string, usingParams: boolean = true): UseEntityListResult<T> => {
    const [data, setData] = useState<T[]>([]);
    const [itemCount, setItemCount] = useState(1)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { searchParams } = useQueryParams();

    const abortControllerRef = useRef<AbortController | null>(null);



    const fetchData = async () => {
        try {
            setLoading(true);

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            const queryParams = new URLSearchParams(searchParams.toString());
            const queryString = queryParams.toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint

            const response = await api.getList<T>(usingParams ? url : endpoint, abortControllerRef.current.signal);

            if (response.success) {
                const items = Array.isArray(response.data.results) ? response.data.results : []
                setItemCount(response.data.count)
                setData(items);

                setError(null);
            } else {
                throw new Error(response.error.message);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const dependncies = usingParams ? [searchParams] : []

    useEffect(() => {
        if (endpoint == '') return

        fetchData();

        return () => {
            if (abortControllerRef.current)
                abortControllerRef.current.abort();
        }
    }, dependncies);

    return { data, itemCount, loading, error, refetch: fetchData };
};