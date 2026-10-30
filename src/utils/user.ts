export const userRole = {
    ADMIN: "Admin",
    PROFESSOR: "Professor(a)",
    ALUNO: "Aluno(a)"
} as const;

export type UserRole = typeof userRole[keyof typeof userRole];

export function mapUserRole(role: unknown): UserRole | null {
    switch (role) {
        case userRole.ADMIN:
            return userRole.ADMIN;
        case "Professor_a_":
        case userRole.PROFESSOR:
            return userRole.PROFESSOR;
        case "Aluno_a_":
        case userRole.ALUNO:
            return userRole.ALUNO;
        default:
            return null;
    }
}