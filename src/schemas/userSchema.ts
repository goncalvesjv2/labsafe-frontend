import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().trim().min(1, "Informe o nome."),
    email: z.string().trim().pipe(z.email({ error: "Informe um e-mail válido." })),
    role: z.enum(["Admin", "Professor(a)", "Aluno(a)"], { error: "Selecione um cargo válido." }),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.extend({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres.").or(z.literal("")),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
