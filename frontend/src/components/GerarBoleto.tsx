import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: '#fff',
}));

interface BoletoData {
  clienteId: string;
  valor: number;
  dataVencimento: string;
  descricao: string;
}

const GerarBoleto: React.FC = () => {
  const [boletoData, setBoletoData] = useState<BoletoData>({
    clienteId: '',
    valor: 0,
    dataVencimento: '',
    descricao: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/boletos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boletoData),
      });

      if (response.ok) {
        setSuccess(true);
        setBoletoData({
          clienteId: '',
          valor: 0,
          dataVencimento: '',
          descricao: ''
        });
      } else {
        throw new Error('Erro ao gerar boleto');
      }
    } catch (err) {
      setError('Erro ao gerar boleto. Tente novamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBoletoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gerar Boleto
      </Typography>
      <StyledPaper>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID do Cliente"
                name="clienteId"
                value={boletoData.clienteId}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                name="valor"
                type="number"
                value={boletoData.valor}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                name="dataVencimento"
                type="date"
                value={boletoData.dataVencimento}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                multiline
                rows={4}
                value={boletoData.descricao}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Gerar Boleto
              </Button>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Boleto gerado com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GerarBoleto; 