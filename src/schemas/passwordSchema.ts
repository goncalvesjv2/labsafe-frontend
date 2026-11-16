import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().trim().pipe(z.email({ error: "Informe um e-mail válido." })),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const passwordSchema = z.string().trim().min(8, "A senha deve ter no mínimo 8 caracteres.").refine((password) => new TextEncoder().encode(password).length <= 72, "A senha deve ter no máximo 72 bytes.");

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
    error: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
