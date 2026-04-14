import { useEffect, useState } from 'react';
import { api } from '../api';
import { useQueryParams } from './useQueryParams';

interface UseEntityListResult<T> {
    data: T[];
    itemCount: number;
    loading: boolean;
    error: string | null;
    fetch: () => void;
}

export const useEntityList = <T>(endpoint: string): UseEntityListResult<T> => {
    const [data, setData] = useState<T[]>([]);
    const [itemCount, setItemCount] = useState(1)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { searchParams } = useQueryParams()

    const fetchData = async () => {
        try {
            setLoading(true);

            const queryParams = new URLSearchParams();

            if (searchParams.get('page')) queryParams.set('page', String(searchParams.get('page')));
            if (searchParams.get('search')) queryParams.set('search', String(searchParams.get('search')));
            if (searchParams.get('ordering')) queryParams.set('ordering', String(searchParams.get('ordering')));

            const queryString = queryParams.toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint

            const response = await api.getList<T>(url);

            if (response.success) {
                const items = Array.isArray(response.data.results) ? response.data.results : []

                setItemCount(response.data.count)
                setData(items);
                setError(null);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    return { data, itemCount, loading, error, fetch: fetchData };
};