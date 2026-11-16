import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/passwordSchema";

function ForgotPassword() {
    const { register, handleSubmit, clearErrors, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            email: "",
        },
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleForgotPassword(data: ForgotPasswordFormData) {
        setMessage("");
        setError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result: { message?: string; errors?: { message: string }[] } | null = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.errors?.[0]?.message || result?.message || "Não foi possível solicitar a recuperação de senha. Tente novamente.");
            }

            setMessage(result?.message || "Se houver uma conta apta à recuperação com esse e-mail, você receberá as instruções.");
        } catch (error) {
            setError(error instanceof Error && error.name !== "TypeError"
                ? error.message
                : "Não foi possível conectar ao servidor. Tente novamente.");
        }
    }

    function handleInvalidSubmit() {
        setMessage("");
        setError("");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit(handleForgotPassword, handleInvalidSubmit)} noValidate aria-busy={isSubmitting} className="flex flex-col gap-4">
                    <Title className="text-center">Esqueci minha senha</Title>
                    <p className="text-normal text-border font-bold text-center">
                        Informe seu e-mail cadastrado para solicitar um link de recuperação.
                    </p>
                    <FormField label="E-mail:" htmlFor="forgot-email" className="text-small">
                        <Input id="forgot-email" type="email" autoComplete="email" placeholder="seu@email.com" required disabled={isSubmitting} aria-invalid={!!errors.email} aria-describedby={errors.email ? "forgot-email-error" : undefined} {...register("email", {
                            onChange: () => {
                                clearErrors("email");
                                setMessage("");
                                setError("");
                            },
                        })} />
                        {errors.email && <p id="forgot-email-error" role="alert" className="text-small text-red-500">{errors.email.message}</p>}
                    </FormField>
                    {message && <p role="status" className="text-small text-border">{message}</p>}
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar"}</Button>
                    <Link to="/" className="text-small text-primary underline text-center">
                        Voltar para o login
                    </Link>
                </form>
            </Card>
        </div>
    );
}

export default ForgotPassword;
