import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas/passwordSchema";

function PasswordForm({ token, isInvitation }: { token: string; isInvitation: boolean }) {
    const { register, handleSubmit, reset, clearErrors, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [completed, setCompleted] = useState(false);
    const validToken = /^[a-f0-9]{64}$/.test(token);

    async function handleResetPassword(password: ResetPasswordFormData) {
        if (completed) return;
        setError("");
        setMessage("");

        if (!validToken) {
            setError("Abra um link válido recebido no seu e-mail.");
            return;
        }

        if (!isInvitation) {
            setMessage("A redefinição de senha ainda não está disponível. Tente novamente mais tarde.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/new-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, ...password }),
            });
            const data: { message?: string; errors?: { message: string }[] } | null = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.errors?.[0]?.message || data?.message || "Não foi possível criar sua senha. O convite pode estar inválido ou expirado.");
            }

            setMessage(data?.message || "Senha criada com sucesso. Faça login para acessar o sistema.");
            setCompleted(true);
            reset();
        } catch (error) {
            setError(error instanceof Error && error.name !== "TypeError"
                ? error.message
                : "Não foi possível conectar ao servidor. Tente novamente.");
        }
    }

    function handleInvalidSubmit() {
        setMessage("");

        if (!validToken) {
            clearErrors();
            setError("Abra um link válido recebido no seu e-mail.");
            return;
        }

        setError("");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit(handleResetPassword, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                    <Title className="text-center">{isInvitation ? "Criar senha" : "Redefinir senha"}</Title>
                    <p className="text-normal text-border font-bold text-center">
                        {isInvitation ? "Crie sua senha para acessar o LabSafe." : "Crie uma nova senha com pelo menos 8 caracteres."}
                    </p>
                    {!validToken && (
                        <p role="alert" className="text-small text-red-500">
                            {isInvitation ? "Convite incompleto ou inválido. Solicite um novo convite ao administrador." : "Abra esta página pelo link de recuperação recebido no seu e-mail."}
                        </p>
                    )}
                    {!completed && (
                        <>
                            <FormField label={isInvitation ? "Senha:" : "Nova senha:"} htmlFor="reset-password" className="text-small">
                                <Input id="reset-password" type="password" autoComplete="new-password" minLength={8} required disabled={!validToken || isSubmitting} aria-invalid={!!errors.password} aria-describedby={errors.password ? "reset-password-error" : undefined} {...register("password", {
                                    onChange: () => {
                                        clearErrors("password");
                                        setError("");
                                        setMessage("");
                                    },
                                })} />
                                {errors.password && <p id="reset-password-error" role="alert" className="text-small text-red-500">{errors.password.message}</p>}
                            </FormField>
                            <FormField label={isInvitation ? "Confirmar senha:" : "Confirmar nova senha:"} htmlFor="reset-confirm-password" className="text-small">
                                <Input id="reset-confirm-password" type="password" autoComplete="new-password" minLength={8} required disabled={!validToken || isSubmitting} aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "reset-confirm-password-error" : undefined} {...register("confirmPassword", {
                                    onChange: () => {
                                        clearErrors("confirmPassword");
                                        setError("");
                                        setMessage("");
                                    },
                                })} />
                                {errors.confirmPassword && <p id="reset-confirm-password-error" role="alert" className="text-small text-red-500">{errors.confirmPassword.message}</p>}
                            </FormField>
                        </>
                    )}
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    {message && <p role="status" className="text-small text-border">{message}</p>}
                    {!completed && <Button type="submit" className="w-full" disabled={!validToken || isSubmitting}>{isSubmitting ? "Salvando..." : isInvitation ? "Criar senha" : "Salvar nova senha"}</Button>}
                    {isInvitation && !completed && <p className="text-small text-border text-center">Use pelo menos 8 caracteres. O convite é válido por 5 minutos. Se expirou ou já foi utilizado, solicite um novo convite ao administrador.</p>}
                    {!isInvitation && !completed && <Link to="/forgot-password" className="text-small text-primary underline text-center">
                        Solicitar um novo link
                    </Link>}
                    <Link to="/" className="text-small text-primary underline text-center">
                        Voltar para o login
                    </Link>
                </form>
            </Card>
        </div>
    );
}

function ResetPassword() {
    const [searchParams] = useSearchParams();
    return <PasswordForm key={searchParams.toString()} token={searchParams.get("token")?.trim() ?? ""} isInvitation={searchParams.get("type") === "invitation"} />;
}

export default ResetPassword;
