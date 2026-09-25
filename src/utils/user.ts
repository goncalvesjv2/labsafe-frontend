export const userRole = {
    ADMIN: "Admin",
    PROFESSOR: "Professor(a)",
    ALUNO: "Aluno(a)"
} as const;

export type UserRole = typeof userRole[keyof typeof userRole];