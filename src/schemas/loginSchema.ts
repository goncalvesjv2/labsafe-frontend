import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().pipe(z.email({ error: "Informe um e-mail válido." })),
    password: z.string().min(1, "Informe sua senha."),
    accepted: z.literal(true, { error: "Aceite os termos para continuar." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;