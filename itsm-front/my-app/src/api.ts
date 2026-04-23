import { useUserAuthStore } from "./store/useUserAuthStore";

const API_URL = 'http://localhost:8000/api';

export interface ApiError {
    status: number;
    message: string;
    details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: ApiError };




const apiRequest = async <T>(
    endpoint: string,
    options: {
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        body?: Record<string, unknown>;
        headers?: HeadersInit;
        retry?: boolean;
    }
): Promise<ApiResponse<T>> => {
    const { logout, refreshAccess } = useUserAuthStore.getState();

    const { method, body, headers = {}, retry = false } = options;

    const url = `${API_URL}${endpoint}`;

    const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
    };

    try {
        const response = await fetch(url, {
            method: method,
            credentials: 'include',
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined
        });

        if (response.status === 401) {
            try {
                if (retry) {
                    throw new Error('unauthorized')
                }

                await refreshAccess();
                return await apiRequest(endpoint, { ...options, retry: true })

            } catch (error) {
                await logout();

                window.location.href = '/login';

                return {
                    success: false,
                    error: { status: 0, message: 'Token expired' },
                };

            }
        }

        if (!response.ok) {
            let details: Record<string, string[]> | undefined;

            if (response.headers.get('content-type')?.includes('application/json')) {
                const errorData = await response.json();
                details = errorData;
            }

            return {
                success: false,
                error: {
                    status: response.status,
                    message: response.statusText || 'Request failed',
                    details,
                },
            };
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {
                success: true,
                data: undefined as unknown as T,
            };
        }

        const data = await response.json();
        return { success: true, data: data };

    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: { status: 0, message: error.message },
            };
        }

        return {
            success: false,
            error: { status: 0, message: 'Unknown error' },
        };
    }
}

export const api = {
    getList: async <T>(
        url: string,
        config?: { headers?: HeadersInit }
    ): Promise<ApiResponse<PaginatedResponse<T>>> => {
        return await apiRequest<PaginatedResponse<T>>(url, {
            method: 'GET',
            ...config,
        });
    },

    getDetail: async <T>(
        url: string,
        config?: { headers?: HeadersInit }
    ): Promise<ApiResponse<T>> => {
        return await apiRequest<T>(url, {
            method: 'GET',
            ...config,
        });
    },

    post: async <T>(
        url: string,
        body: Record<string, unknown>,
        config?: { headers?: HeadersInit }
    ): Promise<ApiResponse<T>> => {
        return await apiRequest<T>(url, {
            method: 'POST',
            body,
            ...config,
        });
    },

    put: async <T>(
        url: string,
        body: Record<string, unknown>,
        config?: { headers?: HeadersInit }
    ): Promise<ApiResponse<T>> => {
        return await apiRequest<T>(url, {
            method: 'PUT',
            body,
            ...config,
        });
    },

    patch: async <T>(
        url: string,
        body: Record<string, unknown>,
        config?: { headers?: HeadersInit }
    ): Promise<ApiResponse<T>> => {
        return await apiRequest<T>(url, {
            method: 'PATCH',
            body,
            ...config
        });
    },

    delete: async <T>(
        url: string,
        config?: { headers?: HeadersInit }
    ): Promise<ApiResponse<T>> => {
        return await apiRequest<T>(url, {
            method: 'DELETE',
            ...config
        })
    }
};