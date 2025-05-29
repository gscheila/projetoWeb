import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Cliente, ClienteInput } from '../types/Cliente';
import * as api from '../services/clienteApi';

const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const initialClienteInput: ClienteInput = {
    nome: '',
    email: '',
    telefone: '',
    estado: ''
};

export default function ClienteList() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<ClienteInput>(initialClienteInput);
    const [errors, setErrors] = useState<Partial<ClienteInput>>({});

    const fetchClientes = async () => {
        try {
            const response = await api.getClientes();
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Partial<ClienteInput> = {};
        
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório';
        } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
            newErrors.telefone = 'Telefone inválido. Use o formato: (99) 99999-9999';
        }
        
        if (!formData.estado) {
            newErrors.estado = 'Estado é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            if (editingId !== null) {
                await api.updateCliente(editingId, { ...formData, id: editingId });
            } else {
                await api.createCliente(formData);
            }
            handleClose();
            fetchClientes();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        }
    };

    const handleEdit = (cliente: Cliente) => {
        setEditingId(cliente.id);
        setFormData({
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            estado: cliente.estado
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await api.deleteCliente(id);
                fetchClientes();
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setFormData(initialClienteInput);
        setErrors({});
    };

    const formatTelefone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Cadastro de Clientes
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                    sx={{ mb: 2 }}
                >
                    Novo Cliente
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Telefone</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.nome}</TableCell>
                                    <TableCell>{cliente.email}</TableCell>
                                    <TableCell>{cliente.telefone}</TableCell>
                                    <TableCell>{cliente.estado}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(cliente)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(cliente.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingId !== null ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                fullWidth
                                label="Nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                margin="normal"
                                error={!!errors.nome}
                                helperText={errors.nome}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                margin="normal"
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
                                margin="normal"
                                error={!!errors.telefone}
                                helperText={errors.telefone || '(99) 99999-9999'}
                            />
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                margin="normal"
                                error={!!errors.estado}
                                helperText={errors.estado}
                            >
                                {estados.map((estado) => (
                                    <MenuItem key={estado} value={estado}>
                                        {estado}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Salvar
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Container>
    );
} 