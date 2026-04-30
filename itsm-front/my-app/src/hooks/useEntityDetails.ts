import { useEffect, useState } from "react";
import { api } from "../api";


interface UseEntityDetailsResult<T> {
    entity: T | null;
    isLoading: boolean;
    error: string | null;
    fetch: () => void;
}

export const useEntityDetails = <T>(endpoint: string, id: string): UseEntityDetailsResult<T> => {
    const [entity, setEntity] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null)

    const fetchEntity = async (signal?: AbortSignal) => {
        try {
            setIsLoading(true);
            const response = await api.getDetail<T>(`${endpoint}/${id}`, signal);

            if (response.success) {
                setEntity(response.data);
                setError(null);
            } else {
                throw new Error(response.error.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            setEntity(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        fetchEntity(abortController.signal);
        return () => abortController.abort();
    }, [])

    return { entity, isLoading, error, fetch: fetchEntity }
}