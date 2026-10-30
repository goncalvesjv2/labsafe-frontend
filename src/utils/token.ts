import { jwtDecode } from "jwt-decode";
import type { IPayload } from "../interfaces/IPayload";
import { mapUserRole } from "./user.ts";

export function getTokenPayload(): IPayload | null {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    const payload = jwtDecode<Omit<IPayload, "role"> & { role: string }>(token);
    const role = mapUserRole(payload.role);

    if (!role) {
        return null;
    }

    return { ...payload, role };
}
