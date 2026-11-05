import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().pipe(z.email({ error: "Informe um e-mail válido." })),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    accepted: z.boolean().refine((accepted) => accepted, "Aceite os termos para continuar."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
