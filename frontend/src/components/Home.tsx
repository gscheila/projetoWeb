import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao Sistema
        </Typography>
        <Typography variant="body1">
          Este é o sistema de gerenciamento de clientes. Use o menu lateral para navegar entre as funcionalidades.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home; 