import React from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import ClienteList from './components/ClienteList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <ClienteList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
