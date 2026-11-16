import { jwtDecode } from "jwt-decode";
import type { IPayload } from "../interfaces/IPayload";
import { mapUserRole } from "./user.ts";

export function getTokenPayload(token: string | null = sessionStorage.getItem("token")): IPayload | null {
    if (typeof token !== "string" || !token) {
        return null;
    }

    try {
        const parts = token.split(".");
        if (parts.length !== 3 || parts.some((part) => !part)) return null;

        const payload = jwtDecode<Omit<IPayload, "role"> & { role: unknown }>(token);
        if (!payload || typeof payload !== "object") return null;

        const role = mapUserRole(payload.role);
        if (!role || !Number.isSafeInteger(payload.sub) || payload.sub <= 0 || typeof payload.name !== "string" || !payload.name.trim() || !Number.isFinite(payload.iat) || payload.iat < 0 || !Number.isFinite(payload.exp) || payload.exp <= Date.now() / 1000) {
            return null;
        }

        return { ...payload, role };
    } catch {
        return null;
    }
}
