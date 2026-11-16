import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().trim().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.string().trim().toLowerCase().pipe(z.email({ error: "Informe um e-mail válido." })),
    role: z.enum(["Admin", "Professor(a)", "Aluno(a)"], { error: "Selecione um cargo válido." }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema;

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
