import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("A recuperação de senha ainda não está disponível. Tente novamente mais tarde.");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Title className="text-center">Esqueci minha senha</Title>
                    <p className="text-small text-border text-center">
                        Informe seu e-mail cadastrado para solicitar um link de recuperação.
                    </p>
                    <FormField label="E-mail:" htmlFor="forgot-email" className="text-small">
                        <Input id="forgot-email" name="email" type="email" autoComplete="email" placeholder="seu@email.com" required value={email} onChange={(event) => {setEmail(event.target.value); setMessage("");}} />
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
