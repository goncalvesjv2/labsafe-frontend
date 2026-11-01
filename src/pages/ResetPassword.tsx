import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")?.trim();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!token) {
            setError("Abra o link de recuperação recebido no seu e-mail.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas devem ser iguais.");
            return;
        }

        setMessage("A redefinição de senha ainda não está disponível. Tente novamente mais tarde.");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        <Input id="reset-password" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={!token} value={password} onChange={(event) => {setPassword(event.target.value); setError(""); setMessage("");}} />
                    </FormField>
                    <FormField label="Confirmar nova senha:" htmlFor="reset-confirm-password" className="text-small">
                        <Input id="reset-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required disabled={!token} value={confirmPassword} onChange={(event) => {setConfirmPassword(event.target.value); setError(""); setMessage("");}} />
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