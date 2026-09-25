import { jwtDecode } from "jwt-decode";
import type { IPayload } from "../interfaces/IPayload";

export function getTokenPayload(): IPayload | null {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    return jwtDecode<IPayload>(token);
}