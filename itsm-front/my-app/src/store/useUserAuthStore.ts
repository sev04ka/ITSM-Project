import { create } from 'zustand';
import type { IUser } from '../interfaces/entities/User';
import { success } from 'zod';
import { api } from '../api';


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

const API_URL = 'http://localhost:8000/api';

export const useUserAuthStore = create<IAuthState>((set, get) => ({
    currentUser: null,
    error: null,
    loading: false,
    isInitialized: false,

    login: async (email, password) => {
        set({ loading: true })

        const result = {
            success: false,
            error: '',
        }

        const response = await api.post<IUser>(
            '/auth/login/',
            {
                email: email,
                password: password,
            }
        )

        if (response.success) {
            const data = response.data;
            set({
                currentUser: data,
                loading: false
            });
            result.success = response.success;
        } else {
            if (response.error.status == 400) {
                set({
                    error: "Неверная почта или пароль",
                    loading: false
                })
            } else {
                set({
                    error: response.error.message,
                    loading: false
                })
            }
        }


        return {
            success: response.success,
            error: get().error ? get().error : null
        }
    },

    logout: async () => {
        set({
            loading: true
        })

        const response = await api.post(
            '/auth/logout/',
            {},
        )

        if (!response.success) {
            set({
                error: response.error.message,
                loading: false
            })
        }
    },

    refreshAccess: async (signal?: AbortSignal) => {
        set({ loading: true });

        const response = await api.post(
            '/auth/token/refresh/',
            {},
            signal
        )

        if (!response.success) {
            set({
                error: response.error.message,
                loading: false
            })
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

// login: async (email, password) => {
//     const result = {
//         success: false,
//         error: '',
//     }

//     set({ loading: true })
//     try {
//         const response = await fetch(`${API_URL}/auth/login/`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password }),
//         });

//         if (response.ok) {
//             const data = await response.json();
//             set({ currentUser: data.user });
//             result.success = response.ok;
//         }

//         if (response.status == 400) throw new Error("Неверная почта или пароль");

//     } catch (error) {
//         const message = error instanceof Error ? error.message : 'Login error';
//         set({ error: message });
//         result.error = message;
//     } finally {
//         set({ loading: false })
//     }

//     return result;
// },

// logout: async () => {
//     try {
//         set({ loading: true })
//         await fetch(`${API_URL}/auth/logout/`, {
//             method: 'POST',
//             credentials: 'include',
//         });
//         set({ currentUser: null })
//     } catch (error) {
//         const message = error instanceof Error ? error.message : 'Logout error';
//         set({ error: message });
//     } finally {
//         set({ loading: false })
//     }

// },

// refreshAccess: async (signal?: AbortSignal) => {
//     try {
//         set({ loading: true })
//         const response = await fetch(`${API_URL}/auth/token/refresh/`, {
//             method: 'POST',
//             signal: signal,
//             credentials: 'include',
//         });

//         if (response.status === 401) {
//             set({ currentUser: null });
//             const message = 'refresh token expired';
//             set({ error: message });;
//         }

//     } catch (error) {
//         const message = error instanceof Error ? error.message : 'Refresh access error';
//         set({ error: message });
//     } finally {
//         set({ loading: false })
//     }

// },

// initializeAuth: async (userSignal?: AbortSignal, tokenSignal?: AbortSignal) => {
//     if (get().isInitialized) return
//     else {
//         try {
//             set({ loading: true })

//             const response = await fetch(`${API_URL}/auth/user/`, {
//                 signal: userSignal,
//                 credentials: 'include',
//             });

//             if (response.ok) {
//                 const data = await response.json();

//                 set({ currentUser: data });
//             }

//             if (response.status === 401) {
//                 await get().refreshAccess(tokenSignal)

//                 const retriedResponse = await fetch(`${API_URL}/auth/user/`, {
//                     signal: userSignal,
//                     credentials: 'include',
//                 });

//                 if (retriedResponse.ok) {
//                     const retryData = await retriedResponse.json();
//                     set({ currentUser: retryData });
//                 }
//             }

//         } catch (error) {
//             const message = error instanceof Error ? error.message : 'User fetch error';
//             set({ error: message });
//             set({ currentUser: null });
//         } finally {
//             set({ isInitialized: true });
//             set({ loading: false });
//         }
//     }
// }
// }));
