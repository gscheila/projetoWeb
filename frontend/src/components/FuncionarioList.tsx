import React, { useEffect, useState, useRef } from 'react';
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
    MenuItem,
    Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Funcionario, FuncionarioInput, Senioridade, Cargo, Modelo } from '../types/Funcionario';
import * as api from '../services/funcionarioApi';

const squads = [
    'Core Banking',
    'Core Crédito',
    'Core Finance',
    'Core Decision',
    'Core Channels',
    'Core Collections',
    'Core Account',
    'Serviço',
    'Consumo',
    'Negociar',
    'Pagar',
    'EJ',
    'E-grana',
    'CX'
];

const meses = [
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

const fabricas = [
    'Interno',
    'Externo'
];

const senioridades: Senioridade[] = [
    'Estagiário', 'Junior', 'Pleno', 'Senior', 'Liderança', 'Staff Engineer', 'Principal Engineer'
];

const cargos = [
    'Dev BackEnd',
    'Dev FrontEnd',
    'QA',
    'Tech Manager',
    'Gerente',
    'Diretor',
    'Staff Eng',
    'Principal Eng'
];

const modelos: Modelo[] = ['PJ', 'CLT'];

const initialFuncionarioInput: FuncionarioInput = {
    nome: '',
    email: '',
    time: '',
    mesEntrada: '',
    fabrica: '',
    senioridade: 'Junior',
    cargo: 'Dev BackEnd',
    modelo: 'PJ'
};

interface ErrorMessages {
    nome?: string;
    email?: string;
    time?: string;
    mesEntrada?: string;
    fabrica?: string;
    senioridade?: string;
    cargo?: string;
    modelo?: string;
}

export default function FuncionarioList() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FuncionarioInput>(initialFuncionarioInput);
    const [errors, setErrors] = useState<ErrorMessages>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFuncionarios = async () => {
        try {
            const response = await api.getClientes();
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: ErrorMessages = {};
        
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.time) {
            newErrors.time = 'Time é obrigatório';
        }

        if (!formData.mesEntrada.trim()) {
            newErrors.mesEntrada = 'Mês de entrada é obrigatório';
        }

        if (!formData.fabrica) {
            newErrors.fabrica = 'Fábrica é obrigatória';
        }

        if (!formData.senioridade) {
            newErrors.senioridade = 'Senioridade é obrigatória';
        }

        if (!formData.cargo) {
            newErrors.cargo = 'Cargo é obrigatório';
        }

        if (!formData.modelo) {
            newErrors.modelo = 'Modelo é obrigatório';
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
            fetchFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
        }
    };

    const handleEdit = (funcionario: Funcionario) => {
        setEditingId(funcionario.id);
        setFormData({
            nome: funcionario.nome,
            email: funcionario.email,
            time: funcionario.time,
            mesEntrada: funcionario.mesEntrada,
            fabrica: funcionario.fabrica,
            senioridade: funcionario.senioridade,
            cargo: funcionario.cargo,
            modelo: funcionario.modelo
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
            try {
                await api.deleteCliente(id);
                fetchFuncionarios();
            } catch (error) {
                console.error('Erro ao excluir funcionário:', error);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setFormData(initialFuncionarioInput);
        setErrors({});
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Reset the input value so the same file can be selected again
            event.target.value = '';
            
            const formData = new FormData();
            formData.append('file', file);

            api.uploadFuncionarios(formData)
                .then(() => {
                    fetchFuncionarios();
                    alert('Funcionários importados com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao importar arquivo:', error);
                    alert('Erro ao importar arquivo. Verifique o formato e tente novamente.');
                });
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpen(true)}
                    >
                        Novo Funcionário
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UploadFileIcon />}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Importar Planilha
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                    />
                </Stack>

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="none" sx={{ pl: 2 }}>Nome</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Email</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Squad</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Mês de Entrada</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Fábrica</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Senioridade</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Cargo</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Modelo</TableCell>
                                <TableCell padding="none" sx={{ pl: 2 }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {funcionarios.map((funcionario) => (
                                <TableRow key={funcionario.id}>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.nome}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.email}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.time}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.mesEntrada}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.fabrica}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.senioridade}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.cargo}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>{funcionario.modelo}</TableCell>
                                    <TableCell padding="none" sx={{ pl: 2 }}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(funcionario)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(funcionario.id)}
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
                        {editingId !== null ? 'Editar Funcionário' : 'Novo Funcionário'}
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
                                select
                                fullWidth
                                label="Squad"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                margin="normal"
                                error={!!errors.time}
                                helperText={errors.time}
                            >
                                {squads.map((squad) => (
                                    <MenuItem key={squad} value={squad}>
                                        {squad}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Mês de Entrada"
                                value={formData.mesEntrada}
                                onChange={(e) => setFormData({ ...formData, mesEntrada: e.target.value })}
                                margin="normal"
                                error={!!errors.mesEntrada}
                                helperText={errors.mesEntrada}
                            >
                                {meses.map((mes) => (
                                    <MenuItem key={mes} value={mes}>
                                        {mes}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Modelo"
                                value={formData.modelo}
                                onChange={(e) => {
                                    const newModelo = e.target.value as Modelo;
                                    setFormData({
                                        ...formData,
                                        modelo: newModelo,
                                        fabrica: newModelo === 'CLT' ? 'Interno' : formData.fabrica
                                    });
                                }}
                                margin="normal"
                                error={!!errors.modelo}
                                helperText={errors.modelo}
                            >
                                {modelos.map((modelo) => (
                                    <MenuItem key={modelo} value={modelo}>
                                        {modelo}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Fábrica"
                                value={formData.fabrica}
                                onChange={(e) => setFormData({ ...formData, fabrica: e.target.value })}
                                margin="normal"
                                error={!!errors.fabrica}
                                helperText={errors.fabrica}
                                disabled={formData.modelo === 'CLT'}
                            >
                                {fabricas.map((fabrica) => (
                                    <MenuItem key={fabrica} value={fabrica}>
                                        {fabrica}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Senioridade"
                                value={formData.senioridade}
                                onChange={(e) => setFormData({ ...formData, senioridade: e.target.value as Senioridade })}
                                margin="normal"
                                error={!!errors.senioridade}
                                helperText={errors.senioridade}
                            >
                                {senioridades.map((senioridade) => (
                                    <MenuItem key={senioridade} value={senioridade}>
                                        {senioridade}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Cargo"
                                value={formData.cargo}
                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value as Cargo })}
                                margin="normal"
                                error={!!errors.cargo}
                                helperText={errors.cargo}
                            >
                                {cargos.map((cargo) => (
                                    <MenuItem key={cargo} value={cargo}>
                                        {cargo}
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