import { create } from 'zustand';
import type { IUser } from '../interfaces/entities/User';


interface IAuthState {
    currentUser: IUser | null;
    error: string | null;
    loading: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccess: () => Promise<void>;
    initializeAuth: () => Promise<void>;
}

const API_URL = 'http://localhost:8000/api';

export const useUserAuthStore = create<IAuthState>((set, get) => ({
    currentUser: null,
    error: null,
    loading: false,
    isInitialized: false,

    login: async (email, password) => {
        try {
            set({ loading: true })
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            set({ currentUser: data.user });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login error';
            set({ error: message });
        } finally {
            set({ loading: false })
        }
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

    refreshAccess: async () => {
        try {
            set({ loading: true })
            const response = await fetch(`${API_URL}/auth/token/refresh/`, {
                method: 'POST',
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
        else {
            try {
                set({ loading: true })
                const response = await fetch(`${API_URL}/auth/user/`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();

                    set({ currentUser: data });
                }

                if (response.status === 401) {
                    await get().refreshAccess()

                    const retriedResponse = await fetch(`${API_URL}/auth/user/`, {
                        credentials: 'include',
                    });

                    if (retriedResponse.ok) {
                        const retryData = await retriedResponse.json();
                        set({ currentUser: retryData });
                    }
                }

            } catch (error) {
                const message = error instanceof Error ? error.message : 'User fetch error';
                set({ error: message });
                set({ currentUser: null });
            } finally {
                set({ isInitialized: true });
                set({ loading: false });
            }
        }
    }
}));