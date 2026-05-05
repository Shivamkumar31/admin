'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Container,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUserStore } from '@/store/userStore';

const LIMIT = 10;

export default function UsersPage() {
  const {
    users,
    isLoading,
    error,
    pagination,
    searchResults,
    isSearching,
    fetchUsers,
    searchUsers,
    clearCache,
  } = useUserStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const skip = (currentPage - 1) * LIMIT;
    fetchUsers(LIMIT, skip);
  }, [currentPage, fetchUsers]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (query.trim()) {
        searchUsers(query);
      }
    },
    [searchUsers]
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
      setSearchQuery('');
    },
    []
  );

  const handleRefresh = useCallback(() => {
    clearCache();
    setCurrentPage(1);
    fetchUsers(LIMIT, 0);
  }, [clearCache, fetchUsers]);

  const displayUsers = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults;
    }
    return users;
  }, [users, searchResults, searchQuery]);

  const totalPages = useMemo(() => {
    const total = searchQuery && searchResults ? searchResults.length : pagination.total;
    return Math.ceil(total / LIMIT);
  }, [pagination.total, searchResults, searchQuery]);

  const isLoaded = !isLoading && !isSearching;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Users Management
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Total Users: <strong>{pagination.total}</strong>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            disabled={isSearching || isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </CardContent>
      </Card>

      {(isLoading || isSearching) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isLoaded && displayUsers.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {displayUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>{user.gender || 'N/A'}</TableCell>

                    <TableCell>{user.phone || 'N/A'}</TableCell>

                    <TableCell>{user.company?.name || 'N/A'}</TableCell>

                    <TableCell align="center">
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Button size="small">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!searchQuery && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}

      {isLoaded && displayUsers.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ mb: 2 }}>
            {searchQuery ? 'No users found' : 'No users available'}
          </Typography>

          {searchQuery && (
            <Button
              variant="contained"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      )}
    </Container>
  );
}