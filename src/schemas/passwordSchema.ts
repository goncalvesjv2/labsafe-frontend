import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().trim().pipe(z.email({ error: "Informe um e-mail válido." })),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
}).refine((data) => data.password === data.confirmPassword, {
    error: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
