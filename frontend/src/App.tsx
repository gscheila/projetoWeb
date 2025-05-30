import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, styled, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import FuncionarioList from './components/FuncionarioList';
import Settings from './components/Settings';

const DRAWER_WIDTH = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

const DrawerHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  minHeight: '64px',
  justifyContent: 'flex-end',
}));

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Sidebar
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            onToggle={handleDrawerToggle}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: '100%',
              minHeight: '100vh',
              bgcolor: 'background.default',
              marginLeft: { xs: 0, sm: `${DRAWER_WIDTH}px` },
            }}
          >
            <DrawerHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/funcionarios" element={<FuncionarioList />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
