import axios from 'axios';
import { Funcionario, FuncionarioInput } from '../types/Funcionario';

const API_URL = 'http://localhost:8080/api/funcionarios';

export const getClientes = () => {
    return axios.get<Funcionario[]>(API_URL);
};

export const getCliente = (id: number) => {
    return axios.get<Funcionario>(`${API_URL}/${id}`);
};

export const createCliente = (funcionario: FuncionarioInput) => {
    return axios.post<Funcionario>(API_URL, funcionario);
};

export const updateCliente = (id: number, funcionario: Funcionario) => {
    return axios.put<Funcionario>(`${API_URL}/${id}`, funcionario);
};

export const deleteCliente = (id: number) => {
    return axios.delete(`${API_URL}/${id}`);
};

export const uploadFuncionarios = (formData: FormData) => {
    return axios.post<Funcionario[]>(`${API_URL}/importar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export default API_URL; 