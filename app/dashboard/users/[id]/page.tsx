'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <Box p={3}>
      <Button onClick={() => router.back()}>⬅ Back</Button>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone}</Typography>
          <Typography>Gender: {user.gender}</Typography>
          <Typography>Company: {user.company?.name}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}