import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";
import { z } from "zod";
import { resetPasswordSchema } from "../schemas/passwordSchema";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")?.trim();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMessage("");
        setErrors({ password: "", confirmPassword: "" });

        if (!token) {
            setError("Abra o link de recuperação recebido no seu e-mail.");
            return;
        }

        const result = resetPasswordSchema.safeParse({ password, confirmPassword });

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({
                password: fieldErrors.password?.[0] || "",
                confirmPassword: fieldErrors.confirmPassword?.[0] || "",
            });
            return;
        }

        setMessage("A redefinição de senha ainda não está disponível. Tente novamente mais tarde.");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <Title className="text-center">Redefinir senha</Title>
                    <p className="text-small text-border text-center">
                        Crie uma nova senha com pelo menos 8 caracteres.
                    </p>
                    {!token && (
                        <p role="alert" className="text-small text-red-500">
                            Abra esta página pelo link de recuperação recebido no seu e-mail.
                        </p>
                    )}
                    <FormField label="Nova senha:" htmlFor="reset-password" className="text-small">
                        <Input id="reset-password" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={!token} value={password} onChange={(event) => {
                            setPassword(event.target.value);
                            setErrors({ ...errors, password: "" });
                            setError("");
                            setMessage("");
                        }} />
                        {errors.password && <p role="alert" className="text-small text-red-500">{errors.password}</p>}
                    </FormField>
                    <FormField label="Confirmar nova senha:" htmlFor="reset-confirm-password" className="text-small">
                        <Input id="reset-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required disabled={!token} value={confirmPassword} onChange={(event) => {
                            setConfirmPassword(event.target.value);
                            setErrors({ ...errors, confirmPassword: "" });
                            setError("");
                            setMessage("");
                        }} />
                        {errors.confirmPassword && <p role="alert" className="text-small text-red-500">{errors.confirmPassword}</p>}
                    </FormField>
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    {message && <p role="status" className="text-small text-border">{message}</p>}
                    <Button type="submit" className="w-full" disabled={!token}>Salvar nova senha</Button>
                    <Link to="/forgot-password" className="text-small text-primary underline text-center">
                        Solicitar um novo link
                    </Link>
                    <Link to="/" className="text-small text-primary underline text-center">
                        Voltar para o login
                    </Link>
                </form>
            </Card>
        </div>
    );
}

export default ResetPassword;
