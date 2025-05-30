import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1">
          Esta página está em construção. Em breve você poderá ajustar as configurações do sistema aqui.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings; 