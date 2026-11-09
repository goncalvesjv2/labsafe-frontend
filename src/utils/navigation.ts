import { Users, User, LayoutDashboard, SquareText, ClipboardList, FlaskConical, type LucideIcon } from "lucide-react";
import { userRole, type UserRole } from "./user";

interface MenuItem {
    text: string;
    path: string;
    icon: LucideIcon;
}

export const menusByRole = {
    [userRole.ADMIN]: [
        { text: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { text: "Usuários", path: "/users", icon: Users },
        { text: "Perfil", path: "/profile", icon: User },
    ],
    [userRole.PROFESSOR]: [
        { text: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { text: "Conteúdo", path: "/contents", icon: SquareText },
        { text: "Quiz", path: "/quiz", icon: ClipboardList },
        { text: "Perfil", path: "/profile", icon: User },
    ],
    [userRole.ALUNO]: [
        { text: "Conteúdo", path: "/contents", icon: SquareText },
        { text: "Quiz", path: "/quiz", icon: ClipboardList },
        { text: "Perfil", path: "/profile", icon: User },
        { text: "Reagentes", path: "/reagents", icon: FlaskConical },
    ],
} satisfies Record<UserRole, [MenuItem, ...MenuItem[]]>;

export function getDefaultRoute(role: UserRole): string {
    return menusByRole[role][0].path;
}
