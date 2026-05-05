'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f5f7fb',
        minHeight: '100vh',
      }}
    >
      {/* 🔹 Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Dashboard Overview 🚀
      </Typography>

      {/* 🔹 Cards */}
      <Grid container spacing={3}>
        {/* Card 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6">Products</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                120
              </Typography>
              <Typography color="text.secondary">
                Total products in store
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                45
              </Typography>
              <Typography color="text.secondary">
                Registered users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                $12,500
              </Typography>
              <Typography color="text.secondary">
                Monthly earnings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔹 Welcome Section */}
      <Box
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          color: '#fff',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Welcome Back 👋
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Manage your products, users, and analytics from this dashboard.
        </Typography>
      </Box>
    </Box>
  );
}