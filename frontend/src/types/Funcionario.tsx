export type Senioridade = 'Estagiário' | 'Junior' | 'Pleno' | 'Senior' | 'Liderança' | 'Staff Engineer' | 'Principal Engineer';

export type Cargo = 'Dev BackEnd' | 'Dev FrontEnd' | 'QA' | 'Tech Manager' | 'Gerente' | 'Diretor' | 'Staff Eng' | 'Principal Eng';

export type Modelo = 'PJ' | 'CLT';

export interface Funcionario {
    id: number;
    nome: string;
    email: string;
    time: string;
    mesEntrada: string;
    fabrica: string;
    senioridade: Senioridade;
    cargo: Cargo;
    modelo: Modelo;
}

export interface FuncionarioInput {
    nome: string;
    email: string;
    time: string;
    mesEntrada: string;
    fabrica: string;
    senioridade: Senioridade;
    cargo: Cargo;
    modelo: Modelo;
} 