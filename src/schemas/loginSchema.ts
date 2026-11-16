import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

export const loginSchema = z.object({
    email: z.string().trim().pipe(z.email({ error: "Informe um e-mail válido." })),
    password: passwordSchema,
    accepted: z.boolean().refine((accepted) => accepted, "Aceite os termos para continuar."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
