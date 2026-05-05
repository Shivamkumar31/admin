// src/services/userService.ts
import apiClient from './api';

/**
 * User Service
 * Handles all user-related API calls to DummyJSON
 * 
 * Endpoints:
 * - GET /users?limit=10&skip=0 - List users with pagination
 * - GET /users/search?q=... - Search users
 * - GET /users/{id} - Get single user details
 */

export interface User {
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

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

interface SearchResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const userService = {
  /**
   * Get paginated list of users
   * @param limit - Number of users per page (default: 10)
   * @param skip - Number of users to skip (for pagination)
   */
  getUsers: async (limit: number = 10, skip: number = 0): Promise<UsersResponse> => {
    try {
      const response = await apiClient.get<UsersResponse>('/users', {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  /**
   * Search users by name or email
   * @param query - Search query string
   */
  searchUsers: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get<SearchResponse>('/users/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error('User search failed');
    }
  },

  /**
   * Get detailed information for a single user
   * @param id - User ID
   */
  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
  },
};

export default userService;
