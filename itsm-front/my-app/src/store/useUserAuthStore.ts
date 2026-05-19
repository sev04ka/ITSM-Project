import { create } from 'zustand';
import type IUser from '../interfaces/entities/User';
import { success } from 'zod';
import { api } from '../api';

const ENV_API_URL = import.meta.env.VITE_API_URL;

const API_URL = ENV_API_URL ? ENV_API_URL : 'http://localhost:8000/api';

interface IAuthState {
    currentUser: IUser | null;
    error: string | null;
    loading: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<{
        success: boolean;
        error: string | null;
    }>;
    logout: () => Promise<void>;
    refreshAccess: (signal?: AbortSignal) => Promise<void>;
    initializeAuth: (signal?: AbortSignal) => Promise<void>;
}

export const useUserAuthStore = create<IAuthState>((set, get) => ({
    currentUser: null,
    error: null,
    loading: false,
    isInitialized: false,


    login: async (email, password) => {
        const result = {
            success: false,
            error: '',
        }

        set({ loading: true })
        try {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                set({ currentUser: data.user });
                result.success = response.ok;
            }

            if (response.status == 400) throw new Error("Неверная почта или пароль");

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login error';
            set({ error: message });
            result.error = message;
        } finally {
            set({ loading: false })
        }

        return result;
    },

    logout: async () => {
        try {
            set({ loading: true })
            await fetch(`${API_URL}/auth/logout/`, {
                method: 'POST',
                credentials: 'include',
            });
            set({ currentUser: null })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Logout error';
            set({ error: message });
        } finally {
            set({ loading: false })
        }
    },

    refreshAccess: async (signal?: AbortSignal) => {
        try {
            set({ loading: true })
            const response = await fetch(`${API_URL}/auth/token/refresh/`, {
                method: 'POST',
                signal: signal,
                credentials: 'include',
            });

            if (response.status === 401) {
                set({ currentUser: null });
                const message = 'refresh token expired';
                set({ error: message });;
            }

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Refresh access error';
            set({ error: message });
        } finally {
            set({ loading: false })
        }
    },

    initializeAuth: async () => {
        if (get().isInitialized) return

        set({
            loading: true
        });

        const response = await api.getDetail<IUser>('/auth/user/');

        if (response.success) {
            set({
                currentUser: response.data,
                isInitialized: true,
                loading: false
            });
        } else {
            set({
                error: response.error.message,
                isInitialized: true,
                loading: false
            })
        }
    }
}));

