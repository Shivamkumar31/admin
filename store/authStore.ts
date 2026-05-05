// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@/services/authService';

/**
 * Auth Store - Manages user authentication state
 */

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 🔹 Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
login: async (username: string, password: string) => {
  set({ isLoading: true, error: null });

  try {
    const response = await authService.login(username, password);

    // ✅ handle token properly
    const token =
      response.token ||
      (response as any).accessToken ||
      response.refreshToken;

    console.log("API RESPONSE:", response); // 🔥 debug

    if (!token) {
      throw new Error('No token received from server');
    }

    set({
      user: {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      },
      token: token,
      isAuthenticated: true,
      isLoading: false,
    });

    localStorage.setItem('authToken', token);

    return true; // ✅ IMPORTANT
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Login failed';

    set({
      isLoading: false,
      error: errorMessage,
      isAuthenticated: false,
    });

    return false; // ❌ IMPORTANT
  }
},
      // 🔐 LOGIN
      
      // 🚪 LOGOUT
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
      },

      // 🔑 SET TOKEN
      setToken: (token: string) => {
        set({
          token,
          isAuthenticated: !!token,
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
        }
      },

      // 👤 SET USER
      setUser: (user: User) => {
        set({ user });
      },

      // ❗ SET ERROR
      setError: (error: string | null) => {
        set({ error });
      },

      // 🔄 HYDRATE (on app start)
      hydrate: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('authToken');

          if (token) {
            set({
              token,
              isAuthenticated: true,
            });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);