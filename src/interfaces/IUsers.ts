export interface IUsers {
    id: number;
    name: string;
    email: string;
    role: string;
    ativo: boolean;
    hasPassword?: boolean;
    createdAt?: string | null;
}
