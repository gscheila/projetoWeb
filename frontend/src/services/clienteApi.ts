import axios from 'axios';
import { Cliente, ClienteInput } from '../types/Cliente';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export const getClientes = () => api.get<Cliente[]>('/clientes');
export const getCliente = (id: number) => api.get<Cliente>(`/clientes/${id}`);
export const createCliente = (cliente: ClienteInput) => api.post<Cliente>('/clientes', cliente);
export const updateCliente = (id: number, cliente: Cliente) => api.put<Cliente>(`/clientes/${id}`, cliente);
export const deleteCliente = (id: number) => api.delete(`/clientes/${id}`);

export default api; 