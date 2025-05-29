import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ClienteList from './components/ClienteList';
import GerarBoleto from './components/GerarBoleto';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Sistema de Gerenciamento
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Clientes
          </Button>
          <Button color="inherit" component={Link} to="/gerar-boleto">
            Gerar Boleto
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<ClienteList />} />
          <Route path="/gerar-boleto" element={<GerarBoleto />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
