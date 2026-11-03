import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";
import { z } from "zod";
import { forgotPasswordSchema } from "../schemas/passwordSchema";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({ email: "" });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setErrors({ email: "" });

        const result = forgotPasswordSchema.safeParse({ email });

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({ email: fieldErrors.email?.[0] || "" });
            return;
        }

        setMessage("A recuperação de senha ainda não está disponível. Tente novamente mais tarde.");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <Title className="text-center">Esqueci minha senha</Title>
                    <p className="text-small text-border text-center">
                        Informe seu e-mail cadastrado para solicitar um link de recuperação.
                    </p>
                    <FormField label="E-mail:" htmlFor="forgot-email" className="text-small">
                        <Input id="forgot-email" name="email" type="email" autoComplete="email" placeholder="seu@email.com" required value={email} onChange={(event) => {
                            setEmail(event.target.value);
                            setErrors({ email: "" });
                            setMessage("");
                        }} />
                        {errors.email && <p role="alert" className="text-small text-red-500">{errors.email}</p>}
                    </FormField>
                    {message && <p role="status" className="text-small text-border">{message}</p>}
                    <Button type="submit" className="w-full">Enviar</Button>
                    <Link to="/" className="text-small text-primary underline text-center">
                        Voltar para o login
                    </Link>
                </form>
            </Card>
        </div>
    );
}

export default ForgotPassword;
