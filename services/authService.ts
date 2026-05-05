// src/services/authService.ts
import apiClient from './api';

/**
 * Authentication Service
 * Handles all auth-related API calls to DummyJSON
 */

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;

  // token variations
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

const authService = {
  /**
   * Login user with credentials
   */
  login: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        {
          username: username.trim(),   // ✅ prevent space issues
          password: password.trim(),   // ✅ prevent space issues
          expiresInMins: 30,           // ✅ helps DummyJSON
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      console.log('AUTH RESPONSE:', data); // 🔥 debug

      // ✅ Handle all token formats
      const token =
        data.token || data.accessToken || data.refreshToken;

      if (!token) {
        console.error('NO TOKEN FOUND:', data);
        throw new Error('No token received from server');
      }

      // ✅ Normalize token (important for store)
      return {
        ...data,
        token,
      };
    } catch (error: any) {
      console.error('FULL ERROR:', error.response?.data);

      throw new Error(
        error.response?.data?.message || 'Login failed'
      );
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  /**
   * Refresh token (optional)
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/refresh',
        {
          refreshToken,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  },
};

export default authService;