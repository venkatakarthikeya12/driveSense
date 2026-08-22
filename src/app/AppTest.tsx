import { Box, Typography } from '@mui/material';

export default function App() {
  return (
    <Box sx={{ p: 4, bgcolor: '#f0f0f0', minHeight: '100vh' }}>
      <Typography variant="h3">Test App</Typography>
      <Typography>If you see this, the app is rendering!</Typography>
    </Box>
  );
}
