import type { UserRole } from "../utils/user";

export interface IPayload {
    sub: number;
    name: string;
    role: UserRole;
    iat: number;
    exp: number;
}