export interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    estado: string;
}

export interface ClienteInput {
    nome: string;
    email: string;
    telefone: string;
    estado: string;
} 