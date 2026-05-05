// src/store/userStore.ts
import { create } from 'zustand';
import userService from '@/services/userService';

/**
 * User Store - Manages users list and detail view state
 * Handles pagination, search, and caching
 */

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  company?: {
    name?: string;
    title?: string;
    department?: string;
  };
  image?: string;
  age?: number;
  address?: {
    address?: string;
    city?: string;
    country?: string;
  };
}

interface PaginationMeta {
  total: number;
  limit: number;
  skip: number;
}

interface UserState {
  // State
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  searchResults: User[] | null;
  isSearching: boolean;

  // Cache tracking
  lastFetchTime: number;
  cacheValid: boolean;

  // Actions
  fetchUsers: (limit: number, skip: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache validity

export const useUserStore = create<UserState>((set, get) => ({
  // Initial State
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: { total: 0, limit: 10, skip: 0 },
  searchResults: null,
  isSearching: false,
  lastFetchTime: 0,
  cacheValid: false,

  // Actions
  fetchUsers: async (limit: number, skip: number) => {
    const state = get();
    
    // Check cache validity
    if (
      state.cacheValid &&
      Date.now() - state.lastFetchTime < CACHE_DURATION &&
      state.users.length > 0
    ) {
      // Use cached data, just update pagination
      set({ pagination: { total: state.pagination.total, limit, skip } });
      return;
    }

    set({ isLoading: true, error: null, searchResults: null });
    try {
      const response = await userService.getUsers(limit, skip);
      
      set({
        users: response.users,
        pagination: {
          total: response.total,
          limit: response.limit,
          skip: response.skip,
        },
        isLoading: false,
        lastFetchTime: Date.now(),
        cacheValid: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  searchUsers: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: null, isSearching: false });
      return;
    }

    set({ isSearching: true, error: null });
    try {
      const response = await userService.searchUsers(query);
      set({
        searchResults: response.users,
        isSearching: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      set({
        isSearching: false,
        error: errorMessage,
      });
    }
  },

  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.getUserById(id);
      set({
        currentUser: user,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearCache: () => {
    set({
      users: [],
      searchResults: null,
      lastFetchTime: 0,
      cacheValid: false,
    });
  },
}));
