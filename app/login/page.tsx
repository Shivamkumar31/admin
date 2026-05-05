// src/app/login/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuthStore } from '@/store/authStore';

/**
 * Login Page
 * Handles user authentication with DummyJSON API
 * 
 * Test Credentials:
 * - username: 'emilys', password: 'emilyspass'
 * - username: 'kminchelle', password: '0lelplR'
 */

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: storeError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setLocalError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLocalError(null);

      // Validation
      if (!formData.username.trim()) {
        setLocalError('Username is required');
        return;
      }
      if (!formData.password.trim()) {
        setLocalError('Password is required');
        return;
      }

      try {
        await login(formData.username, formData.password);
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
        setLocalError(message);
      }
    },
    [formData, login, router]
  );

  const displayError = localError || storeError;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 3,
        }}
      >
        {/* Logo / Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 2 }}>
            Admin Login
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
            Sign in to access the dashboard
          </Typography>
        </Box>

        {/* Login Card */}
        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Error Alert */}
                {displayError && (
                  <Alert severity="error" onClose={() => setLocalError(null)}>
                    {displayError}
                  </Alert>
                )}

                {/* Info Alert with Test Credentials */}
                <Alert severity="info">
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Test Credentials:
                  </Typography>
                  <Typography variant="caption" component="div">
                    Username: <strong>emilys</strong>
                  </Typography>
                  <Typography variant="caption" component="div">
                    Password: <strong>emilyspass</strong>
                  </Typography>
                </Alert>

                {/* Username Field */}
                <TextField
                  label="Username or Email"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={isLoading}
                  autoComplete="username"
                  autoFocus
                  placeholder="emilys"
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    position: 'relative',
                    minHeight: 44,
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{
                          position: 'absolute',
                          color: 'white',
                        }}
                      />
                      <span style={{ visibility: 'hidden' }}>Sign In</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Typography
          variant="caption"
          sx={{
            color: '#999',
            textAlign: 'center',
            mt: 2,
          }}
        >
          This is a demo application using DummyJSON API
        </Typography>
      </Box>
    </Container>
  );
}
