// src/app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '@/store/authStore';

const DRAWER_WIDTH = 280;

/**
 * Dashboard Layout
 * Wraps all dashboard pages with header and sidebar navigation
 * Protected route - redirects to login if not authenticated
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // If not authenticated, show nothing (prevent layout flash)
  if (!token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/dashboard',
    },
    {
      
      label: 'Users',
      icon: <PeopleIcon />,
      href: '/dashboard/users',
    },
    {
      label: 'Products',
      icon: <ProductionQuantityLimitsIcon />,
      href: '/dashboard/products',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, color: '#1976d2' }}>
            Admin Dashboard
          </Typography>

          {/* User Menu */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  {user.email}
                </Typography>
              </Box>
              <Avatar
                alt={user.firstName}
                src={user.image}
                sx={{ cursor: 'pointer' }}
              />
              <Button
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#fafafa',
            borderRight: '1px solid #e0e0e0',
            mt: '64px',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" sx={{ color: '#999', fontWeight: 700 }}>
            Navigation
          </Typography>
        </Box>
        <Divider />

        <List>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  onClick={() => router.push(item.href)}
                  selected={isActive}
                  sx={{
                    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                    color: isActive ? '#1976d2' : '#333',
                    '&:hover': {
                      backgroundColor: isActive ? '#e3f2fd' : '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#1976d2' : '#666',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Footer Info */}
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
            Powered by Next.js & MUI
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Built with Zustand & DummyJSON API
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          overflow: 'auto',
          marginTop: '64px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
